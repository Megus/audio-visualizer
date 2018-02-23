function scaleImageInFrame(scale, imgW, imgH, frameW, frameH) {
	let x, y, w, h, sx, sy, sw, sh;

	if (scale === "aspectFit") {
		// Fit the whole image and keep the aspect ratio
		sx = 0;
		sy = 0;
		sw = imgW;
		sh = imgH;

		h = frameH;
		w = imgW * (h / imgH);
		if (w > frameW) {
			w = frameW;
			h = imgH * (w / imgW);
		}
		x = (frameW - w) / 2;
		y = (frameH - h) / 2;
	} else if (scale === "aspectFill") {
		// Fill the frame but keep the aspect ratio
		x = 0;
		y = 0;
		w = frameW;
		h = frameH;
		let ratio = w / imgW;
		if (imgH * ratio > h) {
			sw = imgW;
			sh = h / ratio;
			sx = 0;
			sy = (imgH - sh) / 2;
		} else {
			let ratio = h / imgH;
			sw = w / ratio;
			sh = imgH;
			sx = (imgW - sw) / 2;
			sy = 0;
		}
	} else {
		// Fill the frame, ignore the aspect ratio
		sx = 0;
		sy = 0;
		sw = imgW;
		sh = imgH;

		x = 0;
		y = 0;
		w = frameW;
		h = frameH;
	}

	return {x, y, w, h, sx, sy, sw, sh};
}

function colorToCanvasFillStyle(color) {
	const a = color.a === undefined ? 1 : color.a;
	const r = Math.floor(color.r);
	const g = Math.floor(color.g)
	const b = Math.floor(color.b);
	return `rgba(${r},${g},${b},${a})`;
}

function compileVertexShader(gl, str) {
    const shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    	console.log(gl.getShaderInfoLog(shader));
    	return null;
    }
    return shader;
}

function compileFragmentShader(gl, str) {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    	console.log(gl.getShaderInfoLog(shader));
    	return null;
    }
    return shader;
}

export { scaleImageInFrame, colorToCanvasFillStyle, compileFragmentShader, compileVertexShader };