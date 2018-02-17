import React, { Component } from "react";

import DraggableCollapsiblePane from "./widgets/DraggableCollapsiblePane/DraggableCollapsiblePane";
import "./EffectsSidebar.css";

class EffectsSidebar extends Component {
	constructor(props) {
		super(props);

		this.buildContent = this.buildContent.bind(this);

		this.state = {
			dragged: null,
			dropTarget: null,
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

	setDragged(id) {
		if (!id) {
			this.setState({ dragged: null });
			// console.log("reset dragged");
			return;
		}
		if (this.state.dragged || this.assigningDraggableInProcess) { return; }
		this.assigningDraggableInProcess = true; // hack to prevent setting parents as dragged
		const dragged = this.state.elements.find(element => element.id === id);
		this.setState({ dragged }, () => {
			this.assigningDraggableInProcess = false;
			// console.log("set dragged", this.state.dragged.id);
		});
	}

	setDropTarget(id) {
		if (this.state.dragged && this.state.dragged.id && this.state.dragged.id === id) { return; }
		if (!id) {
			this.setState({ dropTarget: null });
			// console.log("reset target");
			return;
		}
		if (this.state.dropTarget || this.assigningDropTargetInProcess) { return; }
		this.assigningDropTargetInProcess = true;
		const dropTarget = this.state.elements.find(element => element.id === id);
		if (!dropTarget) { return; }
		this.setState({ dropTarget }, () => {
			this.assigningDropTargetInProcess = false;
			// console.log("set target", this.state.dropTarget.id);
		});
	}

	reorder() {
		console.log("reordering", this.state.dragged.id, this.state.dropTarget.id);
		const draggedIndex = this.state.elements.findIndex(element => element.id === this.state.dragged.id);
		const targetIndex = this.state.elements.findIndex(element => element.id === this.state.dropTarget.id);
		const elements = this.state.elements.slice(0);
		const dragged = elements.splice(draggedIndex, 1)[0];
		elements.splice(targetIndex, 0, dragged);
		this.setState({ elements });
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
		}).map(element => (
			<DraggableCollapsiblePane
				key={element.id}
				object={element}
				dragged={this.state.dragged}
				dropTarget={this.state.dropTarget}
				setDragged={id => this.setDragged(id)}
				setDropTarget={id => this.setDropTarget(id)}
				reorder={() => this.reorder()}
			/>));
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
