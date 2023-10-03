import {Feature, AppServices} from "@app/core/Feature";
import {LogFeature} from "../logs";
import {MetricFeature} from "../metrics";
import {ProjectFeature} from "../projects";
import {UserFeature} from "../users";
import {ActivityLoggerService} from "./ActivityLogger";

export type ActivityLoggerFeatureDependencies = {
	userFeature: UserFeature
	projectFeature: ProjectFeature
	logFeature: LogFeature
	metricFeature: MetricFeature
}

export class ActivityLoggerFeature extends Feature {

	public name = "ActivityLogger"
	public service: ActivityLoggerService
	public dependencies: ActivityLoggerFeatureDependencies

	constructor(services: AppServices, dependencies: ActivityLoggerFeatureDependencies) {
		super(services);
		this.dependencies = dependencies
		this.service = new ActivityLoggerService({
			userFeature: this.dependencies.userFeature,
			projectFeature: this.dependencies.projectFeature,
			logService: this.dependencies.logFeature.useCases,
			metricFeature: this.dependencies.metricFeature
		})
	}
}
