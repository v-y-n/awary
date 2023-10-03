import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import {App} from "@app/core";
import {Caller} from "@app/core/features/projects/entities/Caller";
import {Project} from "@app/core/features/projects/entities/Project";
import {MissingAuthorization} from "@app/core/features/projects/exceptions/MissingAuthorization";
import {MissingResource} from "@app/core/features/projects/exceptions/MissingResource";
import {ProjectContext} from "@app/core/features/projects/ProjectContext";
import {User} from "@app/core/features/users/entities/User";
import {AuthenticationFailed} from "@app/core/features/users/exceptions/AuthenticationFailed";
import {SignupFailed, SignupFailedCode} from "@app/core/features/users/exceptions/SignupFailed";
import fastify, {FastifyInstance, FastifyLoggerInstance, InjectOptions, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault} from "fastify";
import {Logger} from "utils/logger";
import {projectsRoutes, usersRoutes, logsRoutes, metricsRoutes} from "./routes";
import {viewsRoutes} from "./routes/views.routes";
import {LimitReached} from "@app/core/exceptions/LimitReached";
import {adminRoutes} from "./routes/admin.routes";

export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyLoggerInstance,
  TypeBoxTypeProvider
>;

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { email: string } // payload type is used for signing and verifying
		user: { email: string }
	}
}

declare module "fastify" {
	interface FastifyRequest { 
		data: { // [TODO] This file shouldn't know about these classes
			user: User		
			caller: Caller
			project: Project		
			context: ProjectContext
		},
	}
}

export class HttpServer {

	server: FastifyTypebox
	app: App

	constructor(app: App) {
		this.app = app;
		this.server = fastify({
			ajv: {
				customOptions: {
					strict: 'log',
					keywords: ['kind', 'modifier']
				}
			}
		}).withTypeProvider<TypeBoxTypeProvider>();
	}

	async listen() {
		this.server.listen({host: process.env.SERVER_HOST || "0.0.0.0", port: parseInt(process.env.SERVER_PORT || "8080")}, (err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log(`Server listening at ${address}`);
		});
	}

	async inject(data: InjectOptions) {
		return this.server.inject(data);
	}

	async setup() {
		if (!process.env.JWT_SECRET) {
			throw Error("Missing JWT_SECRET env var");
		}
	
		await this.server.register(fastifyCors);
		await this.server.register(fastifyJwt, {secret: process.env.JWT_SECRET});
	
		this.server.addHook("onSend", (req, reply, payload, done) => {
	
			if (req.method === "OPTIONS") {
				done();
				return ;
			}
	
			if (reply.statusCode >= 200 && reply.statusCode < 300)
				Logger.success(`${req.method} ${reply.statusCode} ${req.url}`);
			else if (reply.statusCode >= 500)
				Logger.error(`${req.method} ${reply.statusCode} ${req.url}`);
			else 
				Logger.warn(`${req.method} ${reply.statusCode} ${req.url}`);
			done();
		});

		this.server.setErrorHandler((err, req, reply) => {
			let statusCode
			if (err instanceof AuthenticationFailed) {
				statusCode = 401
			} else if (err instanceof SignupFailed) {
				statusCode = 500
				if (err.errorCode === SignupFailedCode.EmailAlreadyInUse) {
					statusCode = 409
				} else if (err.errorCode === SignupFailedCode.NotEnabled) {
					statusCode = 401
				}
			} else if (err instanceof MissingAuthorization) {
				statusCode = 401
			} else if (err instanceof MissingResource) {
				statusCode = 404;
			} else if (err instanceof LimitReached) {
				statusCode = 422;
			}

			if (statusCode) {
				reply.status(statusCode).send({error: err.message})
			} else {
				reply.send(err)
			}
		})
	
		this.server.addHook("onError", (req, reply, error, done) => {
			if (!error.validation) {
				Logger.error(error);
			}
			done();
		});
	
		this.server.register(usersRoutes(this.app));
		this.server.register(projectsRoutes(this.app));
		this.server.register(logsRoutes(this.app));
		this.server.register(metricsRoutes(this.app));
		this.server.register(viewsRoutes(this.app));
		this.server.register(adminRoutes(this.app));
	
		return this.server;
	}
}
