/* global requestAnimationFrame */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { MediaAudio } from "../../../../core/media/index";
import Widgets from "./widgets";

import "./TimeLine.css";

export default class TimeLine extends Component {
	static propTypes = {
		baseHeight: PropTypes.number.isRequired,
		baseWidth: PropTypes.number.isRequired,
		mediaAudio: PropTypes.instanceOf(MediaAudio),
	};

	static defaultProps = {
		mediaAudio: null,
	};

	constructor(props) {
		super(props);

		// Declare widgets
		this.timeScale = null;
	}

	componentDidMount() {
		const { mediaAudio } = this.props;
		const { canvasRef } = this;

		this.timeScale = new Widgets.TimeScale(canvasRef, mediaAudio);
		// ! TODO: Think if it valid to init TimeScale in componentDidMount
		// requestAnimationFrame(draw); // ! TODO: Should be done like this?
		this.draw();
	}

	draw = () => {
		this.timeScale.drawFrame();
	};

	render() {
		const {
			baseHeight,
			baseWidth,
		} = this.props;

		return (
			<div className="root">
				<canvas
					className="canvas"
					height={baseHeight}
					width={baseWidth}
					style={{ height: baseHeight / 2, width: baseWidth / 2 }}
					ref={(canvas) => { this.canvasRef = canvas; }}
				/>
				<div className="footer">
					<div>Time Line Stub:</div>
					<div className="debug-controls">
						{/* <button className="debug-constrols__ctrl" onClick={this.testDraw}>Test draw</button> */}
						<div className="debug-constrols__ctrl">Canvas base dim: {baseWidth}x{baseHeight}</div>
					</div>
				</div>
			</div>
		);
	}
}
