import React, { Component } from 'react';
import './App.css';
import Whammy from "whammy";

import DataProvider from "./services/DataProvider"
import SimpleSpectrum from "./analysers/SimpleSpectrum"
import StaticImage from "./analysers/StaticImage"

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
        // Download resources
        const loadAudio = fetch(this.audioFilePath)
            .then((response) => {
                // Get mp3 data as ArrayBuffer
                return response.arrayBuffer()
            })
            .then((fileData) => {
                // Decode mp3 to PCM ArrayBuffer
                var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                return new Promise((resolve, reject) => {
                    audioCtx.decodeAudioData(fileData, resolve, reject) 
                })
            })

        const loadImage = fetch("/cc-cover.jpeg")
            .then((response) => {
                return response.blob()
            })
            .then((imageBlob) => {
                return createImageBitmap(imageBlob)
            })


        Promise.all([loadAudio, loadImage])
            .then((data) => {
                this.decodedData = data[0]
                this.coverImage = data[1]
                this.initialize()
            })
            .catch((error) => {
                console.log(error)
                console.log("Failed to load resources")
            })
    }

    initialize() {
        // Initialize data provider
        let fftSize = 8192
        this.provider = new DataProvider(this.decodedData, fftSize)

        // Initialize visualizers array
        this.visualizers.push(new StaticImage(
            this.provider,
            this.canvasRef,
            {},
            {image: this.coverImage}
        ))
        this.visualizers.push(new SimpleSpectrum(
            this.provider,
            this.canvasRef,
            {},
            {}
        ))

        // Now we're ready to show anything
        this.setState({
            canPlay: true
        })

        // Start animations
        this.draw()
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
                <canvas width="1920" height="1080" style={{width: 960, height: 540}} ref={(canvas) => { this.canvasRef = canvas }} />
                <video ref={(video) => { this.videoRef = video }} />
            </div>
        );
    }
}

export default App;
