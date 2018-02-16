import React, { Component } from "react";
import PropTypes from "prop-types";

import "./CollapsiblePane.css";

class CollapsiblePane extends Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: false,
		};

		this.theme = this.props.theme;

		this.toggle = this.toggle.bind(this);
		this.nameClass = this.nameClass.bind(this);
		this.contentClass = this.contentClass.bind(this);
	}

	toggle() {
		this.setState({ collapsed: !this.state.collapsed });
	}

	nameClass() {
		return `collapsible-pane__name ${this.state.collapsed ? "collapsible-pane__name_collapsed" : ""}`;
	}

	contentClass() {
		return `collapsible-pane__content ${this.state.collapsed ? "collapsible-pane__content_hidden" : ""}`;
	}

	render() {
		return (
			<div className={`collapsible-pane collapsible-pane_theme_${this.theme}`}>
				<div
					role="button"
					className={this.nameClass()}
					onClick={this.toggle}
				>
					{this.props.name}
				</div>
				<div className={this.contentClass()}>{this.props.content}</div>
			</div>
		);
	}
}

export default CollapsiblePane;

CollapsiblePane.propTypes = {
	name: PropTypes.string.isRequired,
	content: PropTypes.shape({}).isRequired,
	theme: PropTypes.string,
};

CollapsiblePane.defaultProps = {
	theme: "odd",
};
