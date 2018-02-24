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
		this.deleteElement = this.deleteElement.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.dragged || !nextProps.dropTarget) {
			this.resetStyle();
		}
		if (nextProps.dragged === this.props.dragged) { return; }
		if (nextProps.dragged && nextProps.dragged.title !== this.props.object.title &&
				nextProps.dragged.parent !== this.props.object.title) {
			this.makeTargetable();
		} else {
			this.makeUntargetable();
		}
	}

	// as dragged

	onDragStart(event) {
		event.stopPropagation();
		const { height } = this.element.getBoundingClientRect();
		this.props.setDragged(this.props.object.title, height);
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
		if (target.className === "drop-space before-element" || target.className === "drop-space after-element") {
			return; // propagate to onReorder handler
		}
		event.stopPropagation();
		event.preventDefault();
		if (this.props.dragged && this.props.dragged.title === this.props.object.title) { return; }
		if (this.props.dragged && this.props.dragged.parent === this.props.object.title) { return; }
		this.props.setDropTarget({
			title: this.props.object.title,
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
		if (target.className === "drop-space before-element" || target.className === "drop-space after-element") {
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
			target.id === `before-${this.props.dragged.uniqueId}`) { return; }
		event.preventDefault();
		event.stopPropagation();
		target.style.height = `${this.props.draggedHeight}px`;
		target.style.backgroundColor = "whitesmoke";
		target.style.margin = "10px 0";
		if (target.className === "drop-space before-element") {
			target.style.position = "relative";
		}
	}

	onLeavingSpaceAfterElement(event) {
		const { target } = event;
		target.style.height = "";
		target.style.backgroundColor = "";
		target.style.margin = "";
		target.style.position = "";
	}

	onReorder(event, isAfter) {
		const { target } = event;
		event.preventDefault();
		event.stopPropagation();
		this.props.setDropTarget({
			title: this.props.object.title,
			callback: () => {
				this.props.reorder(isAfter);
			},
		});
		target.style.height = "";
		target.style.backgroundColor = "";
		target.style.margin = "";
	}

	// helpers

	setTargetStyle() {
		this.element.classList.add("merge-target");
	}

	resetStyle() {
		this.element.classList.remove("merge-target");
	}

	makeDraggable(event) {
		this.element.setAttribute("draggable", "true");
		this.element.classList.add("draggable");
		event.stopPropagation();
	}

	makeUndraggable(event) {
		this.element.setAttribute("draggable", "false");
		this.element.classList.remove("draggable");
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

	deleteElement() {
		this.props.deleteElement(this.props.object.title);
	}

	render() {
		return (
			<div className="draggable-droppable-pane">
				{
					(this.props.dragged && this.props.dragged.title === this.props.object.title) ||
					<div
						id={`before-${this.props.object.uniqueId}`}
						className="drop-space before-element"
						onDragEnter={event => event.preventDefault()}
						onDragOver={this.onTryingToReorder}
						onDragLeave={this.onLeavingSpaceAfterElement}
						onDrop={this.onReorder}
					/>
				}
				<li
					ref={(element) => { this.element = element; }}
					id={this.props.object.uniqueId}
					className={`targetable-list-item targetable-list-item_for_${this.props.object.type}`}
					key={this.props.object.title}
					onMouseDown={this.makeDraggable}
					onMouseUp={this.makeUndraggable}
					onDragStart={this.onDragStart}
					onDrag={this.onDrag}
					onDragEnd={this.onDragEnd}
					onDragEnter={event => event.preventDefault()}
				>
					<CollapsiblePane
						name={this.props.object.title}
						content={this.props.object.content}
						theme={this.props.theme}
						showDeleteButton={true}
						onDelete={this.deleteElement}
					/>
				</li>
				{
					(this.props.isLastChild) &&
					<div
						id={`after-${this.props.object.uniqueId}`}
						className="drop-space after-element"
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
		type: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.object.isRequired,
		uniqueId: PropTypes.string.isRequired,
	}).isRequired,
	dragged: orNull(PropTypes.shape({
		type: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	}).isRequired),
	draggedHeight: PropTypes.number.isRequired,
	dropTarget: orNull(PropTypes.shape({
		type: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	}).isRequired),
	setDragged: PropTypes.func.isRequired,
	setDropTarget: PropTypes.func.isRequired,
	reorder: PropTypes.func.isRequired,
	merge: PropTypes.func.isRequired,
	deleteElement: PropTypes.func.isRequired,
	theme: PropTypes.string,
	isLastChild: PropTypes.bool.isRequired,
};

DraggableCollapsiblePane.defaultProps = {
	theme: "odd",
	dragged: null,
	dropTarget: null,
};
