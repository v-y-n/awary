export interface TagData {
	id?: string
	name: string
	color: string
}

export interface Tag extends Readonly<TagData> {}

export class Tag {
	
	constructor(data: TagData) {
		Object.assign(this, data);
	}
}
