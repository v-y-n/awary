import {Identifiable} from "@app/core/Identifiable"

export interface LogDataOnCreation {
	title: string
	content?: string
	tags?: string[]
}

export interface LogConstructor extends Identifiable {
	id: string
	projectId: string
	title: string
	content?: string
	tags?: string[]
	createdAt: number
}

export class Log {

	public readonly id: string
	public readonly projectId: string
	public readonly title: string
	public readonly content?: string
	public readonly tags: string[]
	public readonly createdAt: number

	constructor(data: LogConstructor) {
		this.id = data.id
		this.projectId = data.projectId
		this.title = data.title
		this.content = data.content
		this.tags = data.tags || []
		this.createdAt = data.createdAt
	}
}
