import {FeatureEvent} from "@app/core/FeatureEvent";
import {Project, Caller} from "../projects/entities";

export type onProjectCreatedData = {
	project: Project
	caller: Caller
}

export class ProjectEvents {
	onProjectCreated: FeatureEvent<onProjectCreatedData> = new FeatureEvent()
}
