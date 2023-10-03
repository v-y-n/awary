import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {CreateApiKeyBody, CreateApiKeyParams, CreateProjectBody, DeleteApiKeyParams} from "./projects.def";
import {App} from "@app/core";
import {AppData, withData} from "http/utils";
import {ProjectAuthorization} from "@app/core/features/projects/ProjectContext";

export function projectsRoutes(app: App) {
	const projectService = app.projectFeature.service

	return async (server: FastifyInstance) => {
		server.post<{Body: Static<typeof CreateProjectBody>}>("/projects",
			{
				preValidation: [withData(app, [AppData.Caller])],
				schema: {body: CreateProjectBody}
			},
			async (request, reply) => {
				const {name} = request.body;
				const {caller} = request.data;

				const project = await projectService.createProject(caller.asUser(), name);

				reply.status(201).send({id: project.id});
			}
		);

		server.get("/projects",
			{
				preValidation: [withData(app, [AppData.Caller])]
			},
			async function (request) {
				const {caller} = request.data;
				const projects = await projectService.getProjectsOfUser(caller.asUser());
				return projects.map(project => project.getState())
			}
		);

		server.get("/projects/:projectId",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request) {
				const {context} = request.data;
				context.enforceAuthorizations([ProjectAuthorization.Read])
				return context.project.getState();
			});

		
		
		server.get("/projects/:projectId/apiKeys",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request) {
				const {context} = request.data;
				const apiKeys = projectService.getApiKeysOfProject(context);
				return apiKeys
			}
		);

		server.post<{Body: Static<typeof CreateApiKeyBody>, Params: Static<typeof CreateApiKeyParams>}>(
			"/projects/:projectId/apiKeys",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: CreateApiKeyBody, params: CreateApiKeyParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {name} = request.body;
				const apiKey = await projectService.generateApiKey(context, name);
				reply.status(201).send({apiKey});
			}
		);

		server.delete<{Params: Static<typeof DeleteApiKeyParams>}>(
			"/projects/:projectId/apiKeys/:apiKeyId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: DeleteApiKeyParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {apiKeyId} = request.params;
				const apiKey = await projectService.getApiKeyById(context, apiKeyId);
				await projectService.deleteApiKeys(context, apiKey);
				reply.status(200).send({apiKey});
			}
		);
	}
}
