import {Feature, AppServices} from "@app/core/Feature";
import {UserFeature} from "../users";
import {ApiKeyRepository} from "./ApiKeyRepository";
import {ProjectEvents} from "./ProjectsEvents";
import {ProjectsRepository} from "./ProjectsRepository";
import {ProjectsUseCases} from "./ProjectsUseCases";

export type ProjectFeatureDependencies = {
	userFeature: UserFeature
}

export class ProjectFeature extends Feature {

	name = "Project"
	projectRepository: ProjectsRepository
	apiKeyRepository: ApiKeyRepository
	service: ProjectsUseCases
	dependencies: ProjectFeatureDependencies
	events: ProjectEvents = new ProjectEvents()

	constructor(services: AppServices, dependencies: ProjectFeatureDependencies) {
		super(services);
		this.projectRepository = new ProjectsRepository(services.db)
		this.apiKeyRepository = new ApiKeyRepository(services.db)
		this.service = new ProjectsUseCases({
			projectRepository: this.projectRepository,
			projectEvents: this.events,
			apiKeyRepository: this.apiKeyRepository
		})
		this.dependencies = dependencies
	}
}
