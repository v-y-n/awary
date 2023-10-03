import {LimitReached} from "@app/core/exceptions/LimitReached";
import {User} from "@app/core/features/users/entities/User";
import {randomBytes} from "crypto";
import {getAccountProjectsLimit} from "../users/utils";
import {ApiKeyRepository} from "./ApiKeyRepository";
import {ApiKey, Caller, Project} from "./entities";
import {MissingResource} from "./exceptions/MissingResource";
import {ProjectAuthorization, ProjectContext} from "./ProjectContext";
import {ProjectEvents} from "./ProjectsEvents";
import {ProjectsRepository} from "./ProjectsRepository";

interface ProjectServiceDependencies {
	projectRepository: ProjectsRepository,
	projectEvents: ProjectEvents
	apiKeyRepository: ApiKeyRepository
}

export class ProjectsUseCases {
	private _projectRepository: ProjectsRepository
	private _projectEvents: ProjectEvents
	private _apiKeyRepository: ApiKeyRepository

	constructor(dependencies: ProjectServiceDependencies) {
		this._projectRepository = dependencies.projectRepository
		this._projectEvents = dependencies.projectEvents
		this._apiKeyRepository = dependencies.apiKeyRepository
	}

	async createProject(owner: User, name: string): Promise<Project> {
		const userProjects = await this._projectRepository.findProjectsOfUser(owner);
		if (userProjects.length >= getAccountProjectsLimit()) {
			throw new LimitReached(`Maximum account limit (${getAccountProjectsLimit()}) reached`)
		}
		const project = await this._projectRepository.createProject({
			name,
			ownerId: owner.id,
			tags: [],
			createdAt: Date.now(),
			updatedAt: Date.now()
		});
		await this._projectEvents.onProjectCreated.emit({project, caller: new Caller(owner)})
		return project;
	}

	async getProjectsOfUser(user: User): Promise<Project[]> {
		const projects = await this._projectRepository.findProjectsOfUser(user);
		return projects;
	}

	async getProjectById(caller:  Caller, id: string): Promise<Project | null> {
		const project = await this._projectRepository.findProjectById(id);
		if (!project) {
			throw new MissingResource("Project not found")
		}
		const context = new ProjectContext(project, caller)
		context.enforceAuthorizations([ProjectAuthorization.Read])
		return project;
	}

	async addTagToProject(context: ProjectContext, {name, color}: {name: string, color: string}): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const {project} = context;
		await this._projectRepository.addTag(project, {id: project.tags.length + 1, name, color});
	}

	async updateTagOfProject(context: ProjectContext, id: number, {name, color}: {name: string, color: string}): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const {project} = context;
		project.changeTag(id, name, color);
		await this._projectRepository.saveProject(project);
	}

	async generateApiKey(context: ProjectContext, name: string): Promise<string> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const apiKey = randomBytes(32).toString("base64").replace(/=/gi, "");
		await this._apiKeyRepository.create({
			key: apiKey,
			projectId: context.project.id,
			name,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});
		return apiKey
	}

	async getApiKeysOfProject(context: ProjectContext): Promise<ApiKey[]> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		return this._apiKeyRepository.findAllByProject(context.project);
	}

	async deleteApiKeys(context: ProjectContext, apiKey: ApiKey): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		return this._apiKeyRepository.delete(apiKey);
	}

	async getApiKey(context: ProjectContext, apiKey: string): Promise<ApiKey | null> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		return this._apiKeyRepository.findByKey(apiKey);
	}

	async getApiKeyById(context: ProjectContext, keyId: string): Promise<ApiKey> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		const apiKey = await this._apiKeyRepository.findById(keyId);
		if (!apiKey) {
			throw new MissingResource("Api key not found")
		}
		return apiKey
	}
}
