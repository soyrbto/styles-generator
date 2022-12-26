import config from "./config-fluid.json" assert { type: "json" };
import fs from "fs";

function objectOfClamps(classesName, classesObject, breakingPoints) {
	let clampObject = { default: [] };

	for (let i = 0; i < breakingPoints.length; i++) {
		clampObject[breakingPoints[i]] = [];
	}

	for (let l = 0; l < classesName.length; l++) {
		clampObject.default.push(classesObject[classesName[l]][0]);
	}

	for (let k = 0; k < breakingPoints.length; k++) {
		let minScreen = breakingPoints[k];
		let maxScreen = breakingPoints[k + 1];

		for (let j = 0; j < classesName.length; j++) {
			let minValue = classesObject[classesName[j]][k];
			let maxValue = classesObject[classesName[j]][k + 1];

			if (minValue == maxValue || !maxValue) {
				clampObject[breakingPoints[k]].push(minValue);
			} else {
				clampObject[breakingPoints[k]].push(
					clampGenerator(minValue, maxValue, minScreen, maxScreen)
				);
			}
		}
	}
	return clampObject;
}

function mqWrapper(clampsObject, breakingPoints, classesName) {
	let newClass;
	let newClamp;
	let clamp = "";
	let className = "";

	// console.log(classesName);

	for (let j = 0; j < breakingPoints.length; j++) {
		className = "";

		for (let i = 0; i < classesName.length; i++) {
			newClass = `
            .typo-${classesName[j]} {
                font-size: ${clampsObject[breakingPoints[j]][i]};
            }
            `;
			if (isNaN(clampsObject[breakingPoints[j]][i])) {
				className = className + newClass;
			}
		}

		console.log(breakingPoints[j]);
		console.log(className);
		if (className !== "") {
			newClamp = `
            
@media only screen and (min-width: ${breakingPoints[j]}px) {
    ${className}
}
    
             `;
			clamp = clamp + newClamp;
		} else {
			clamp = clamp;
		}
	}

	for (let k = 0; k < classesName.length; k++) {
		newClamp = `
        .typo-${classesName[k]} {
            font-size: ${clampsObject.default[k] / 16}rem;
        }
            `;
		clamp = newClamp + clamp;
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

(function styleGenerator(config) {
	let breakingPoints = config.breakingPoints;
	let classesName = Object.keys(config.fluidclasses);
	let classesObject = config.fluidclasses;

	let clampsObject = objectOfClamps(classesName, classesObject, breakingPoints);
	let styles = mqWrapper(clampsObject, breakingPoints, classesName);
	createFile("styles.css", styles);
})(config);
