import {ProjectAuthorization} from "../ProjectContext";
import {ApiKeyData} from "./ApiKeyData";

export interface ApiKey extends Readonly<ApiKeyData> {
	id: string
}

export class ApiKey {

	authorizations: string[]

	constructor(data: ApiKeyData) {
		Object.assign(this, data);
		this.authorizations = [ProjectAuthorization.Read, ProjectAuthorization.Write]
	}

	hasAuthorization(authorization: string): boolean {
		return this.authorizations.includes(authorization);
	}

	toString(): string {
		return this.key
	}

	getState(): ApiKeyData {
		return {
			id: this.id,
			key: this.key,
			name: this.name,
			projectId: this.projectId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}
}
