const fs = require("fs");

let breakingPoints = [500, 1400, 1024, 1280, 1920];
let body1 = [20, 56, 18, 20, 24, 30];

// 1. se toma el map y se recorre
// 2. se guarda el primer valor, y se compara con el siguiente si son diferentes se procede
// 3. se usa la funcion para generar un clamp -- ESTO LISTO
// 4. se devuelve envuelto en un mediaquery relacionado con la posicion del primer elemento comparado
// 5. se repite con el siguiente termino

function clampGenerator(minValue, maxValue, minScreen, maxScreen) {
	if (minValue == maxValue) {
		console.log(minValue);
	} else {
		let [slope, traslation, minValueRem, maxValueRem] = definingValues(
			minValue,
			maxValue,
			minScreen,
			maxScreen
		);

		createClamp(minValueRem, slope, traslation, maxValueRem);
	}
}

function definingValues(minValue, maxValue, minScreen, maxScreen) {
	let rootValue = 16;
	let slope = ((maxValue - minValue) / (maxScreen - minScreen)) * 100;
	let traslation =
		(minScreen * maxValue - maxScreen * minValue) / (minScreen - maxScreen);

	return [
		Number(slope.toFixed(2)),
		Number((traslation / rootValue).toFixed(2)),
		Number((minValue / rootValue).toFixed(2)),
		Number((maxValue / rootValue).toFixed(2)),
	];
}

function createClamp(minValue, slope, traslation, maxValue) {
	console.log(
		`clamp(${minValue}rem, ${slope}vw + ${traslation}rem, ${maxValue}rem)`
	);
}

function createFile(name, content) {
	fs.writeFile(name, content, () => {
		"it works";
	});
}

clampGenerator(16, 31, 320, 960);
