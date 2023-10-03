import {User} from "@app/core/features/users/entities";
import {ApiKey} from "./ApiKey";
import {Project} from "./Project";

export class SystemCaller {

}

export class AdminUser {

}

export class Caller {

	private _user?: User
	private _apiKey?: ApiKey
	private _isSystem = false
	private _isAdmin = false

	constructor(caller: User | ApiKey | SystemCaller | AdminUser) {
		if (caller instanceof User) {
			this._user = caller
		} else if (caller instanceof ApiKey) {
			this._apiKey = caller
		} else if (caller instanceof SystemCaller) {
			this._isSystem = true
		} else if (caller instanceof AdminUser) {
			this._isAdmin = true
		} else {
			throw new Error("Wrong type for Caller constructor")
		}
	}

	CanReadProject(project: Project): boolean {
		if (this?._user && this._user.id === project.ownerId)
			return true
		if (this?._apiKey && this._apiKey.projectId === project.id)
			return true
		return false
	}

	CanWriteProject(project: Project): boolean {
		return this.CanReadProject(project)
	}

	isApiKey(): boolean {
		return !!this._apiKey
	}

	isUser(): boolean {
		return !!this._user
	}

	isSystem(): boolean {
		return this._isSystem;
	}

	isAdmin(): boolean {
		return this._isAdmin;
	}

	asApiKey(): ApiKey {
		if (!this.isApiKey())
			throw new Error("Trying to get caller User as ApiKey")
		return this._apiKey as ApiKey
	}

	asUser(): User {
		if (!this.isUser())
			throw new Error("Trying to get caller ApiKey as User")
		return this._user as User
	}
}
