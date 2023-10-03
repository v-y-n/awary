import {Tag} from "./Tag"

export interface ProjectData {
	id: string
	name: string
	ownerId: string
	tags: Tag[]
	createdAt: number
	updatedAt: number
}
