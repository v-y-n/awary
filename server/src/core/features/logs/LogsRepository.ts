import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Project} from "../projects/entities/Project";
import {LogDataOnCreation, Log} from "./entities";

export interface LogDocument {
	projectId: ObjectId
	title: string
	content?: string
	tags?: string[]
	createdAt: number
}

function ConvertLogDocumentToEntity(document: WithId<LogDocument>):  Log {
	return new Log({
		id: document._id.toString(),
		projectId: document.projectId.toString(),
		title: document.title,
		tags: document.tags || [],
		content: document.content,
		createdAt: document.createdAt
	})
}

export class LogsRepository {

	private _projectsLogs: Collection<LogDocument>

	constructor(db: Db) {
		this._projectsLogs = db.collection("projectsLogs")
	}

	async create(project: Project, data: LogDataOnCreation): Promise<void> {
		await this._projectsLogs.insertOne({
			projectId: new ObjectId(project.id),
			title: data.title,
			content: data.content,
			tags: data.tags,
			createdAt: Date.now()
		});
	}

	async findLogs(project: Project): Promise<Log[]> {
		const results = await this._projectsLogs.find({
			projectId: new ObjectId(project.id)
		})
			.sort({createdAt: -1})
			.toArray();
		const resultsWithId = results.map(value => ConvertLogDocumentToEntity(value));
		return resultsWithId
	}

	async findLogById(logId: string): Promise<Log | null> {
		const result = await this._projectsLogs.findOne({
			_id: new ObjectId(logId),
		});
		if (!result) {
			return result;
		}
		return ConvertLogDocumentToEntity(result)
	}

	async deleteLog(log: Log): Promise<void> {
		await this._projectsLogs.deleteOne({
			_id: new ObjectId(log.id),
		});
	}
	
	async count(): Promise<number> {
		return this._projectsLogs.countDocuments();
	}
}
