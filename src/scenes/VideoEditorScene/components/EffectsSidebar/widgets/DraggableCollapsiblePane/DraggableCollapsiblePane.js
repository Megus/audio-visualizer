import React, { Component } from "react";
import PropTypes from "prop-types";

import CollapsiblePane from "../CollapsiblePane/CollapsiblePane";
import "./DraggableCollapsiblePane.css";

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
		if (nextProps.dragged === this.props.dragged) { return; }
		if (nextProps.dragged && nextProps.dragged.id !== this.props.object.id &&
				nextProps.dragged.parent !== this.props.object.id) {
			this.makeTargetable();
		} else {
			this.makeUntargetable();
		}
	}

	// as dragged

	onDragStart(event) {
		this.props.setDragged(this.props.object.id);
		return false;
	}

	onDrag(event) {
		event.target.style.visilibity = "hidden";
		event.target.style.height = "0px";
		event.target.style.overflow = "hidden";
	}

	onDragEnd(event) {
		event.preventDefault();
		event.target.style.visilibity = "";
		event.target.style.height = "";
		event.target.style.overflow = "";
		this.props.setDragged(null);
		this.props.setDropTarget(null);
		this.makeUndraggable(event);
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

	// as target

	onDragEnter(event) {
		event.preventDefault();
		if (this.props.dragged && this.props.dragged.id === this.props.object.id) { return; }
		if (this.props.dragged && this.props.dragged.parent === this.props.object.id) { return; }
		console.log("drag", this.props.dragged.name, "over", this.props.object.name);
		this.props.setDropTarget(this.props.object.id);
	}

	onDragLeave(event) {
		event.preventDefault();
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
		this.element.addEventListener("dragenter", this.onDragEnter, true);
		this.element.addEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
	}

	makeUntargetable() {
		this.element.removeEventListener("dragenter", this.onDragEnter, true);
		this.element.removeEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
	}

	render() {
		return (
			<div>
				<li
					ref={(element) => { this.element = element; }}
					id={`draggable-${this.props.object.id}`}
					key={this.props.object.id}
					onMouseDown={this.makeDraggable}
					onDragStart={this.onDragStart}
					onDrag={this.onDrag}
					onDragEnd={this.onDragEnd}
					onDragOver={event => event.preventDefault()}
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
		id: PropTypes.number,
		type: PropTypes.string,
		name: PropTypes.string,
		content: PropTypes.object,
	}).isRequired,
	dragged: PropTypes.shape({}).isRequired,
	dropTarget: PropTypes.shape({}).isRequired,
	setDragged: PropTypes.func.isRequired,
	setDropTarget: PropTypes.func.isRequired,
	reorder: PropTypes.func.isRequired,
	theme: PropTypes.string,
};

DraggableCollapsiblePane.defaultProps = {
	theme: "odd",
};
