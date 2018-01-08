import React, { Component } from 'react';
import './App.css';
import Whammy from "whammy";
import DataProvider from "./services/DataProvider"
import SimpleSpectrum from "./analysers/SimpleSpectrum"

class App extends Component {
    constructor(props) {
        super(props)

        this.renderVideo = this.renderVideo.bind(this)
        this.draw = this.draw.bind(this)

        this.audioFilePath = "/bad-monday.mp3"

        this.state = {
            canPlay: false,
        }

        this.visualizers = []

    }

    componentDidMount() {
        this.setup()
    }

    setup() {
        // Download mp3
        fetch(this.audioFilePath)
            .then((response) => {
                // Get mp3 data as ArrayBuffer
                return response.arrayBuffer()
            })
            .then((fileData) => {
                // Decode mp3 to PCM ArrayBuffer
                var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                audioCtx.decodeAudioData(fileData, (decodedData) => {
                    // Initialize data provider
                    let fftSize = 8192
                    this.provider = new DataProvider(decodedData, fftSize)

                    // Initialize visualizers array
                    const vis1 = new SimpleSpectrum(this.provider, this.canvasRef)
                    this.visualizers.push(vis1)

                    // Now we're ready to show anything
                    this.setState({
                        canPlay: true
                    })

                    // Start animations
                    this.draw()
                }, () => {
                    console.log("Failed to decode audio file")
                })
            })
            .catch(() => {
                console.log("Failed to download file")
            })
    }

    renderVideo() {
        this.videoRecorder = new Whammy.Video(60);
        console.log(this.videoRecorder)

        this.draw()

        //var output = this.videoRecorder.compile();
        //var url = (window.webkitURL || window.URL).createObjectURL(output);
        //this.videoRef.src = url;
    }

    draw() {
        const canvas = this.canvasRef
        const canvasCtx = canvas.getContext("2d");

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.state.canPlay) {
            this.visualizers.forEach((visualizer) => { visualizer.drawFrame(this.audioRef.currentTime) })
        }

        //this.videoRecorder.add(canvas)
        requestAnimationFrame(this.draw);
    };

    render() {
        return (
            <div className="App">
                <audio src={this.audioFilePath} controls ref={(audio) => { this.audioRef = audio }} />
                <hr />
                <br />
                <button onClick={this.renderVideo}>Render</button>
                <br />
                <canvas width="800" height="450" ref={(canvas) => { this.canvasRef = canvas }} />
                <video ref={(video) => { this.videoRef = video }} />
            </div>
        );
    }
}

export default App;
