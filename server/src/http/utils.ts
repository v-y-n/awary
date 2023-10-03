import {App} from "@app/core";
import {AdminUser, Caller} from "@app/core/features/projects/entities/Caller";
import {Project} from "@app/core/features/projects/entities/Project";
import {ProjectContext} from "@app/core/features/projects/ProjectContext";
import {User} from "@app/core/features/users/entities";
import {AuthenticationFailed} from "@app/core/features/users/exceptions/AuthenticationFailed";
import {ADMIN_TOKEN} from "@app/utils";
import {FastifyReply, FastifyRequest} from "fastify";

export function rateLimit(count: number, ms: number) {
	let rateLimitCache: { [callerId: string]: { [url: string]: number } } = {}
	setInterval(() => { rateLimitCache = {} }, ms)

	return async (request: FastifyRequest, reply: FastifyReply) => {
		if (process.env.RATE_LIMIT_ENABLED !== 'true') {
			return ;
		}
		let callerId = "";
		try {
			await request.jwtVerify();	
			callerId = request.user.email
		} catch (e) {
			callerId = request.headers.authorization?.split(' ')[1] || ""
		}
		if (!rateLimitCache[callerId]) {
			rateLimitCache[callerId] = {}
		}
		if (!rateLimitCache[callerId][request.url]) {
			rateLimitCache[callerId][request.url] = 0
		}
		if (rateLimitCache[callerId][request.url] >= count) {
			return reply.status(429).send({message: "Rate limit reached"});
		}

		rateLimitCache[callerId][request.url] += 1
	}
}

export enum AppData {
	Caller,
	Project,
	Context
}

export function withData(app: App, required: AppData[]) {
	const projectRepository = app.projectFeature.projectRepository
	const userRepository = app.userFeature.repository
	const apiKeyRepository = app.projectFeature.apiKeyRepository
	return async (request: FastifyRequest) => {
		let user
		let caller
		let project
		let context

		if (required.includes(AppData.Caller) || required.includes(AppData.Context)) {
			try {
				await request.jwtVerify();	
				const userData = await userRepository.findUserByEmail(request.user.email);
				if (userData) {
					user = new User(userData)
					caller = new Caller(new User(userData))
				}
			} catch (e) {
				const token = request.headers.authorization?.split(' ')[1]
				if (typeof token !== "string") {
					throw new AuthenticationFailed("Unknown authorization token");
				}
				if (token === ADMIN_TOKEN) {
					caller = new Caller(new AdminUser())
				} else {
					const apiKey = await apiKeyRepository.findByKey(token);
					if (!apiKey) {
						throw new AuthenticationFailed("Unknown authorization token");
					}
					caller = new Caller(apiKey)
				}
			}
			if (!caller) {
				throw new AuthenticationFailed("Unknown authorization token");
			}
		}

		if (required.includes(AppData.Project) || required.includes(AppData.Context)) {
			const params = request.params as Record<string, unknown>
			const projectId = params.projectId as string
			project = await projectRepository.findProjectById(projectId);
			if (!project) {
				throw new Error("Unknown project id");
			}
		}


		if (required.includes(AppData.Context)) {
			if (!caller || !project) {
				throw new Error("Missing information to create a project Context")
			}
			context = new ProjectContext(project, caller)
		}

		request.data = {
			user: user as User,
			caller: caller as Caller,
			project: project as Project,
			context: context as ProjectContext
		}

		return request.data
	}
}
