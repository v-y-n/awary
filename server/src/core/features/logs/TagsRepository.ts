import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Project} from "../projects/entities/Project";
import {Tag, TagOnCreation} from "./entities";

export interface TagDocument {
	projectId: ObjectId
	name: string
	color: string
}

function ConvertTagDocumentToEntity(document: WithId<TagDocument>):  Tag {
	return {
		id: document._id.toString(),
		projectId: document.projectId.toString(),
		name: document.name,
		color: document.color
	}
}

export class TagsRepository {

	private _tags: Collection<TagDocument>

	constructor(db: Db) {
		this._tags = db.collection("tags")
	}

	async create(project: Project, data: TagOnCreation): Promise<Tag> {
		const tag = await this._tags.insertOne({
			projectId: new ObjectId(project.id),
			name: data.name,
			color: data.color
		});
		return ConvertTagDocumentToEntity({
			_id: tag.insertedId,
			projectId: new ObjectId(project.id),
			name: data.name,
			color: data.color
		})
	}

	async updateTag(tag: Tag, data: Partial<TagDocument>): Promise<void> {
		await this._tags.updateOne({_id: new ObjectId(tag.id)}, {
			$set: {
				name: data.name,
				color: data.color
			}
		});
	}

	async findByProject(project: Project): Promise<Tag[]> {
		const results = await this._tags.find({
			projectId: new ObjectId(project.id)
		})
			.sort({createdAt: -1})
			.toArray();
		const resultsWithId = results.map(value => ConvertTagDocumentToEntity(value));
		return resultsWithId
	}

	async findById(project: Project, id: string): Promise<Tag | null> {
		const result = await this._tags.findOne({
			projectId: new ObjectId(project.id),
			_id: new ObjectId(id)
		})
		if (!result)
			return null
		return ConvertTagDocumentToEntity(result)
	}

	async deleteTag(tag: Tag): Promise<void> {
		await this._tags.deleteOne({
			_id: new ObjectId(tag.id),
		});
	}
	
	async count(): Promise<number> {
		return this._tags.countDocuments();
	}
}
