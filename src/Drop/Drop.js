import React, { useState } from 'react'
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
export default function Drop (props) {

    const [dropState, setDropState] = useState({
        status: 'default'
      })

    const worker = new Worker('/workers/parseObj.js')

    worker.addEventListener('message', e => {
        props.onGetList(e.data);
        setDropState({ status: 'parsed' })
    }, false)

    const preventDrag = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    const handleDragOut = (e) => {
        preventDrag(e);
        setDropState({ status: "hoveredOut" })
    }
    const handleDragOver = (e) => {
        preventDrag(e);
        setDropState({ status: "hovered" })
    }
    const handleFileSelect = (e) => {
        setDropState({ status: "dropped" })
        preventDrag(e);
        let reader = new FileReader();
        reader.readAsText(e.dataTransfer.files[0]);
        reader.onload = () => {
            worker.postMessage({ str: reader.result });
        };

    }
    let classList = ['drop',status[dropState.status].className]
    return (
        <div>
            <div className={classList.join(" ")}
                onDragLeave={handleDragOut.bind(this)}
                onDragOver={handleDragOver.bind(this)}
                onDrop={handleFileSelect}>
                <div className="message">{status[dropState.status].message}</div>
                <div className="eye"></div>
                <div className="eye eye--right"></div>
                <div className="mouth"></div>
            </div>
        </div>
    );
}