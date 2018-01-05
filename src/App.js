import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Whammy from "whammy";

class App extends Component {
    constructor(props) {
        super(props)

        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.draw = this.draw.bind(this)
    }


    startRecording() {
        if (!this.audioRef) {
            console.log("Audio reference not set")
            return
        }

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var source = audioCtx.createMediaElementSource(this.audioRef);

        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.125
        
        this.analyser = audioCtx.createAnalyser()
        this.analyser.fftSize = 8192;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        source.connect(this.analyser);
        this.analyser.connect(gainNode)
        gainNode.connect(audioCtx.destination);

        console.log(Whammy)
        this.videoRecorder = new Whammy.Video(60);
        console.log(this.videoRecorder)

        this.draw()
    }

    stopRecording() {
        var output = this.videoRecorder.compile();
        var url = (window.webkitURL || window.URL).createObjectURL(output);
        this.videoRef.src = url;
    }

    draw() {
        var canvasCtx = this.canvasRef.getContext("2d");
        let canvas = this.canvasRef

        var drawVisual = requestAnimationFrame(this.draw);

        this.analyser.getByteFrequencyData(this.dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        var barWidth = /*(canvas.width / this.bufferLength) * 3*/1.0;
        var barHeight;
        var x = 0;
        var i = 0;
        var lastI = 0;
        var increment = 0.5;

        while (i < this.bufferLength) {
            barHeight = this.dataArray[Math.floor(i)];
            if (Math.floor(i) - Math.floor(lastI) > 1) {
                barHeight = 0
                for (var c = Math.floor(lastI) + 1; c <= Math.floor(i); c++) {
                    barHeight += this.dataArray[c]
                }
                barHeight = barHeight / (Math.floor(i) - Math.floor(lastI));
            }

            canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x, canvas.height-barHeight, barWidth, barHeight);

            x += barWidth;
            lastI = i;
            i += increment;
            increment += 0.001;
        }

        this.videoRecorder.add(canvas)
    };


    render() {
        return (
            <div className="App">
                <audio src="/bad-monday.mp3" controls ref={(audio) => { this.audioRef = audio }} />
                <hr />
                <br />
                <button onClick={this.startRecording}>Start</button>
                <button onClick={this.stopRecording}>Stop</button>
                <br />
                <canvas width="1600" height="300" ref={(canvas) => { this.canvasRef = canvas }} />
                <video ref={(video) => { this.videoRef = video }} />
            </div>
        );
    }
}

export default App;
