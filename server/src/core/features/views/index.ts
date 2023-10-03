import {Feature, AppServices} from "@app/core/Feature";
import {MetricFeature} from "../metrics";
import {ViewsRepository} from "./ViewsRepository";
import {ViewsUseCases} from "./ViewsUseCases";

export * from "./entities"

export type ViewsFeatureDependencies = {
	metricFeature: MetricFeature
}

export class ViewsFeature extends Feature {

	name = "Views"
	dependencies:ViewsFeatureDependencies

	repository: ViewsRepository
	useCases: ViewsUseCases

	constructor(services: AppServices, dependencies: ViewsFeatureDependencies) {
		super(services);
		this.dependencies = dependencies
		this.repository = new ViewsRepository(services.db)
		this.useCases = new ViewsUseCases({
			viewsRepository: this.repository
		})
	}
}
