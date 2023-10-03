import {FeatureEvent} from "@app/core/FeatureEvent";
import {Caller} from "../projects/entities";
import {User} from "./entities";

export type onUserCreatedData = {
	user: User
	caller: Caller
}

export class UserEvents {
	onMetricCreated: FeatureEvent<onUserCreatedData> = new FeatureEvent()
}
