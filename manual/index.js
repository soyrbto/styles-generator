function clampGenerator(minValue, maxValue, minScreen, maxScreen) {
	let [slope, traslation, minValueRem, maxValueRem] = definingValues(
		minValue,
		maxValue,
		minScreen,
		maxScreen
	);

	return `clamp(${minValueRem}rem, ${slope}vw + ${traslation}rem, ${maxValueRem}rem)`;
}

function definingValues(minValue, maxValue, minScreen, maxScreen) {
	let rootValue = 16;
	let slope = ((maxValue - minValue) / (maxScreen - minScreen)) * 100;
	let traslation =
		(minScreen * maxValue - maxScreen * minValue) / (minScreen - maxScreen);

	return [
		Number(slope.toFixed(3)),
		Number((traslation / rootValue).toFixed(3)),
		Number((minValue / rootValue).toFixed(3)),
		Number((maxValue / rootValue).toFixed(3)),
	];
}

console.log(clampGenerator(60, 320, 1280, 1920));
