import React, { Component } from "react";
import PropTypes from "prop-types";

import CollapsiblePane from "../CollapsiblePane/CollapsiblePane";
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
		const listOfEffects = <ul>{effects}</ul>;
		return (
			<CollapsiblePane name={this.props.group.name} content={listOfEffects} />
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
