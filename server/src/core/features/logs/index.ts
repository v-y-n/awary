import {Feature, AppServices} from "@app/core/Feature";
import {ProjectFeature} from "../projects";
import {UserFeature} from "../users";
import {LogsRepository} from "./LogsRepository";
import {LogsUseCases} from "./LogsUseCases";
import {TagsRepository} from "./TagsRepository";

export type LogFeatureDependencies = {
	userFeature: UserFeature
	projectFeature: ProjectFeature
}

export class LogFeature extends Feature {

	name = "Log"
	logsRepository: LogsRepository
	tagsRepository: TagsRepository
	useCases: LogsUseCases
	dependencies: LogFeatureDependencies

	constructor(services: AppServices, dependencies: LogFeatureDependencies) {
		super(services);
		this.logsRepository = new LogsRepository(services.db)
		this.tagsRepository = new TagsRepository(services.db)
		this.dependencies = dependencies
		this.useCases = new LogsUseCases({
			projectService: this.dependencies.projectFeature.service,
			logsRepository: this.logsRepository,
			tagsRepository: this.tagsRepository
		})
	}
}
