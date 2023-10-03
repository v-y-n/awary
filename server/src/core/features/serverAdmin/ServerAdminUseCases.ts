import {LogFeature} from "../logs";
import {MetricFeature} from "../metrics";
import {ProjectFeature} from "../projects";
import {Caller, SystemCaller} from "../projects/entities/Caller";
import {UserFeature} from "../users";
import {AuthenticationFailed} from "../users/exceptions/AuthenticationFailed";

interface ServerAdminDependencies {
	userFeature: UserFeature
	projectFeature: ProjectFeature
	logFeature: LogFeature,
	metricFeature: MetricFeature,
}

export class ServerAdminUseCases {
	private _userFeature: UserFeature
	private _projectFeature: ProjectFeature
	private _logFeature: LogFeature
	private _metricFeature: MetricFeature
	private _systemCaller = new Caller(new SystemCaller())

	constructor(dependencies: ServerAdminDependencies) {
		this._userFeature = dependencies.userFeature
		this._projectFeature = dependencies.projectFeature
		this._logFeature = dependencies.logFeature
		this._metricFeature = dependencies.metricFeature
	}

	async getGlobalStats(caller: Caller): Promise<GlobalStats> {
		if (!caller.isAdmin()) {
			throw new AuthenticationFailed("User needs to be Admin");
		}

		const userCount = await this._userFeature.repository.count();
		const projectCount = await this._projectFeature.projectRepository.count();
		const logCount = await this._logFeature.logsRepository.count();
		const metricCount = await this._metricFeature.repository.count();
		const metricHistoryEntryCount = await this._metricFeature.repository.countHistory();

		return {
			userCount,
			projectCount,
			logCount,
			metricCount,
			metricHistoryEntryCount
		}
	}
}

type GlobalStats = {
	userCount: number
	projectCount: number
	logCount: number
	metricCount: number
	metricHistoryEntryCount: number
}
