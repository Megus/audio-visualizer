import React, { Component } from "react";
import PropTypes from "prop-types";

import CollapsiblePane from "../CollapsiblePane/CollapsiblePane";
import "./DraggableCollapsiblePane.css";

const orNull = wrappedPropTypes => (props, propName, ...rest) => {
	if (props[propName] === null) { return null; }
	return wrappedPropTypes(props, propName, ...rest);
};

class DraggableCollapsiblePane extends Component {
	constructor(props) {
		super(props);

		this.onDragStart = this.onDragStart.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.makeDraggable = this.makeDraggable.bind(this);
		this.makeUndraggable = this.makeUndraggable.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.dragged || !nextProps.dropTarget) {
			this.resetStyle();
		}
		if (nextProps.dragged === this.props.dragged) { return; }
		if (nextProps.dragged && nextProps.dragged.id !== this.props.object.id &&
				nextProps.dragged.parent !== this.props.object.id) {
			this.makeTargetable();
		} else {
			this.makeUntargetable();
		}
	}

	// as dragged

	onDragStart() {
		this.props.setDragged(this.props.object.id);
		return false;
	}

	onDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		const { dropTarget, dragged } = this.props;
		if (!dropTarget || !dragged) { return; }
		if (dropTarget.type === "group") {
			if (dragged.type === "group") {
				console.log(`merge ${dragged.name} with ${dropTarget.name}`);
			} else if (dragged.type === "effect") {
				console.log(`append ${dragged.name} to ${dropTarget.name}`);
			}
		} else if (dropTarget.type === "effect") {
			if (dragged.type === "group") {
				console.log(`create a group of group ${dragged.name} && effect ${dropTarget.name}`);
			} else if (dragged.type === "effect") {
				console.log(`create a group of two effects: ${dragged.name} && ${dropTarget.name}`);
			}
		}
	}

	onDrag(event) {
		const { target } = event;
		target.style.visilibity = "hidden";
		target.style.height = "0px";
		target.style.overflow = "hidden";
	}

	onDragEnd(event) {
		event.preventDefault();
		const { target } = event;
		target.style.visilibity = "";
		target.style.height = "";
		target.style.overflow = "";
		this.props.setDragged(null);
		this.props.setDropTarget(null);
		this.makeUndraggable(event);
	}

	// as target

	onDragEnter(event) {
		event.stopPropagation();

		event.preventDefault();
		if (this.props.dragged && this.props.dragged.id === this.props.object.id) { return; }
		if (this.props.dragged && this.props.dragged.parent === this.props.object.id) { return; }
		this.props.setDropTarget({
			id: this.props.object.id,
			callback: () => {
				this.setTargetStyle();
			},
		});
	}

	onDragLeave(event) {
		event.preventDefault();
		this.props.setDropTarget(null);
		// this.resetStyle();
	}

	// helpers

	makeDraggable(event) {
		this.element.setAttribute("draggable", "true");
		event.stopPropagation();
	}

	makeUndraggable(event) {
		this.element.setAttribute("draggable", "false");
		if (event) { event.stopPropagation(); }
	}

	makeTargetable() {
		this.element.addEventListener("dragover", this.onDragEnter);
		// this.element.addEventListener("dragover", (event) => { console.log(this.props.object.name);event.stopPropagation(); });
		this.element.addEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
		// console.log("targetable:", this.props.object.name);
	}

	makeUntargetable() {
		this.element.removeEventListener("dragover", this.onDragEnter);
		this.element.removeEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
	}

	setTargetStyle() {
		// console.log("set target style");
		this.element.classList.add("merge-target");
		// this.element.style.opacity = "0.3";
	}

	resetStyle() {
		this.element.classList.remove("merge-target");
		// this.element.style.opacity = "";
	}

	render() {
		return (
			<div>
				<li
					ref={(element) => { this.element = element; }}
					id={this.props.object.id}
					className="targetable-list-item"
					key={this.props.object.id}
					onMouseDown={this.makeDraggable}
					onDragStart={this.onDragStart}
					onDrag={this.onDrag}
					onDragEnd={this.onDragEnd}
					onDragEnter={event => event.preventDefault()}
				>
					<CollapsiblePane
						name={this.props.object.name}
						content={this.props.object.content}
						theme={this.props.theme}
					/>
				</li>
				<div className="drop-target" />
			</div>
		);
	}
}

export default DraggableCollapsiblePane;

DraggableCollapsiblePane.propTypes = {
	object: PropTypes.shape({
		id: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		content: PropTypes.object.isRequired,
	}).isRequired,
	dragged: orNull(PropTypes.shape({
		id: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired),
	dropTarget: orNull(PropTypes.shape({
		id: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired),
	setDragged: PropTypes.func.isRequired,
	setDropTarget: PropTypes.func.isRequired,
	reorder: PropTypes.func.isRequired,
	theme: PropTypes.string,
};

DraggableCollapsiblePane.defaultProps = {
	theme: "odd",
	dragged: null,
	dropTarget: null,
};
