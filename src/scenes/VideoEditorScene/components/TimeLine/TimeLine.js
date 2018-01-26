import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import './TimeLine.css';

export default class TimeLine extends Component {
	static propTypes = {};

	render() {
		return (
			<div className="root">
				<div className="testControl">Control 1</div>
				<div className="testControl">Control 2</div>
			</div>
		);
	}
}
