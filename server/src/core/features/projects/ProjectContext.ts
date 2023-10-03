import {Project, Caller} from "./entities";
import {MissingAuthorization} from "./exceptions/MissingAuthorization";

export enum ProjectAuthorization {
	Read = 'Read',
	Write = 'Write'
}

export class ProjectContext {

	project: Project
	caller: Caller

	constructor(project: Project, caller: Caller) {
		this.project = project
		this.caller = caller
	}

	enforceAuthorizations(authorizations: string[]): void {
		if (this.caller.isSystem())
			return
		if (this.caller.isUser() && this.caller.asUser().id === this.project.ownerId)
			return
		if (this.caller.isApiKey() && this.caller.asApiKey().projectId === this.project.id) {
			const hasAuthorizations = authorizations.every(authorization =>
				this.caller.asApiKey().hasAuthorization(authorization)
			)
			if (hasAuthorizations)
				return;
		}
		throw new MissingAuthorization("Missing authorization");
	}
}
