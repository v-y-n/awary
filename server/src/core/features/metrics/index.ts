import {Feature, AppServices} from "@app/core/Feature";
import {ProjectFeature} from "../projects";
import {UserFeature} from "../users";
import {MetricEvents} from "./MetricsEvents";
import {MetricsRepository} from "./MetricsRepository";
import {MetricsUseCases} from "./MetricsUseCases";

export * from "./MetricsUseCases"
export * from "./entities"

export type MetricFeatureDependencies = {
	userFeature: UserFeature
	projectFeature: ProjectFeature
}

export class MetricFeature extends Feature {

	name = "Metric"
	events: MetricEvents = new MetricEvents()
	dependencies: MetricFeatureDependencies

	repository: MetricsRepository
	useCases: MetricsUseCases

	constructor(services: AppServices, dependencies: MetricFeatureDependencies) {
		super(services);
		this.repository = new MetricsRepository(services.db)
		this.dependencies = dependencies
		this.useCases = new MetricsUseCases({
			projectService: this.dependencies.projectFeature.service,
			metricRepository: this.repository,
			metricEvents: this.events
		})
	}
}
