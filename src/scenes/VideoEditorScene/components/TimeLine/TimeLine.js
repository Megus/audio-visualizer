/* global requestAnimationFrame */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { MediaAudio } from "../../../../core/media/index";
import { divideOnEvenlyParts } from "../../../../services/commonFunctions";
import { TimeScale, FrequencyVisualizer } from "./widgets";
import { TimeScalePreset, FrequencyVisualizerPreset } from "./widgetPresets";


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

	constructor(props) {
		super(props);

		this.state = {
			widgets: [],
		};
	}

	async componentDidMount() {
		const self = this;
		const { mediaAudio } = self.props;
		const { canvasRef } = self;
		const { widgets } = self.state;

		const timeScalePreset = "presets/timeLineWidgets/timeScale/default.json";
		const timeScaleInstance = await TimeScalePreset.getInstance(timeScalePreset);

		const freqVisPreset = "presets/timeLineWidgets/frequencyVisualizer/default.json";
		const reqVisInstance = await FrequencyVisualizerPreset.getInstance(freqVisPreset);

		widgets.push(new TimeScale(canvasRef, timeScaleInstance));
		widgets.push(new FrequencyVisualizer(canvasRef, reqVisInstance));

		widgets.forEach(widget => widget.setMediaAudio(mediaAudio));

		//* self used to avoid Eslint complaining on calling setState inside componentDidMount
		//! This is bad practice. It forces render() to bo called twice
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
