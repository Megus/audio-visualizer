import React, { Component } from "react";
import PropTypes from "prop-types";

import "./EffectPane.css";

class EffectPane extends Component {
	constructor(props) {
		super(props);

		this.doStuff = this.doStuff.bind(this);
	}

	doStuff() {
		this.stuff = "";
	}

	render() {
		const params = this.props.effect.params.map(param => (<li key={param.name}>{param.name}: {param.value}</li>));
		return (
			<div className="effects-group__effects-list_effect">
				<div className="effects-group__effects-list_effect_effect-name">
					{this.props.effect.name}
				</div>
				<ul className="effects-group__effects-list_effect_effect-params">
					{params}
				</ul>
			</div>
		);
	}
}

export default EffectPane;

EffectPane.propTypes = {
	effect: PropTypes.shape({
		name: PropTypes.string,
		params: PropTypes.array,
	}).isRequired,
};
