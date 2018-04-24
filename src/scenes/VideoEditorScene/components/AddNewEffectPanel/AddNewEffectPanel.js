import React, { Component } from "react";
import PropTypes from "prop-types";

import LSimpleSpectrum from "../../../../core/renderers/layers/SimpleSpectrum";
import LSimpleWave from "../../../../core/renderers/layers/SimpleWave";
import LSimpleImage from "../../../../core/renderers/layers/SimpleImage";
import LSimplePower from "../../../../core/renderers/layers/SimplePower";
import LSimpleVideo from "../../../../core/renderers/layers/SimpleVideo";

import "./AddNewEffectPanel.css";

class AddNewEffectPanel extends Component {
	constructor(props) {
		super(props);

		this.onChoice = this.onChoice.bind(this);

		this.effectsAvailable = [
			LSimpleSpectrum,
			LSimpleWave,
			LSimpleImage,
			LSimplePower,
			LSimpleVideo,
		];
	}

	onChoice(effect) {
		this.props.onChoice({
			id: effect.id,
			title: effect.name,
			consts: {},
			vars: {
				frame: {
					"x": 0,
					"y": 700,
					"width": 1920,
					"height": 380
				}
			}
		});
	}

	render() {
		const effects = this.effectsAvailable.map(effect => (
			<li
				className="effects-list__effect"
				key={effect.name}
				onClick={event => this.onChoice(effect)}
			>
				{effect.name}
			</li>
		));
		return (
			<div className="modal">
				<div className="modal__overlay" onClick={event => this.props.onClose()} />
				<div className="modal__popup add-effect-modal">
					<ul className="effects-list">
						{effects}
					</ul>
				</div>
			</div>
		);
	}
}

export default AddNewEffectPanel;

AddNewEffectPanel.propTypes = {
	onClose: PropTypes.func.isRequired,
	onChoice: PropTypes.func.isRequired,
};

