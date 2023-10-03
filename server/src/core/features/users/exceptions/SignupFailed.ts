export enum SignupFailedCode {
	NotEnabled,
	EmailAlreadyInUse,
	LimitReached,
	Unknown
}

export class SignupFailed extends Error {
	constructor(message: string, public errorCode: SignupFailedCode) {
		super(message)
	}
}
