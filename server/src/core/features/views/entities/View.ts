import {Identifiable} from "@app/core/Identifiable"

export enum ViewProvider {
	Web = "Web",
	Custom = "Custom"
}

export interface ViewCreationProperties {
	projectId: string
	type: string
	name: string
	provider: ViewProvider
	config: unknown
}

export interface ViewConstructor extends Identifiable  {
	projectId: string
	type: string
	name: string
	provider: ViewProvider
	config: unknown
}

export interface WebViewProvider {
	panels: {
		name: string
		order: number
		metrics: {
			metricId: string
			order: number
			config: unknown
		}[]
	}[]
}

export class View implements ViewConstructor {

	readonly id: string
	readonly projectId: string
	readonly name: string
	readonly type: string
	readonly provider: ViewProvider
	readonly config: unknown

	constructor(data: ViewConstructor) {
		this.id = data.id
		this.projectId = data.projectId
		this.type = data.type
		this.name = data.name
		this.provider = data.provider
		this.config = data.config
	}
}
