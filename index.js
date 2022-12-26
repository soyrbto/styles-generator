import config from "./config-fluid.json" assert { type: "json" };
import fs from "fs";

let breakpoints = config.breakingPoints;
let classesName = Object.keys(config.fluidclasses);
let classesObject = config.fluidclasses;

function arrayOfClamps(classesName, classesObject, breakingPoints) {
	let clampArray = [];

	for (let j = 0; j < breakingPoints.length - 1; j++) {
		for (let i = 0; i < classesName.length; i++) {
			let minValue = classesObject[classesName[i]][j];
			let maxValue = classesObject[classesName[i]][j + 1];

			clampArray.push(
				clampGenerator(
					minValue,
					maxValue,
					breakingPoints[j],
					breakingPoints[j + 1]
				)
			);
		}
	}

	return clampArray;
}

function mqWrapper(clamps, breakpoints, classesName) {
	console.log(clamps, breakpoints, classesName);
	let clamp = "";
	let newClamp;
	let newClassName;

	// cada 3 elementos pasa al siguiente elemento de la clase de nombre

	for (let i = 1; i < breakpoints.length; i++) {
		let j = 0;
		let className = "";

		for (let k = i; k < clampArray.length + 1; k = k + 4) {
			j = j + 4;
			newClassName = `
		    .${classesName[j / 4 - 1]} {
		        font-size: ${clamps[k - 1]};
		    }`;

			className = className + newClassName;
		}

		newClamp = `
        @media only screen and (min-width: ${breakpoints[i]}px) {

           ${className}
        }
        
        `;

		clamp = clamp + newClamp;
	}
	return clamp;
}

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
		Number(slope.toFixed(2)),
		Number((traslation / rootValue).toFixed(2)),
		Number((minValue / rootValue).toFixed(2)),
		Number((maxValue / rootValue).toFixed(2)),
	];
}

function createFile(name, content) {
	fs.writeFile(name, content, () => {
		"it works";
	});
}

let clampArray = arrayOfClamps(classesName, classesObject, breakpoints);

let styles = mqWrapper(clampArray, breakpoints, classesName);

createFile("styles.css", styles);
