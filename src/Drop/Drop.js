import React, { Component } from 'react'
import './Drop.css'

/**
 * onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop
 */
const status = {
    default: {
        className: "",
        message: "Feed me with JSON"
    },
    hovered: {
        className: "drop--feed-me",
        message: "Oh, come on. Let it fall"
    },
    hoveredOut: {
        className: "",
        message: "Don't be greedy"
    },
    dropped: {
        className: "drop--eating",
        message: "yum-yum...🍌"
    },
    parsed: {
        className: "drop--ate",
        message: "yummy...😋 Drop something more"
    },
};
export default class Drop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'default',
            worker: new Worker('/workers/parseObj.js'),
            list: []
        }
        this.state.worker.addEventListener('message', e => {
            //this.state.list = e.data;
            this.props.onGetList(e.data);
            this.setState({ status: 'parsed' })
            /*self.$store.dispatch("updateStore", {
                incoming: e.data,
              });*/
        }, false);
        this.handleFileSelect = this.handleFileSelect.bind(this)
    }

    preventDrag(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    handleDragOut(e) {
        this.preventDrag(e);
        this.setState({ status: "hoveredOut" })
    }
    handleDragOver(e) {
        this.preventDrag(e);
        this.setState({ status: "hovered" })
    }
    handleFileSelect(e) {
        this.setState({ status: "dropped" })
        this.preventDrag(e);
        console.log(this.state);
        let reader = new FileReader();
        reader.readAsText(e.dataTransfer.files[0]);
        reader.onload = () => {
            this.state.worker.postMessage({ str: reader.result });
        };

    }
    render() {
        let classList = ['drop'];
        classList.push(status[this.state.status].className);
        return (
            <div>
                <div className={classList.join(" ")}
                    onDragLeave={this.handleDragOut.bind(this)}
                    onDragOver={this.handleDragOver.bind(this)}
                    onDrop={this.handleFileSelect}>
                    <div className="message">{status[this.state.status].message}</div>
                    <div className="eye"></div>
                    <div className="eye eye--right"></div>
                    <div className="mouth"></div>
                </div>
            </div>
        )
    }
}