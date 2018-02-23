import React, { Component } from "react";

import DraggableCollapsiblePane from "./widgets/DraggableCollapsiblePane/DraggableCollapsiblePane";
import "./EffectsSidebar.css";

class EffectsSidebar extends Component {
	constructor(props) {
		super(props);

		this.convertLayerToFlatState = this.convertLayerToFlatState.bind(this);
		this.buildContent = this.buildContent.bind(this);

		this.state = {
			dragged: null,
			dropTarget: null,
			elements: [],
		};
	}

	componentWillReceiveProps(newProps) {
		const layers = newProps.project.mainGroup.layers;
		let elements = [];
		layers.forEach((layer) => {
			elements = elements.concat(this.convertLayerToFlatState(layer, [], null));
		});
		this.setState({ elements });
	}

	convertLayerToFlatState(layer, flatState, parent) {
		const consts = Object.keys(layer.consts).map((key) => {
			return { name: key, value: layer.consts[key] };
		});
		const vars = Object.keys(layer.vars).map((key) => {
			return { name: key, value: layer.vars[key] };
		});
		const params = consts.concat(vars);
		const rootObj = {
			id: layer.id,
			name: layer.title,
			type: layer.layers ? "group" : "effect",
			parent: parent,
			params: !layer.layers && params,
		};
		flatState.push(rootObj);
		if (layer.layers) {
			layer.layers.forEach(sublayer => this.convertLayerToFlatState(sublayer, flatState, rootObj.id));
		}
		return flatState;
	}

	setDragged(id) {
		if (!id) {
			this.setState({ dragged: null });
			return;
		}
		if (this.state.dragged || this.assigningDraggableInProcess) { return; }
		this.assigningDraggableInProcess = true; // hack to prevent setting parents as dragged
		const dragged = this.state.elements.find(element => element.id === id);
		this.setState({ dragged }, () => {
			this.assigningDraggableInProcess = false;
		});
	}

	setDropTarget(args) {
		if (!args) {
			this.setState({ dropTarget: null });
			return;
		}
		const { id, callback } = args;
		if (this.state.dragged && this.state.dragged.id && this.state.dragged.id === id) { return; }
		if (this.state.dropTarget || this.assigningDropTargetInProcess) { return; }
		this.assigningDropTargetInProcess = true;
		const dropTarget = this.state.elements.find(element => element.id === id);
		if (!dropTarget) { return; }
		this.setState({ dropTarget }, () => {
			this.assigningDropTargetInProcess = false;
			if (callback) {
				callback();
			}
		});
	}

	reorder() {
		console.log(`reorder ${this.state.dragged.name} and ${this.state.dropTarget.name}`);
	}

	merge() {
		console.log(`merge ${this.state.dragged.name} and ${this.state.dropTarget.name}`);
	}

	buildContent(parent) {
		const elementsOnLevel = this.state.elements.filter(element => element.parent === parent).map((element) => {
			const elementWithContent = Object.assign({}, element);
			if (elementWithContent.type === "group") {
				elementWithContent.content = this.buildContent(elementWithContent.id);
			} else {
				const params = elementWithContent.params.map(param => (<li key={param.name}>{param.name}: {param.value.toString()}</li>));
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
				merge={() => this.merge()}
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
