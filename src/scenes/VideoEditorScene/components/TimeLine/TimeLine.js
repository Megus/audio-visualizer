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

		this.widgets = [];
	}

	componentDidMount() {
		const { mediaAudio } = this.props;
		const {
			canvasRef,
			widgets,
		} = this;

		widgets.push(new TimeScale(canvasRef, new TimeScalePreset()));
		widgets.push(new FrequencyVisualizer(canvasRef, new FrequencyVisualizerPreset()));
		// widgets[Widgets.TimeScale.name] = new Widgets.TimeScale(canvasRef);

		widgets.forEach(widget => widget.setMediaAudio(mediaAudio));
	}

	componentWillReceiveProps(nextProps) {
		const { mediaAudio } = this.props;
		const { widgets } = this;

		if (nextProps.mediaAudio === mediaAudio) {
			return;
		}

		widgets.forEach(widget => widget.setMediaAudio(nextProps.mediaAudio));

		// ! TODO: Call of preset load for TimeScale widget. Preset should be saved in state. Probably Redux will require here
	}

	clearCanvas = () => {
		const { canvasRef } = this;

		const ctx = canvasRef.getContext("2d");
		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
	}

	draw = async (timestamp) => {
		const { widgets } = this;

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
