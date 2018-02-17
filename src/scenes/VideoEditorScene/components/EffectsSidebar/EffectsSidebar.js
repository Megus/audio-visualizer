import React, { Component } from "react";

import CollapsiblePane from "./widgets/CollapsiblePane/CollapsiblePane";
import "./EffectsSidebar.css";

class EffectsSidebar extends Component {
	constructor(props) {
		super(props);

		this.buildContent = this.buildContent.bind(this);

		this.state = {
			elements: [
				{
					id: 1,
					type: "group",
					name: "Group 1",
					parent: null,
				},
				{
					id: 2,
					type: "group",
					name: "Group Text",
					parent: null,
				},
				{
					id: 3,
					type: "effect",
					name: "Effect with no group",
					parent: null,
					params: [
						{
							name: "param1",
							value: "value1",
						}, {
							name: "param2",
							value: "value2",
						},
					],
				},
				{
					id: 4,
					type: "effect",
					name: "Video",
					parent: 1,
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
					id: 5,
					type: "effect",
					name: "SimpleSpectrum",
					parent: 1,
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
				{
					id: 6,
					type: "effect",
					name: "Cool Text Effect",
					parent: 2,
					params: [],
				},
				{
					id: 7,
					type: "group",
					name: "Nested Group",
					parent: 2,
				},
				{
					id: 8,
					type: "effect",
					name: "Nested Effect",
					parent: 7,
					params: [],
				},
			],
		};
	}

	buildContent(parent) {
		const elementsOnLevel = this.state.elements.filter(element => element.parent === parent).map((element) => {
			const elementWithContent = Object.assign({}, element);
			if (elementWithContent.type === "group") {
				elementWithContent.content = this.buildContent(elementWithContent.id);
			} else {
				const params = elementWithContent.params.map(param => (<li key={param.name}>{param.name}: {param.value}</li>));
				elementWithContent.content = (<ul>{params}</ul>);
			}
			return elementWithContent;
		}).map((element) => {
			const collapsiblePane = (<CollapsiblePane name={element.name} content={element.content} />);
			return (
				<li key={element.id}>{collapsiblePane}</li>
			);
		});
		return (<ul>{elementsOnLevel}</ul>);
	}

	render() {
		const items = this.buildContent(null);
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
