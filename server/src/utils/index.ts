export function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export const ADMIN_TOKEN = process.env.API_ADMIN_AUTHORIZATION as string;

export function getAdminProjectId(): string | undefined {
	return process.env.ADMIN_PROJECT_ID;
}

export function getAdminSucessTagId(): string | undefined {
	return process.env.ADMIN_SUCCESS_TAG_ID;
}

export function getAdminFailTagId(): string | undefined {
	return process.env.ADMIN_FAIL_TAG_ID;
}
