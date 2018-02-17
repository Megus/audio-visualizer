import { ValueTypes } from "../../RendererBase";
import SimpleWave from "./SimpleWave";

const LSimpleWave = {
	id: "org.megus.SimpleWave",
	type: "layer",
	name: "Simple Wave",
	author: "Megus",
	thumbnail: "",
	consts: {},
	vars: {
		color: {
			title: "Color",
			type: ValueTypes.color,
		},
		lineWidth: {
			title: "Line width",
			type: ValueTypes.float,
		}
	},
	defaultConsts: {},
	defaultVars: {
		color: { r: 255, g: 255, b: 255, a: 1 },
		lineWidth: 2
	},
	renderClass: SimpleWave,
	//guiClass: ...
};

export default LSimpleWave;