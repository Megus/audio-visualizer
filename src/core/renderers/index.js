import LSimpleSpectrum from "./layers/SimpleSpectrum";
import LSimpleWave from "./layers/SimpleWave";
import LSimpleImage from "./layers/SimpleImage";
import LSimplePower from "./layers/SimplePower";
import LSimpleVideo from "./layers/SimpleVideo";

import { ValueTypes } from "./RendererBase";

const rArray = [ LSimpleSpectrum, LSimpleWave, LSimpleImage, LSimplePower, LSimpleVideo ];
let renderers = {};
// Create hash table of renderers from array for convenience
rArray.forEach((r) => {
	// Add common vars
	r.vars.frame = {
		title: "Frame",
		type: ValueTypes.frame,
	};
	renderers[r.id] = r;
});

function createRenderer(id, project, canvas, consts, vars) {
	if (renderers[id]) {
		const r = renderers[id];
		return new r.renderClass(
			project.media,
			canvas,
			{ ...r.defaultConsts, ...consts },
			{ ...r.defaultVars, ...vars });
	} else {
		return null;
	}
}

export { renderers, createRenderer };
