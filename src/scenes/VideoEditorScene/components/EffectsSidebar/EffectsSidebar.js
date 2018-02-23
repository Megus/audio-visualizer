import React, { Component } from "react";

import DraggableCollapsiblePane from "./widgets/DraggableCollapsiblePane/DraggableCollapsiblePane";
import "./EffectsSidebar.css";

class EffectsSidebar extends Component {
	constructor(props) {
		super(props);

		this.convertLayerToFlatState = this.convertLayerToFlatState.bind(this);
		this.convertFlatStateToLayer = this.convertFlatStateToLayer.bind(this);
		this.buildContent = this.buildContent.bind(this);

		this.state = {
			initialStructure: null,
			dragged: null,
			dropTarget: null,
			elements: [],
		};
	}

	componentWillReceiveProps(newProps) {
		if (!newProps || !newProps.mainGroup) { return; }
		this.setState({ initialStructure: Object.assign({}, newProps.mainGroup) });
		const layers = newProps.mainGroup.layers;
		let elements = [];
		layers.forEach((layer) => {
			elements = elements.concat(this.convertLayerToFlatState(layer, [], null));
		});
		this.setState({ elements });
		// console.log("back to hierarchy", this.convertFlatStateToLayer(elements, newProps.mainGroup));
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
			...layer,
			type: layer.layers ? "group" : "effect",
			parent: parent,
			params: !layer.layers && params,
		};
		flatState.push(rootObj);
		if (layer.layers) {
			layer.layers.forEach(sublayer => this.convertLayerToFlatState(sublayer, flatState, rootObj.title));
		}
		return flatState;
	}

	convertFlatStateToLayer(flatState, layer) {
		const title = layer.title === "Main group" ? null : layer.title;
		delete layer.parent;
		delete layer.type;
		delete layer.params;
		return {
			...layer,
			layers: flatState.filter(element => element.parent === title).map(element => {
				if (element.type === "effect") {
					// maybe refactor this
					delete element.parent;
					delete element.type;
					delete element.params;
					return element;
				} return this.convertFlatStateToLayer(flatState, element);
			}),
		};
	}

	setDragged(title) {
		if (!title) {
			this.setState({ dragged: null });
			return;
		}
		if (this.state.dragged || this.assigningDraggableInProcess) { return; }
		this.assigningDraggableInProcess = true; // hack to prevent setting parents as dragged
		const dragged = this.state.elements.find(element => element.title === title);
		this.setState({ dragged }, () => {
			this.assigningDraggableInProcess = false;
		});
	}

	setDropTarget(args) {
		if (!args) {
			this.setState({ dropTarget: null });
			return;
		}
		const { title, callback } = args;
		if (this.state.dragged && this.state.dragged.title && this.state.dragged.title === title) { return; }
		if (this.state.dropTarget || this.assigningDropTargetInProcess) { return; }
		this.assigningDropTargetInProcess = true;
		const dropTarget = this.state.elements.find(element => element.title === title);
		if (!dropTarget) { return; }
		this.setState({ dropTarget }, () => {
			this.assigningDropTargetInProcess = false;
			if (callback) {
				callback();
			}
		});
	}

	reorder(isDroppedAfter) {
		let newElements = this.state.elements.slice(0);
		const draggedIndex = newElements.findIndex(subLayer => subLayer.title === this.state.dragged.title);
		const dragged = newElements.splice(draggedIndex, 1)[0];
		if (isDroppedAfter) {
			newElements.push(dragged);
		} else {
			const targetIndex = newElements.findIndex(subLayer => subLayer.title === this.state.dropTarget.title);
			newElements.splice(targetIndex, 0, dragged);
		}
		newElements.find(element => element.title === this.state.dragged.title).parent = this.state.dropTarget.parent;
		this.props.update(this.convertFlatStateToLayer(newElements, this.state.initialStructure));
		this.setState({ dragged: null, dropTarget: null });
	}

	merge() {
		console.log(`merge ${this.state.dragged.title} and ${this.state.dropTarget.title}`);
	}

	buildContent(parent) {
		let elementsOnLevel = this.state.elements.filter(element => element.parent === parent);
		elementsOnLevel = elementsOnLevel.map((element) => {
			const elementWithContent = Object.assign({}, element);
			if (elementWithContent.type === "group") {
				elementWithContent.content = this.buildContent(elementWithContent.title);
			} else {
				const params = elementWithContent.params.map(param => (<li key={param.name}>{param.name}: {param.value.toString()}</li>));
				elementWithContent.content = (<ul>{params}</ul>);
			}
			return elementWithContent;
		});
		elementsOnLevel = elementsOnLevel.map(element => (
			<DraggableCollapsiblePane
				key={element.title}
				object={element}
				dragged={this.state.dragged}
				dropTarget={this.state.dropTarget}
				setDragged={title => this.setDragged(title)}
				setDropTarget={title => this.setDropTarget(title)}
				reorder={isDroppedAfter => this.reorder(isDroppedAfter)}
				merge={() => this.merge()}
				isLastChild={elementsOnLevel.indexOf(element) === elementsOnLevel.length - 1}
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
