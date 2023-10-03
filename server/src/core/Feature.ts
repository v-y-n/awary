import {Db} from "mongodb";
import {UserFeature} from "./features/users";

export type AppServices = {
	db: Db
}

export type AppFeatures = {
	userFeature: UserFeature
}

export abstract class Feature {

	public abstract name: string
	protected services: AppServices

	constructor(services: AppServices) {
		this.services = services
	}
}
