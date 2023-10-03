export function isRegistrationEnabled(adminToken?: string): boolean {
	if (adminToken && adminToken === process.env.API_ADMIN_AUTHORIZATION) {
		return true;
	}
	return process.env.ENABLE_USER_REGISTRATION === "true";
}

export function getAccountCreationLimit(): number {
	return process.env.MAX_ACCOUNT ? parseInt(process.env.MAX_ACCOUNT) : 9999999;
}

export function getAccountProjectsLimit(): number {
	return process.env.MAX_PROJECT_PER_ACCOUNT ? parseInt(process.env.MAX_PROJECT_PER_ACCOUNT) : 9999999;
}

export function getMetricsUpdateLimit(): number {
	return process.env.METRICS_MAX_UPDATE_PER_MINUTE ? parseInt(process.env.METRICS_MAX_UPDATE_PER_MINUTE) : 9999999;
}

export function getMetricsHistoryLimit(): number {
	return process.env.METRICS_HISTORY_LENGTH ? parseInt(process.env.METRICS_HISTORY_LENGTH) : 9999999;
}
