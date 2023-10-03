import {FeatureEvent} from "@app/core/FeatureEvent";
import {Caller} from "../projects/entities/Caller";
import {Project} from "../projects/entities/Project";
import {Metric} from ".";

export type onMetricCreatedData = {
	project: Project
	metric: Metric
	caller: Caller
}

export class MetricEvents {
	onMetricCreated: FeatureEvent<onMetricCreatedData> = new FeatureEvent()
}
