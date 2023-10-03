export interface ApiKeyData {
	id: string,
	key: string,
	name: string
}

export interface ApiKey extends Readonly<ApiKeyData> {}

export class ApiKey {
	
	constructor(data: ApiKeyData) {
		Object.assign(this, data);
	}

}
