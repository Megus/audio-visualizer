import { ValueTypes } from "../../RendererBase";
import SimplePower from "./SimplePower";

const LSimplePower = {
	id: "org.megus.SimplePower",
	type: "layer",
	name: "Simple Power",
	author: "Megus",
	thumbnail: "",
	consts: {},
	vars: {
		color: {
			title: "Color",
			type: ValueTypes.color,
		},
		scale: {
			title: "Scale",
			type: ValueTypes.float,
		}
	},
	defaultConsts: {},
	defaultVars: {
		color: "#FF0000FF",
		scale: 1000,
	},
	renderClass: SimplePower,
	//guiClass: ...
};

export default LSimplePower;