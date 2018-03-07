/**
 * Error throwing/handling helper functions
 */

const throwError = (msg = "Unexpected error occured") => { throw new Error(msg); };

// ? Is it possible to improve helper functions below ??

const throwErrorIfRequiredArgumentMissed = argObj =>
	Object.values(argObj)[0] || throwError(`'${Object.keys(argObj)[0]}' argument is required`);

const throwErrorIfArgumentIsNotNumber = argObj =>
	typeof Object.values(argObj)[0] === "number" || throwError(`'${Object.keys(argObj)[0]}' argument is not a number`);

const throwErrorIfArgumentIsNotFunction = argObj =>
	typeof Object.values(argObj)[0] === "function" || throwError(`'${Object.keys(argObj)[0]}' argument is not a function`);

/**
 * Utility functions
 */

function divideOnEvenlyParts(numberToDivide, divisor) {
	throwErrorIfRequiredArgumentMissed({ numberToDivide });
	throwErrorIfArgumentIsNotNumber({ numberToDivide });

	throwErrorIfRequiredArgumentMissed({ divisor });
	throwErrorIfArgumentIsNotNumber({ divisor });

	if (!Number.isInteger(divisor) || divisor === 0) {
		throwError("'divisor' argument must non-zero integer number");
	}

	return (numberToDivide - numberToDivide % divisor) / divisor;
}

function secondsToMinutesString(seconds) {
	throwErrorIfRequiredArgumentMissed({ seconds });
	throwErrorIfArgumentIsNotNumber({ seconds });

	const intPart = Math.floor(seconds / 60);
	const remainder = seconds % 60;

	return intPart < 1
		? seconds.toString()
		: `${intPart}:${remainder === 0 ? "00" : remainder}`;
}

export {
	throwError,
	throwErrorIfRequiredArgumentMissed,
	throwErrorIfArgumentIsNotFunction,
	divideOnEvenlyParts,
	secondsToMinutesString,
};
