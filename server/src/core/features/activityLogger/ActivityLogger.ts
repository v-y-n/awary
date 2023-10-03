import {getAdminProjectId, getAdminSucessTagId} from "@app/utils";
import {LogsUseCases} from "../logs/LogsUseCases";
import {MetricFeature} from "../metrics";
import {onMetricCreatedData} from "../metrics/MetricsEvents";
import {ProjectFeature} from "../projects";
import {Caller, SystemCaller} from "../projects/entities/Caller";
import {ProjectContext} from "../projects/ProjectContext";
import {onProjectCreatedData} from "../projects/ProjectsEvents";
import {UserFeature} from "../users";
import {onUserCreatedData} from "../users/UsersEvents";

interface ActivityLoggerDependencies {
	userFeature: UserFeature
	projectFeature: ProjectFeature
	logService: LogsUseCases
	metricFeature: MetricFeature
}

export class ActivityLoggerService {
	private _userFeature: UserFeature
	private _projectFeature: ProjectFeature
	private _logService: LogsUseCases
	private _metricFeature: MetricFeature
	private _systemCaller = new Caller(new SystemCaller())

	constructor(dependencies: ActivityLoggerDependencies) {
		this._userFeature = dependencies.userFeature
		this._projectFeature = dependencies.projectFeature
		this._logService = dependencies.logService
		this._metricFeature = dependencies.metricFeature

		this._metricFeature.events.onMetricCreated.register(data => this.logMetricCreation(data))
		this._projectFeature.events.onProjectCreated.register(data => this.logProjectCreation(data))
		this._userFeature.events.onMetricCreated.register(data => this.adminLogUserCreation(data))
	}

	private async adminLogUserCreation(data: onUserCreatedData): Promise<void> {
		const adminProjectId = getAdminProjectId()
		if (!adminProjectId)
			return ;
		const project = await this._projectFeature.projectRepository.findProjectById(adminProjectId)
		if (!project)
			return ;
		const context = new ProjectContext(project, this._systemCaller)
		const adminSucessTagId = getAdminSucessTagId()
		await this._logService.addLog(context, {
			title: `New user: ${data.user.email}`,
			tags: adminSucessTagId ? [adminSucessTagId] : []
		});
	}

	private async logProjectCreation(data: onProjectCreatedData): Promise<void> {
		const context = new ProjectContext(data.project, this._systemCaller)
		await this._logService.addLog(context, {
			title: `Welcome to your new project: "${data.project.name}"`,
		});
	}

	private async logMetricCreation(data: onMetricCreatedData): Promise<void> {
		const context = new ProjectContext(data.project, this._systemCaller)
		await this._logService.addLog(context, {
			title: `Created metric "${data.metric.name}"`,
		});
	}
}
