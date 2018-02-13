const interpolators = {
	linear: (a, b, t) => {
		return (a + (b - a) * t);
	}
}

export default interpolators;