import {FastifyInstance} from "fastify";
import {Static} from "@sinclair/typebox";
import {App} from "@app/core";
import {SetMetricValueBody, SetMetricValueParams, CreateMetricBody, CreateMetricParams, UpdateMetricBody, UpdateMetricParams, DeleteHistoryRecordParams} from "./metrics.def";
import {ProjectsUseCases} from "@app/core/features/projects/ProjectsUseCases";
import {UsersUseCases} from "@app/core/features/users/UsersUseCases";
import {AppData, rateLimit, withData} from "http/utils";
import {MetricsUseCases} from "@app/core/features/metrics";

export type MetricRouteDependencies = {
	metricService: MetricsUseCases,
	projectService: ProjectsUseCases,
	userService: UsersUseCases
}

export function metricsRoutes(app: App) {
	const metricsUseCases = app.metricFeature.useCases
	return async (server: FastifyInstance) => {

		server.get("/projects/:projectId/metrics",
			{
				preValidation: [withData(app, [AppData.Context])]
			},
			async function (request, reply) {
				const {context} = request.data;
				const metrics = await metricsUseCases.getAllMetrics(context, true);
				reply.status(200).send(metrics);
			}
		);

		server.post<{Body: Static<typeof CreateMetricBody>, Params: Static<typeof CreateMetricParams>}>(
			"/projects/:projectId/metrics",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: CreateMetricBody, params: CreateMetricParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {name} = request.body;
				const metric = await metricsUseCases.createMetric(context, {name})
				reply.status(201).send({id: metric.id});
			}
		);

		server.put<{Body: Static<typeof UpdateMetricBody>, Params: Static<typeof UpdateMetricParams>}>(
			"/projects/:projectId/metrics/:metricId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {body: UpdateMetricBody, params: UpdateMetricParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {metricId} = request.params
				const {name} = request.body;
				const metric = await metricsUseCases.getMetricById(context, metricId)
				if (!metric) {
					return reply.status(404).send();
				}
				await metricsUseCases.updateMetric(context, metric, {name});
				reply.status(200).send({});
			}
		);

		server.get<{Params: Static<typeof SetMetricValueParams>}>(
			"/projects/:projectId/metrics/:metricId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: SetMetricValueParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {metricId} = request.params
				const metric = await metricsUseCases.getMetricById(context, metricId, true)
				reply.status(200).send(metric);
			}
		);

		server.post<{Body: Static<typeof SetMetricValueBody>, Params: Static<typeof SetMetricValueParams>}>(
			"/projects/:projectId/metrics/:metricId",
			{
				preValidation: [rateLimit(1, 1000), withData(app, [AppData.Context])],
				schema: {body: SetMetricValueBody, params: SetMetricValueParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {metricId} = request.params
				const {value, date} = request.body;
				const metric = await metricsUseCases.getMetricById(context, metricId)
				await metricsUseCases.setMetricValue(context, metric, value, date);
				reply.status(201).send({});
			}
		);

		server.delete<{Params: Static<typeof SetMetricValueParams>}>(
			"/projects/:projectId/metrics/:metricId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: SetMetricValueParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {metricId} = request.params
				const metric = await metricsUseCases.getMetricById(context, metricId)
				await metricsUseCases.deleteMetric(context, metric)
				reply.status(200).send();
			}
		);

		server.delete<{Params: Static<typeof DeleteHistoryRecordParams>}>(
			"/projects/:projectId/metrics/:metricId/history/:recordId",
			{
				preValidation: [withData(app, [AppData.Context])],
				schema: {params: DeleteHistoryRecordParams}
			},
			async function (request, reply) {
				const {context} = request.data;
				const {metricId, recordId} = request.params
				const metric = await metricsUseCases.getMetricById(context, metricId)
				await metricsUseCases.deleteMetricHistoryRecord(context, metric, recordId);
				reply.status(200).send({});
			}
		);
	}
}
