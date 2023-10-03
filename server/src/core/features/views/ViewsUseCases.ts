import {ProjectAuthorization, ProjectContext} from "../projects/ProjectContext";
import {View, ViewProvider} from "./entities";
import {ViewsRepository} from "./ViewsRepository";

interface ViewsUseCasesDependencies {
	viewsRepository: ViewsRepository
}

interface ViewDataUpdate {
	name: string
	config: unknown
}

export interface ViewCreationProperties {
	type: string
	name: string
	provider: ViewProvider
	config: unknown
}

export class ViewsUseCases {
	private _viewsRepository: ViewsRepository

	constructor(dependencies: ViewsUseCasesDependencies) {
		this._viewsRepository = dependencies.viewsRepository
	}

	async createView(context: ProjectContext, viewData: ViewCreationProperties): Promise<View> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const {project} = context;
		
		const view = await this._viewsRepository.createView({
			projectId: project.id,
			name: viewData.name,
			type: viewData.type,
			provider: viewData.provider,
			config: viewData.config
		})
		return view
	}

	async updateView(context: ProjectContext, view: View, data: ViewDataUpdate): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		await this._viewsRepository.updateView(view, data)
	}

	async getAllViews(context: ProjectContext): Promise<View[]> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		return await this._viewsRepository.findAll(context.project);
	}

	async getViewsByType(context: ProjectContext, type: string): Promise<View[]> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		return await this._viewsRepository.findAll(context.project, {type});
	}
}
