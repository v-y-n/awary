import {MissingResource} from "../projects/exceptions/MissingResource";
import {ProjectAuthorization, ProjectContext} from "../projects/ProjectContext";
import {ProjectsUseCases} from "../projects/ProjectsUseCases";
import {Log, LogDataOnCreation, Tag, TagOnCreation} from "./entities";
import {LogsRepository} from "./LogsRepository";
import {TagsRepository} from "./TagsRepository";

interface LogServiceDependencies {
	projectService: ProjectsUseCases,
	logsRepository: LogsRepository,
	tagsRepository: TagsRepository
}

export class LogsUseCases {
	private _projectService: ProjectsUseCases
	private _logsRepository: LogsRepository
	private _tagsRepository: TagsRepository

	constructor(dependencies: LogServiceDependencies) {
		this._projectService = dependencies.projectService
		this._logsRepository = dependencies.logsRepository
		this._tagsRepository = dependencies.tagsRepository
	}

	async addLog(context: ProjectContext, log: LogDataOnCreation): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._logsRepository.create(context.project, {
			title: log.title,
			content: log.content,
			tags: log.tags,
		})
	}

	async getLogById(context: ProjectContext, logId: string): Promise<Log> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		const log = await this._logsRepository.findLogById(logId)
		if (!log) {
			throw new MissingResource("Log doesn't exist")
		}
		return log;
	}

	async getLogs(context: ProjectContext) {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		return await this._logsRepository.findLogs(context.project);
	}

	async deleteLog(context: ProjectContext, log: Log) {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._logsRepository.deleteLog(log);
	}

	async createTag(context: ProjectContext, data: Omit<TagOnCreation, "projectId">): Promise<Tag> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		return this._tagsRepository.create(context.project, {
			projectId: context.project.id,
			name: data.name,
			color: data.color,
		})
	}

	async updateTag(context: ProjectContext, tag: Tag, data: Omit<TagOnCreation, "projectId">): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._tagsRepository.updateTag(tag, {
			name: data.name,
			color: data.color,
		})
	}

	async getTags(context: ProjectContext): Promise<Tag[]> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		return await this._tagsRepository.findByProject(context.project);
	}

	async getTag(context: ProjectContext, id: string): Promise<Tag> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const tag = await this._tagsRepository.findById(context.project, id);
		if (!tag) {
			throw new MissingResource("Tag doesn't exist")
		}
		return tag;
	}

	async deleteTag(context: ProjectContext, tag: Tag): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		await this._tagsRepository.deleteTag(tag);
	}
}
