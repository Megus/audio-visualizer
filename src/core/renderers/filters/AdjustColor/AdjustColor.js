import RendererBase from "../../RendererBase";
import { compileFragmentShader, compileVertexShader } from "../../RendererConvenience";

import shaderText from "./shader";
import vertexShaderText from "./vertex";

class AdjustColor extends RendererBase {
	constructor(media, canvas, consts = {}, vars = {}) {
		super(media, canvas, consts, vars);

		// Offscreen canvas — filter target
		const filterCanvas = document.createElement("canvas");
		filterCanvas.width = canvas.width;
		filterCanvas.height = canvas.height;
		this.filterCanvas = filterCanvas;

		// Get WebGL context
		let gl;
		try {
			gl = filterCanvas.getContext("experimental-webgl");
			gl.viewportWidth = filterCanvas.width;
			gl.viewportHeight = filterCanvas.height;
		} catch (e) {
		}
		if (!gl) {
			console.error("Could not initialise WebGL, sorry :-(");
		}
		this.gl = gl;

		// Load shaders
		const fragmentShader = compileFragmentShader(gl, shaderText);
		const vertexShader = compileVertexShader(gl, vertexShaderText);
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.log("Could not initialise shaders");
			console.log(gl.getProgramInfoLog(shaderProgram));
		}
		gl.useProgram(shaderProgram);
		this.shaderProgram = shaderProgram;

		// Create texture from canvas
		const texture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.texture = texture;

		// 2 triangles to fill the whole canvas
		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array([
			  -1.0, -1.0, 
			   1.0, -1.0, 
			  -1.0,  1.0, 
			  -1.0,  1.0, 
			   1.0, -1.0, 
			   1.0,  1.0]), 
			gl.STATIC_DRAW
		);
		this.vertexBuffer = vertexBuffer;

		// Create texture map
		const textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,
			0.0, 1.0,
			1.0, 0.0,
			1.0, 1.0]),
		gl.STATIC_DRAW);
		this.textureBuffer = textureBuffer;

		this.onVarsUpdated();
	}

	onVarsUpdated(oldVars) {
		// TODO: Create several functions for different color corrections and multiply matrices here
		const matrix = new Float32Array(this.saturationMatrix(this.vars.saturation));
		matrix[4] /= 255;
		matrix[9] /= 255;
		matrix[14] /= 255;
		matrix[19] /= 255;
		this.matrix = matrix;
	}

	saturationMatrix(saturation) {
		// Saturation
		const x = (saturation || 0) * 2/3 + 1;
		const y = ((x-1) *-0.5);
		return [
			x, y, y, 0, 0,
			y, x, y, 0, 0,
			y, y, x, 0, 0,
			0, 0, 0, 1, 0
		];
	}

	async render(timestamp) {
		const gl = this.gl;

		// Clear the viewport
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Update the texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);

		// Set uniforms and attributes
		const mLocation = gl.getUniformLocation(this.shaderProgram, "m");
		gl.uniform1fv(mLocation, this.matrix);

		const texLocation = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(texLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);

		const positionLocation = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		// Render!
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		// Copy processed picture back to the source canvas
		const ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.drawImage(this.filterCanvas, 0, 0);
	}
}

export default AdjustColor;
