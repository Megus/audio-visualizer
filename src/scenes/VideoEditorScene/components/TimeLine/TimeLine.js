import React, { Component } from "react";
import PropTypes from "prop-types";

import Widgets from "./widgets";

import "./TimeLine.css";

export default class TimeLine extends Component {
	static propTypes = {
		baseHeight: PropTypes.number.isRequired,
		baseWidth: PropTypes.number.isRequired,
		// audio: PropTypes.instanceOf().isRequired,
	};

	testDraw = () => {
		const timeScale = new Widgets.TimeScale(this.canvasRef, null);
		timeScale.draw();
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
						<button className="debug-constrols__ctrl" onClick={this.testDraw}>Test draw</button>
						<div className="debug-constrols__ctrl">Canvas base dim: {baseWidth}x{baseHeight}</div>
					</div>
				</div>
			</div>
		);
	}
}
