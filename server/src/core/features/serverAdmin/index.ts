import {Feature, AppServices} from "@app/core/Feature";
import {LogFeature} from "../logs";
import {MetricFeature} from "../metrics";
import {ProjectFeature} from "../projects";
import {UserFeature} from "../users";
import {ServerAdminUseCases} from "./ServerAdminUseCases";

export type ServerAdminFeatureDependencies = {
	userFeature: UserFeature
	projectFeature: ProjectFeature
	logFeature: LogFeature
	metricFeature: MetricFeature
}

export class ServerAdminFeature extends Feature {

	public name = "ActivityLogger"
	public useCases: ServerAdminUseCases
	public dependencies: ServerAdminFeatureDependencies

	constructor(services: AppServices, dependencies: ServerAdminFeatureDependencies) {
		super(services);
		this.dependencies = dependencies
		this.useCases = new ServerAdminUseCases({
			userFeature: this.dependencies.userFeature,
			projectFeature: this.dependencies.projectFeature,
			logFeature: this.dependencies.logFeature,
			metricFeature: this.dependencies.metricFeature
		})
	}
}
