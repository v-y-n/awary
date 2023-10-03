import {Project, ProjectData, Tag} from "./entities";
import {User} from "@app/core/features/users/entities/User";
import {Collection, Db, ObjectId} from "mongodb";

export class ProjectsRepository {

	private _projects: Collection<Omit<ProjectData, "id">>

	constructor(db: Db) {
		this._projects = db.collection("projects")
	}

	async createProject(data: Omit<ProjectData, "id">): Promise<Project> {
		const createProject = await this._projects.insertOne(data);
		return this._format({...data, id: createProject.insertedId.toString()})
	}

	async saveProject(project: Project): Promise<void> {
		await this._projects.updateOne(
			{_id: new ObjectId(project.id)},
			{$set: {...project.getState(), updatedAt: Date.now()}}
		)
	}

	async addTag(project: Project, tag: Tag) : Promise<void> {
		await this._projects.updateOne({_id: new ObjectId(project.id)}, {$push: {tags: tag}});
	}

	async findProjectsOfUser(user: User): Promise<Project[]> {
		const results = await this._projects.find({ownerId: user.id}).toArray();
		const resultsWithId = results.map(value => this._format({...value, id: value._id.toString()}));
		return resultsWithId
	}

	async findProjectById(id: string): Promise<Project | null> {
		const result = await this._projects.findOne({_id: new ObjectId(id)});
		if (!result) {
			return null;
		}
		return this._format({...result, id: result._id.toString()})
	}

	async count(): Promise<number> {
		return this._projects.countDocuments();
	}

	/*async createLog(data: Omit<LogData, "id">): Promise<void> {
		await this._projectsLogs.insertOne(data);
	}

	async findLogsOfProject(project: Project): Promise<LogData[]> {
		const results = await this._projectsLogs.find({projectId: project.id}).toArray();
		const resultsWithId = results.map(value => ({...value, id: value._id.toString()}));
		return resultsWithId
	}*/

	private _format(data: Partial<ProjectData>): Project {
		if (!data.id) {
			throw Error("Id is undefined")
		}
		if (!data.ownerId) {
			throw Error("ownerId is undefined")
		}
		return new Project ({
			id: data.id,
			ownerId: data.ownerId,
			name: data.name || "Missing name",
			tags: data.tags || [],
			createdAt: data.createdAt || 0,
			updatedAt: data.updatedAt || 0
		})
	}
}
