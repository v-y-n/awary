import {Db} from "mongodb";
import {UserFeature} from "./features/users";
import {ProjectFeature} from "./features/projects";
import {MetricFeature} from "./features/metrics";
import {LogFeature} from "./features/logs";
import {ActivityLoggerFeature} from "./features/activityLogger";
import {ViewsFeature} from "./features/views";
import {Logger} from "@app/utils/logger";
import {ServerAdminFeature} from "./features/serverAdmin";

export class App {

	db?: Db
	userFeature: UserFeature
	projectFeature: ProjectFeature
	logFeature: LogFeature
	metricFeature: MetricFeature
	viewsFeature: ViewsFeature
	activityLogger: ActivityLoggerFeature
	serverAdminFeature: ServerAdminFeature

	constructor(db: Db) {
		const services = {db}
		this.userFeature = new UserFeature(services);
		this.projectFeature = new ProjectFeature(services, {
			userFeature: this.userFeature
		});
		this.logFeature = new LogFeature(services, {
			userFeature: this.userFeature,
			projectFeature: this.projectFeature
		})
		this.metricFeature = new MetricFeature(services, {
			userFeature: this.userFeature,
			projectFeature: this.projectFeature
		})
		this.viewsFeature = new ViewsFeature(services, {
			metricFeature: this.metricFeature
		})
		this.activityLogger = new ActivityLoggerFeature(services, {
			userFeature: this.userFeature,
			projectFeature: this.projectFeature,
			logFeature: this.logFeature,
			metricFeature: this.metricFeature
		})
		this.serverAdminFeature = new ServerAdminFeature(services, {
			userFeature: this.userFeature,
			projectFeature: this.projectFeature,
			logFeature: this.logFeature, 
			metricFeature: this.metricFeature
		})
	}

	async start(): Promise<void> {
		Logger.info("Starting application")
	}
}
