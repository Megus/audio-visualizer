import { ValueTypes } from "../../RendererBase";
import Group from "./Group";

const GGroup = {
	id: "Group",
	type: "group",
	name: "Group",
	author: "Megus",
	thumbnail: "",
	consts: {},
	vars: {
		bgColor: {
			title: "Group background",
			type: ValueTypes.color
		}
	},
	defaultConsts: {},
	defaultVars: {
		bgColor: { r: 0, g: 0, b: 0, a: 0 }
	},
	renderClass: Group,
	//guiClass: ...
};

export default GGroup;