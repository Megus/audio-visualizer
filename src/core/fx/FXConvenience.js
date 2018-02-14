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
			ratio = h / imgH;
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

	return { x, y, w, h, sx, sy, sw, sh };
}

export { scaleImageInFrame };
