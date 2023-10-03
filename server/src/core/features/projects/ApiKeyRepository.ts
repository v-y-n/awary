import {Collection, Db, ObjectId} from "mongodb";
import {ApiKey} from "./entities/ApiKey";
import {ApiKeyData} from "./entities/ApiKeyData";
import {Project} from "./entities/Project";

export class ApiKeyRepository {

	private _repository: Collection<Omit<ApiKeyData, "id">>

	constructor(db: Db) {
		this._repository = db.collection("projectsApiKeys")
	}

	async create(data: Omit<ApiKeyData, "id">): Promise<void> {
		await this._repository.insertOne(data);
	}

	async delete(apiKey: ApiKey): Promise<void> {
		await this._repository.deleteOne({_id: new ObjectId(apiKey.id)});
	}

	async findByKey(key: string): Promise<ApiKey | null> {
		const result = await this._repository.findOne({key});
		if (!result) {
			return null;
		}
		return new ApiKey({...result, id: result._id.toString()})
	}

	async findById(id: string): Promise<ApiKey | null> {
		const result = await this._repository.findOne({_id: new ObjectId(id)});
		if (!result) {
			return null;
		}
		return new ApiKey({...result, id: result._id.toString()})
	}

	async findAllByProject(project: Project): Promise<ApiKey[]> {
		const results = await this._repository.find({projectId: project.id}).toArray();
		const resultsWithId = results.map(value => new ApiKey(({...value, id: value._id.toString()})));
		return resultsWithId;
	}
}
