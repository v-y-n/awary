import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Project} from "../projects/entities";
import {View, ViewProvider} from "./entities";

interface ViewDocument {
	projectId: ObjectId
	type: string
	name: string
	provider: string
	config: unknown
}

interface ViewProperties {
	projectId: string
	type: string
	name: string
	provider: string
	config: unknown
}

function viewDocumentToEntity(document: WithId<ViewDocument>): View {
	return new View({
		id: document._id.toString(),
		projectId: document.projectId.toString(),
		type: document.type,
		name: document.name,
		provider: document.provider as ViewProvider,
		config: document.config
	})
}

export class ViewsRepository {

	private _views: Collection<ViewDocument>

	constructor(db: Db) {
		this._views = db.collection("projectsViews")
	}

	async createView(viewData: ViewProperties): Promise<View> {
		const viewDocument = await this._views.insertOne({
			...viewData,
			projectId: new ObjectId(viewData.projectId)
		});
		return viewDocumentToEntity({
			_id: viewDocument.insertedId,
			projectId: new ObjectId(viewData.projectId),
			type: viewData.type,
			name: viewData.name,
			provider: viewData.provider,
			config: viewData.config
		})
	}

	async updateView(view: View, properties: Partial<ViewProperties>): Promise<void> {
		await this._views.updateOne({_id: new ObjectId(view.id)}, {
			$set: {
				name: properties.name,
				config: properties.config
			}
		});
	}

	async findAll(project: Project, filter: Partial<ViewProperties> = {}): Promise<View[]> {
		const viewDocuments = await this._views.find({...filter, projectId: new ObjectId(project.id)}).toArray()
		return viewDocuments.map(viewDocumentToEntity)
	}

	async findOne(id: string): Promise<View | null> {

		const viewDocument = await this._views.findOne({_id: new ObjectId(id)})
		if (!viewDocument) {
			return null;
		}
		return viewDocumentToEntity(viewDocument);
	}

	async deleteView(view: View): Promise<void> {
		await this._views.deleteOne({_id: new ObjectId(view.id)})
	}
}
