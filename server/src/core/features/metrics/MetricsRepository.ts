import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Project} from "../projects/entities";
import {Metric, MetricValue} from "./entities";

interface MetricDocument {
	projectId: ObjectId
	name: string
	currentValue: undefined | number
}

interface MetricHistoryDocument {
	metricId: ObjectId
	date: number // timestamp
	value: number
}

function MetricDocumentToEntity(document: WithId<MetricDocument>, values: WithId<MetricHistoryDocument>[] | null): Metric {
	return new Metric({
		id: document._id.toString(),
		name: document.name,
		projectId: document.projectId.toString(),
		currentValue: document.currentValue,
		history: values ? values.map(MetricHistoryDocumentToEntity) : null
	})
}

function MetricHistoryDocumentToEntity(document: WithId<MetricHistoryDocument>): MetricValue {
	return {
		id: document._id.toString(),
		metricId: document.metricId.toString(),
		date: document.date,
		value: document.value,
	};
}

export class MetricsRepository {

	private _metrics: Collection<MetricDocument>
	private _metricsHistory: Collection<MetricHistoryDocument>

	constructor(db: Db) {
		this._metrics = db.collection("projectsMetrics")
		this._metricsHistory = db.collection("projectsMetricsHistory")
	}

	async createMetric(project: Project, name: string): Promise<Metric> {
		const metric = await this._metrics.insertOne({
			projectId: new ObjectId(project.id),
			name: name,
			currentValue: undefined
		});
		return MetricDocumentToEntity({
			_id: metric.insertedId,
			projectId: new ObjectId(project.id),
			name,
			currentValue: undefined
		}, null)
	}

	async updateMetric(metric: Metric, name: string): Promise<void> {
		await this._metrics.updateOne({_id: new ObjectId(metric.id)}, {
			$set: {
				name: name,
			}
		});
	}

	async AddValueToHistory(metric: Metric, value: Omit<MetricValue, "id" | "metricId">): Promise<void> {
		const metricQuery = {projectId: new ObjectId(metric.projectId), name: metric.name}
		const newValueDocument = {...value, metricId: new ObjectId(metric.id)}
		await this._metricsHistory.insertOne(newValueDocument);
		await this._metrics.updateOne(metricQuery, {$set: {currentValue: value.value}})
	}

	async deleteHistoryRecord(metric: Metric, recordId: string): Promise<void> {
		const deleteFilter = {metricId: new ObjectId(metric.id), _id: new ObjectId(recordId)}
		await this._metricsHistory.deleteOne(deleteFilter);
	}

	async findAll(project: Project, fetchValues = false): Promise<Metric[]> {
		const metric = await this._metrics.find({projectId: new ObjectId(project.id)}).toArray()
		const metricIds = metric.map(metric => metric._id);
		const allMetricValues = await this._metricsHistory.find({metricId: {$in: metricIds}}).sort({date: 1}).toArray()
		return metric.map(thisMetric => {
			if (!fetchValues) {
				return MetricDocumentToEntity(thisMetric, null);
			}
			const values = allMetricValues.filter(value => value.metricId.equals(thisMetric._id))
			return MetricDocumentToEntity(thisMetric, values);
		})
	}

	async findOne(project: Project, name: string, fetchValues = false): Promise<Metric | null> {

		const metric = await this._metrics.findOne({projectId: new ObjectId(project.id), name})
		if (!metric) {
			return null;
		}
		if (!fetchValues) {
			return MetricDocumentToEntity(metric, null);
		}
		const values = await this._metricsHistory.find({metricId: metric._id}).sort({date: 1}).toArray()
		return MetricDocumentToEntity(metric, values);
	}

	async findMetricById(project: Project, id: string, fetchValues = false): Promise<Metric | null> {

		const metric = await this._metrics.findOne({projectId: new ObjectId(project.id),_id: new ObjectId(id)})
		if (!metric) {
			return null;
		}
		if (!fetchValues) {
			return MetricDocumentToEntity(metric, null);
		}
		const values = await this._metricsHistory.find({metricId: metric._id}).sort({date: 1}).toArray()
		return MetricDocumentToEntity(metric, values);
	}

	async MetricExists(project: Project, name: string): Promise<boolean> {
		const metric = await this._metrics.findOne({projectId: new ObjectId(project.id), name});
		return metric !== null
	}

	async deleteMetric(metric: Metric): Promise<void> {
		const metricId = new ObjectId(metric.id);
		await this._metricsHistory.deleteMany({metricId: metricId})
		await this._metrics.deleteOne({_id: metricId})
	}

	async getHistoryLengthOfMetric(metric: Metric): Promise<number> {
		return this._metricsHistory.countDocuments({metricId: new ObjectId(metric.id)});
	}

	async count(): Promise<number> {
		return this._metrics.countDocuments();
	}

	async countHistory(): Promise<number> {
		return this._metricsHistory.countDocuments();
	}
}
