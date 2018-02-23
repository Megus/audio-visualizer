import { ValueTypes } from "../../RendererBase";
import AdjustColor from "./AdjustColor";

const FAdjustColor = {
	id: "org.megus.AdjustColor",
	type: "filter",
	name: "Simple Power",
	author: "Megus",
	thumbnail: "",
	consts: {},
	vars: {
		"saturation": {
			"title": "Saturation",
			"type": ValueTypes.float
		}
	},
	defaultConsts: {},
	defaultVars: {
		"saturation": 0.0
	},
	renderClass: AdjustColor,
	//guiClass: ...
};

export default FAdjustColor;