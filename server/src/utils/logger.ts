const consoleColors = {
	RESET: "\x1b[0m",
	SUCCESS: "\x1b[32m",
	WARNING: "\x1b[33m",
	ERROR: "\x1b[31m",
	DEBUG: "\x1b[36m"
};

export class Logger {
	static info(message: unknown) {
		if (!process.env.LOGGER_ENABLED) {
			return;
		}
		console.log(message);
	}

	static debug(message: unknown) {
		if (!process.env.LOGGER_ENABLED) {
			return;
		}
		console.log(`${consoleColors.DEBUG}${message}${consoleColors.RESET}`);
	}

	static success(message: unknown) {
		if (!process.env.LOGGER_ENABLED) {
			return;
		}
		console.error(`${consoleColors.SUCCESS}${message}${consoleColors.RESET}`);
	}

	static warn(message: unknown) {
		if (!process.env.LOGGER_ENABLED) {
			return;
		}
		console.error(`${consoleColors.WARNING}${message}${consoleColors.RESET}`);
	}

	static error(message: unknown) {
		if (!process.env.LOGGER_ENABLED) {
			return;
		}
		console.error(`${consoleColors.ERROR}${message}${consoleColors.RESET}`);
	}
}
