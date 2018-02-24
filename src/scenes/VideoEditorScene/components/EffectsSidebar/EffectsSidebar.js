import React, { Component } from "react";
import PropTypes from "prop-types";

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
			draggedHeight: 0,
			dropTarget: null,
			elements: [],
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps || !nextProps.mainGroup) { return; }
		this.setState({ initialStructure: Object.assign({}, nextProps.mainGroup) });
		const { mainGroup } = nextProps;
		const { layers } = mainGroup;
		let elements = [];
		layers.forEach((layer) => {
			elements = elements.concat(this.convertLayerToFlatState(layer, [], null));
		});
		this.setState({ elements });
		// console.log("back to hierarchy", this.convertFlatStateToLayer(elements, nextProps.mainGroup));
	}


	setDragged(title, draggedHeight) {
		if (!title) {
			this.setState({ dragged: null, draggedHeight: 0 });
			return;
		}
		if (this.state.dragged || this.assigningDraggableInProcess) { return; }
		this.assigningDraggableInProcess = true; // hack to prevent setting parents as dragged
		const dragged = this.state.elements.find(element => element.title === title);
		this.setState({ dragged, draggedHeight }, () => {
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

	convertFlatStateToLayer(flatState, layer) {
		const {
			parent, type, ...reducedLayer
		} = layer;
		const title = reducedLayer.title === "Main group" ? null : reducedLayer.title;
		return {
			...reducedLayer,
			layers: flatState.filter(element => element.parent === title).map((element) => {
				if (element.type === "effect") {
					const {
						parent, type, ...reducedElement
					} = element;
					return reducedElement;
				} return this.convertFlatStateToLayer(flatState, element);
			}),
		};
	}

	convertLayerToFlatState(layer, flatState, parent) {
		const rootObj = {
			...layer,
			parent,
			type: layer.layers ? "group" : "effect",
			uniqueId: layer.title.toLowerCase().replace(/\s/g, "_"),
		};
		flatState.push(rootObj);
		if (layer.layers) {
			layer.layers.forEach(sublayer => this.convertLayerToFlatState(sublayer, flatState, rootObj.title));
		}
		return flatState;
	}

	reorder(isDroppedAfter) {
		const newElements = this.state.elements.slice(0);
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
		const newElements = this.state.elements.slice(0);
		const target = newElements.find(subLayer => subLayer.title === this.state.dropTarget.title);
		const targetIndex = newElements.indexOf(target);
		const dragged = newElements.find(subLayer => subLayer.title === this.state.dragged.title);
		const newGroupCount = newElements.filter(element => element.title.substr(0, 9) === "New Group").length;
		let title;
		if (newGroupCount > 0) {
			title = `New Group (${newGroupCount + 1})`;
		} else {
			title = "New Group";
		}
		newElements.splice(targetIndex, 0, {
			id: "GGroup",
			title,
			consts: {},
			vars: {},
			type: "group",
			parent: this.state.dropTarget.parent,
		});
		target.parent = title;
		dragged.parent = title;
		this.props.update(this.convertFlatStateToLayer(newElements, this.state.initialStructure));
		this.setState({ dragged: null, dropTarget: null });
	}

	buildContent(parent) {
		let elementsOnLevel = this.state.elements.filter(element => element.parent === parent);
		elementsOnLevel = elementsOnLevel.map((element) => {
			const elementWithContent = Object.assign({}, element);
			if (elementWithContent.type === "group") {
				elementWithContent.content = this.buildContent(elementWithContent.title);
			} else {
				const params = Object.keys(elementWithContent.consts)
					.map(key => (<li key={key}>{key}: {elementWithContent.consts[key].toString()}</li>))
					.concat(Object.keys(elementWithContent.vars)
						.map(key => (<li key={key}>{key}: {elementWithContent.vars[key].toString()}</li>)));
				elementWithContent.content = (<ul>{params}</ul>);
			}
			return elementWithContent;
		});
		elementsOnLevel = elementsOnLevel.map(element => (
			<DraggableCollapsiblePane
				key={element.title}
				object={element}
				dragged={this.state.dragged}
				draggedHeight={this.state.draggedHeight}
				dropTarget={this.state.dropTarget}
				setDragged={(title, draggedHeight) => this.setDragged(title, draggedHeight)}
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

EffectsSidebar.propTypes = {
	update: PropTypes.func.isRequired,
	mainGroup: PropTypes.shape({}).isRequired,
};
