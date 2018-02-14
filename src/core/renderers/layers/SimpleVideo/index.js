import { ValueTypes } from "../../RendererBase";
import SimpleVideo from "./SimpleVideo";

const LSimpleVideo = {
	id: "org.megus.SimpleVideo",
	type: "layer",
	name: "Simple Video",
	author: "Megus",
	thumbnail: "",
	consts: {
		video: {
			title: "Video",
			type: ValueTypes.media,
		},
		scale: {
			title: "Scale type",
			type: ValueTypes.string,
		}
	},
	vars: {},
	defaultConsts: {
		scale: "aspectFit",
		video: "",
	},
	defaultVars: {},
	renderClass: SimpleVideo,
	//guiClass: ...
};

export default LSimpleVideo;