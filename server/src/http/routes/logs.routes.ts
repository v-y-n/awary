import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {CreateLogBody, CreateLogParams, CreateTagBody, DeleteLogParams, DeleteTagParams, UpdateTagBody, UpdateTagParams} from "./logs.def";
import {LogsUseCases} from "@app/core/features/logs/LogsUseCases";
import {ProjectsUseCases} from "@app/core/features/projects/ProjectsUseCases";
import {UsersUseCases} from "@app/core/features/users/UsersUseCases";
import {App} from "@app/core";
import {AppData, rateLimit, withData} from "http/utils";

export type MetricRoutesDependencies = {
	logService: LogsUseCases,
	projectService: ProjectsUseCases,
	userService: UsersUseCases
}

export function logsRoutes(app: App) {
	const logUseCases = app.logFeature.useCases
	return async (server: FastifyInstance) => {

		server.get("/projects/:projectId/logs",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request, reply) {
				const {context} = request.data;
				const logs = await logUseCases.getLogs(context);
				const tags = await logUseCases.getTags(context);
				const formattedLogs = logs.map(log => ({
					...log,
					tags: log.tags.map(logTag => tags.find(tag => tag.id === logTag)).filter(t => t)
				}))
				reply.status(200).send(formattedLogs);
			}
		);

		server.post<{Body: Static<typeof CreateLogBody>, Params: Static<typeof CreateLogParams>}>(
			"/projects/:projectId/logs",
			{
				preValidation: [rateLimit(1, 1000), withData(app, [AppData.Context])],
				schema: {body: CreateLogBody, params: CreateLogParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {title, content, tags} = request.body;
				await logUseCases.addLog(context, {title, content, tags})
				reply.status(201).send({});
			}
		);

		server.delete<{Params: Static<typeof DeleteLogParams>}>(
			"/projects/:projectId/logs/:logId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: DeleteLogParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {logId} = request.params
				const log = await logUseCases.getLogById(context, logId)
				await logUseCases.deleteLog(context, log);
				reply.status(200).send();
			}
		);

		server.get("/projects/:projectId/tags",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request, reply) {
				const {context} = request.data;
				const tags = await logUseCases.getTags(context);
				reply.status(200).send(tags);
			}
		);

		server.post<{Body: Static<typeof CreateTagBody>}>(
			"/projects/:projectId/tags",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: CreateTagBody}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {name, color} = request.body;
				const tag = await logUseCases.createTag(context, {name, color})
				reply.status(201).send({id: tag.id});
			}
		);

		server.put<{Body: Static<typeof UpdateTagBody>, Params: Static<typeof UpdateTagParams>}>(
			"/projects/:projectId/tags/:tagId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: UpdateTagBody, params: UpdateTagParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {name, color} = request.body;
				const {tagId} = request.params;
				const tag = await logUseCases.getTag(context, tagId);
				await logUseCases.updateTag(context, tag, {name, color})
				reply.status(200).send({});
			}
		);

		server.delete<{Params: Static<typeof DeleteTagParams>}>(
			"/projects/:projectId/tags/:tagId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: DeleteTagParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {tagId} = request.params
				const tag = await logUseCases.getTag(context, tagId)
				await logUseCases.deleteTag(context, tag);
				reply.status(200).send();
			}
		);
	}
}
