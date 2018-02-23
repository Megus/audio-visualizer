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
		this.onTryingToReorder = this.onTryingToReorder.bind(this);
		this.onLeavingSpaceAfterElement = this.onLeavingSpaceAfterElement.bind(this);
		this.onReorder = this.onReorder.bind(this);
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
		const { target } = event;
		if (target.className === "drop-space-before-element") {
			return; // propagate to onReorder handler
		}
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
	}

	onDrop(event) {
		const { target } = event;
		if (target.className === "drop-space-before-element") {
			return; // propagate to onReorder handler
		}
		event.preventDefault();
		event.stopPropagation();
		const { dropTarget, dragged } = this.props;
		if (!dropTarget || !dragged) { return; }
		this.props.merge();
	}

	// reordering

	onTryingToReorder(event, isAfter) {
		const { target } = event;
		if (!isAfter && target.id &&
			target.id === `before-${this.props.dragged.id}`) { return; }
		event.preventDefault();
		event.stopPropagation();
		target.style.height = "200px";
		target.style.backgroundColor = "whitesmoke";
		target.style.margin = "10px 0";
	}

	onLeavingSpaceAfterElement(event) {
		const { target } = event;
		target.style.height = "";
		target.style.backgroundColor = "";
		target.style.margin = "";
	}

	onReorder(event, isAfter) {
		const { target } = event;
		event.preventDefault();
		event.stopPropagation();
		this.props.setDropTarget({
			id: this.props.object.id,
			callback: () => {
				this.props.reorder(isAfter);
			},
		});
		target.style.height = "";
		target.style.backgroundColor = "";
		target.style.margin = "";
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
		this.element.addEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
	}

	makeUntargetable() {
		this.element.removeEventListener("dragover", this.onDragEnter);
		this.element.removeEventListener("dragleave", this.onDragLeave, true);
		this.element.addEventListener("drop", this.onDrop, true);
	}

	setTargetStyle() {
		this.element.classList.add("merge-target");
	}

	resetStyle() {
		this.element.classList.remove("merge-target");
	}

	render() {
		return (
			<div>
				{
					(this.props.dragged && this.props.dragged.id === this.props.object.id) ||
					<div
						id={`before-${this.props.object.id}`}
						className="drop-space-before-element"
						onDragEnter={event => event.preventDefault()}
						onDragOver={this.onTryingToReorder}
						onDragLeave={this.onLeavingSpaceAfterElement}
						onDrop={this.onReorder}
					/>
				}
				<li
					ref={(element) => { this.element = element; }}
					id={this.props.object.id}
					className={`targetable-list-item targetable-list-item_for_${this.props.object.type}`}
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
				{
					(this.props.isLastChild) &&
					<div
						id={`after-${this.props.object.id}`}
						className="drop-space-before-element"
						onDragEnter={event => event.preventDefault()}
						onDragOver={event => this.onTryingToReorder(event, true)}
						onDragLeave={this.onLeavingSpaceAfterElement}
						onDrop={event => this.onReorder(event, true)}
					/>
				}
			</div>
		);
	}
}

export default DraggableCollapsiblePane;

DraggableCollapsiblePane.propTypes = {
	object: PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		content: PropTypes.object.isRequired,
	}).isRequired,
	dragged: orNull(PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired),
	dropTarget: orNull(PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired),
	setDragged: PropTypes.func.isRequired,
	setDropTarget: PropTypes.func.isRequired,
	reorder: PropTypes.func.isRequired,
	merge: PropTypes.func.isRequired,
	theme: PropTypes.string,
};

DraggableCollapsiblePane.defaultProps = {
	theme: "odd",
	dragged: null,
	dropTarget: null,
};
