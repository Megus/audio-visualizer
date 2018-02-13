import React, { Component } from "react";
import PropTypes from "prop-types";

import EffectPane from "../EffectPane/EffectPane";
import "./EffectsGroup.css";

class EffectsGroup extends Component {
	constructor(props) {
		super(props);

		this.moveGroup = this.moveGroup.bind(this);
	}

	moveGroup() {
		this.stuff = "";
	}

	render() {
		const effects = this.props.group.effects.map(effect => (<li key={effect.name}><EffectPane effect={effect} /></li>));
		return (
			<div className="effects-group">
				<div className="effects-group__name">
					{this.props.group.name}
				</div>
				<ul className="effects-group__effects-list">
					{effects}
				</ul>
			</div>
		);
	}
}

EffectsGroup.propTypes = {
	group: PropTypes.shape({
		name: PropTypes.string,
		effects: PropTypes.array,
	}).isRequired,
};

export default EffectsGroup;
