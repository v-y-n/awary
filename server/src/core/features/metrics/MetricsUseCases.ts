import {LimitReached} from "@app/core/exceptions/LimitReached";
import {MissingResource} from "../projects/exceptions/MissingResource";
import {ProjectAuthorization, ProjectContext} from "../projects/ProjectContext";
import {ProjectsUseCases} from "../projects/ProjectsUseCases";
import {getMetricsHistoryLimit} from "../users/utils";
import {Metric, MetricCreationProperties} from "./entities";
import {MetricEvents} from "./MetricsEvents";
import {MetricsRepository} from "./MetricsRepository";

interface MetricServiceDependencies {
	projectService: ProjectsUseCases,
	metricRepository: MetricsRepository,
	metricEvents: MetricEvents
}

export class MetricsUseCases {
	private _projectService: ProjectsUseCases
	private _metricRepository: MetricsRepository
	private _metricEvents: MetricEvents

	constructor(dependencies: MetricServiceDependencies) {
		this._projectService = dependencies.projectService
		this._metricRepository = dependencies.metricRepository
		this._metricEvents = dependencies.metricEvents
	}

	async createMetric(context: ProjectContext, metricInfo: MetricCreationProperties): Promise<Metric> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		const {project, caller} = context;
		
		const metric = await this._metricRepository.createMetric(project, metricInfo.name)
		await this._metricEvents.onMetricCreated.emit({project, metric: metric, caller});
		return metric
	}

	async updateMetric(context: ProjectContext, metric: Metric, metricInfo: MetricCreationProperties): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		await this._metricRepository.updateMetric(metric, metricInfo.name)
	}

	async getAllMetrics(context: ProjectContext, fetchValues?: boolean): Promise<Metric[]> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		const metric = await this._metricRepository.findAll(context.project, fetchValues);
		return metric
	}

	async getMetricById(context: ProjectContext, metricId: string, fetchValues?: boolean): Promise<Metric> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		const metric = await this._metricRepository.findMetricById(context.project, metricId, fetchValues);
		if (!metric) {
			throw new MissingResource("Metric doesn't exist")
		}
		return metric
	}

	async deleteMetric(context: ProjectContext, metric: Metric): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._metricRepository.deleteMetric(metric);
	}

	async deleteMetricHistoryRecord(context: ProjectContext, metric: Metric, recordId: string): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._metricRepository.deleteHistoryRecord(metric, recordId);
	}

	async setMetricValue(context: ProjectContext, metric: Metric, value: number, date?: number) {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		const currentHistoryLength = await this._metricRepository.getHistoryLengthOfMetric(metric)

		if (currentHistoryLength >= getMetricsHistoryLimit()) {
			throw new LimitReached("History limit reached (experimental feature)")
		}

		await this._metricRepository.AddValueToHistory(metric, {
			date: date || Date.now(),
			value
		})
	}
}
