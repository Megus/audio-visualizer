import { ValueTypes } from "../../RendererBase";
import SimpleImage from "./SimpleImage";

const LSimpleImage = {
	id: "org.megus.SimpleImage",
	type: "layer",
	name: "Simple Image",
	author: "Megus",
	thumbnail: "",
	consts: {
		images: {
			title: "Images list",
			type: ValueTypes.arrayOf(ValueTypes.media),
		},
		scale: {
			title: "Scale type",
			type: ValueTypes.string,
		}
	},
	vars: {
		image: {
			title: "Image",
			type: ValueTypes.int,
		},
	},
	defaultConsts: {
		scale: "aspectFit",
		images: [],
	},
	defaultVars: {
		image: 0,
	},
	renderClass: SimpleImage,
	//guiClass: ...
};

export default LSimpleImage;