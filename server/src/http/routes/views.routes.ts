import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {App} from "@app/core";
import {AppData, withData} from "http/utils";
import {CreateViewBody, CreateViewParams, GetViewsQuerystring, UpdateViewBody, UpdateViewParams} from "./views.def";

export function viewsRoutes(app: App) {
	const viewsUseCases = app.viewsFeature.useCases
	return async (server: FastifyInstance) => {

		server.get<{Querystring: Static<typeof GetViewsQuerystring>}>("/projects/:projectId/views",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {querystring: GetViewsQuerystring}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {type} = request.query
				let views = []
				if (type) {
					views = await viewsUseCases.getViewsByType(context, type)
				} else {
					views = await viewsUseCases.getAllViews(context)
				}
				reply.status(200).send(views);
			}
		);

		server.post<{Body: Static<typeof CreateViewBody>, Params: Static<typeof CreateViewParams>}>(
			"/projects/:projectId/views",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: CreateViewBody, params: CreateViewParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				await viewsUseCases.createView(context, request.body)
				reply.status(201).send({});
			}
		);

		server.put<{Body: Static<typeof UpdateViewBody>, Params: Static<typeof UpdateViewParams>}>(
			"/projects/:projectId/views/:viewId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: UpdateViewBody, params: UpdateViewParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {viewId} = request.params
				const view = await app.viewsFeature.repository.findOne(viewId)
				if (!view) {
					return reply.status(404).send();
				}
				await viewsUseCases.updateView(context, view, request.body)
				reply.status(201).send({});
			}
		);
	}
}
