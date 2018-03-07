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

	state = {
		widgets: [],
	}

	async componentDidMount() {
		console.log("componentDidMount() call");
		const { mediaAudio } = this.props;
		const { canvasRef } = this;
		const { widgets } = this.state;

		try {
			console.log("before await");
			widgets.push(await TimeScale.getInstance(canvasRef, TimeScalePreset.getInstance));
			widgets.push(await FrequencyVisualizer.getInstance(canvasRef, FrequencyVisualizerPreset.getInstance));
			console.log("after await");
		} catch (error) {
			return Promise.reject(new Error(`TimeLine.componentDidMount() failed: ${error}`));
		}

		widgets.forEach(widget => widget.setMediaAudio(mediaAudio));

		console.log("widgets ", widgets);
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({ widgets }); //! This is bad practice. It forces render() to be called twice

		return Promise.resolve();
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
		console.log("draw() call");
		const { widgets } = this.state;

		this.clearCanvas();

		await Promise.all(widgets.map(widget => widget.drawFrame(timestamp)));
	}

	render() {
		console.log("render() call");
		const {
			height,
			width,
		} = this.props;

		const { widgets } = this.state;

		// ? TODO: Get current audio time via props
		if (widgets.length > 0) {
			requestAnimationFrame(this.draw);
		}

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
