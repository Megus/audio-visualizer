import React, { Component } from "react";
import VideoEditorScene from "./scenes/VideoEditorScene";
import "./App.css";

class App extends Component {
	render() {
		return (
			<div className="App">
				<VideoEditorScene />
			</div>
		);
	}
}

export default App;
