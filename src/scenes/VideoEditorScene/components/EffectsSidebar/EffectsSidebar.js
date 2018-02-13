import React, { Component } from "react";

import EffectsGroup from "./widgets/EffectsGroup/EffectsGroup";
import "./EffectsSidebar.css";

class EffectsSidebar extends Component {
	constructor(props) {
		super(props);

		this.effectGroups = [
			{
				name: "Group 1",
				effects: [
					{
						name: "Video",
						params: [
							{
								name: "File",
								value: "video.mp4",
							},
							{
								name: "Looped",
								value: false,
							},
							{
								name: "Frame",
								value: "whatever",
							},
							{
								name: "Alpha",
								value: 1,
							},
						],
					},
					{
						name: "SimpleSpectrum",
						params: [
							{
								name: "barsCount",
								value: 2,
							}, {
								name: "scale",
								value: "value",
							},
						],
					},
				],
			},
			{
				name: "Group Text",
				effects: [
					{
						name: "Cool Text Effect",
						params: [],
					},
				],
			},
		];
	}

	render() {
		const items = this.effectGroups.map(group => (<li key={group.name}><EffectsGroup group={group} /></li>));
		return (
			<div className="sidebar">
				<ul>
					{items}
				</ul>
			</div>
		);
	}
}

export default EffectsSidebar;
