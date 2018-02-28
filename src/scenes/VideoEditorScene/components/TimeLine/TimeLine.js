/* global requestAnimationFrame */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { MediaAudio } from "../../../../core/media/index";
import { divideOnEvenlyParts } from "../../../../services/commonFunctions";
import { TimeScale, FrequencyVisualizer } from "./widgets";
import { TimeScalePreset, FrequencyVisualizerPreset, WidgetPresetCollection } from "./widgetPresets";

import "./TimeLine.css";

class TimeLine extends Component {
	static propTypes = {
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		mediaAudio: PropTypes.instanceOf(MediaAudio),
	};

	static defaultProps = {
		mediaAudio: null,
	};

	state = {
		widgets: [],
	}

	async componentDidMount() {
		const self = this;
		const { mediaAudio } = self.props;
		const { canvasRef } = self;
		const { widgets } = self.state;

		try {
			// const collection = new WidgetPresetCollection(TimeScalePreset.getInstance);
			// await collection.fill();
			// console.log(collection);
			// const hash = collection.asHashTableBy("name");
			// console.log(hash);
			// console.log(hash["Preset 1"]);

			const timeScalePreset = await TimeScalePreset.getInstance();
			const reqVisPreset = await FrequencyVisualizerPreset.getInstance();

			widgets.push(new TimeScale(canvasRef, timeScalePreset));
			widgets.push(new FrequencyVisualizer(canvasRef, reqVisPreset));
		} catch (error) {
			return Promise.reject(new Error(`TimeLine.componentDidMount() failed: ${error}`));
		}

		widgets.forEach(widget => widget.setMediaAudio(mediaAudio));

		//* self used to avoid Eslint complaining on calling setState inside componentDidMount
		//! This is bad practice. It forces render() to be called twice
		self.setState({ widgets });

		return Promise.resolve(); // TODO: Good practice to return non-hanging promises. Do refactoring everywhere
	}

	componentWillReceiveProps(nextProps) {
		const { mediaAudio } = this.props;
		const { widgets } = this.state;

		if (nextProps.mediaAudio === mediaAudio) {
			return;
		}

		widgets.forEach(widget => widget.setMediaAudio(nextProps.mediaAudio));
	}

	clearCanvas = () => {
		const { canvasRef } = this;

		const ctx = canvasRef.getContext("2d");
		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
	}

	draw = async (timestamp) => {
		const { widgets } = this.state;

		this.clearCanvas();

		await Promise.all(widgets.map(widget => widget.drawFrame(timestamp)));
	}

	render() {
		const {
			height,
			width,
		} = this.props;

		// ? TODO: Get current audio time via props
		requestAnimationFrame(this.draw);

		return (
			<div className="root">
				{/* //! TODO: Refactor component not to draw canvas until audio file is loaded */}
				<canvas
					className="canvas"
					height={height}
					width={width}
					style={{ height: divideOnEvenlyParts(height, 2), width: divideOnEvenlyParts(width, 2) }}
					ref={(canvas) => { this.canvasRef = canvas; }}
				/>
				{/* //! Footer is for debug */}
				<div className="footer">
					<div className="footer__ctrl">Time Line Stub:</div>
					{/* <button className="footer__ctrl" onClick={this.testDraw}>Test draw</button> */}
					<div className="footer__ctrl">Canvas base dim: {width}x{height}</div>
					<div className="footer__ctrl">Canvase style dim: {divideOnEvenlyParts(width, 2)}x{divideOnEvenlyParts(height, 2)}</div>
				</div>
			</div>
		);
	}
}

export default TimeLine;
