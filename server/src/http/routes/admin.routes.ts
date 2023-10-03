import {FastifyInstance} from "fastify";
import {App} from "@app/core";
import {AppData, withData} from "http/utils";

export function adminRoutes(app: App) {
	const adminUseCases = app.serverAdminFeature.useCases

	return async (server: FastifyInstance) => {

		server.get("/admin/server-stats",
			{
				preValidation: [withData(app, [AppData.Caller])]
			},
			async function (request) {
				const {caller} = request.data;
				return adminUseCases.getGlobalStats(caller);
			}
		);
	}
}
