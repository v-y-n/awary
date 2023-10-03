import {Tag} from "./Tag";
import {ProjectData} from "./ProjectData";

export class Project implements ProjectData {
	id: string
	name: string
	ownerId: string
	tags: Tag[]
	createdAt: number
	updatedAt: number

	constructor(data: ProjectData) {
		this.id = data.id
		this.name = data.name
		this.ownerId = data.ownerId
		this.tags = data.tags
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}

	getState(): ProjectData {
		return {
			id: this.id,
			ownerId: this.ownerId,
			name: this.name,
			tags: this.tags,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}

	changeTag(id: number, name: string, color: string): Tag {
		const tag = this.tags.find(tag => tag.id === id)
		if (!tag) {
			throw new Error(`Tag '${id}' doesn't exist`);
		}
		tag.name = name;
		tag.color = color;
		return tag;
	}

	hasTag(name: string): boolean {
		return this.tags.find(tag => tag.name === name) !== undefined
	}
}
