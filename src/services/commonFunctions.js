function divideOnEvenlyParts(numberToDivide, divisor) {
	if (!numberToDivide) {
		throw new Error("'numberToDivide' argument is null or undefined");
	}

	if (typeof numberToDivide !== "number") {
		throw new Error("'numberToDivide' argument is not a number");
	}

	if (!divisor) {
		throw new Error("'divisor' argument is null or undefined");
	}

	if (typeof divisor !== "number") {
		throw new Error("'divisor' argument is not a number");
	}

	if (!Number.isInteger(divisor) ||
		divisor === 0) {
		throw new Error("'divisor' argument must non-zero integer number");
	}

	return (numberToDivide - numberToDivide % divisor) / divisor;
}

function secondsToMinutesString(seconds) {
	if (!seconds) {
		throw new Error("'seconds' argument is null or undefined");
	}

	if (typeof seconds !== "number") {
		throw new Error("'seconds' argument is not a number");
	}

	const intPart = Math.floor(seconds / 60);
	const remainder = seconds % 60;

	return intPart < 1
		? seconds.toString()
		: `${intPart}:${remainder === 0 ? "00" : remainder}`;
}

export { divideOnEvenlyParts, secondsToMinutesString };
