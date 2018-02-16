import React, { Component } from "react";
import PropTypes from "prop-types";

import CollapsiblePane from "../CollapsiblePane/CollapsiblePane";
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
		const listOfParams = <ul>{params}</ul>;
		return (
			<CollapsiblePane name={this.props.effect.name} content={listOfParams} theme="even" />
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
