import {TagData} from "./Tag";

export interface ProjectData {
	id: string,
	name: string
	tags: TagData[]
}

export interface Project extends Readonly<ProjectData> {}

export class Project {
	constructor(data: ProjectData) {
		Object.assign(this, data);
	}
}
