export default function divideOnEvenlyPatrs(numberToDivide, divisor) {
	if (!numberToDivide) {
		throw new Error("'numberToDivide' is null or undefined");
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
