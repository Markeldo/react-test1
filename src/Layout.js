import React, { Component } from 'react';
import Drop from './Drop/Drop'

let timeout = false;

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevent: false,
      scrollTop: 0,
      list: [],
      dummyBeforeHeight: 0,
      dummyAfterHeight: 0,
      startRenderFrom: 0,
      renderItemsCount: 200
    }
    this.ulRef = React.createRef()
  }
  setList(list) {
    this.setState({ list });
    this.defineDummiesHeight();
  }
  deleteItem(index) {
    const list = this.state.list.concat();
    list.splice(index, 1);
    this.setState({ list });
  }
  defineDummiesHeight(scrolledPixels) {
    if (!scrolledPixels) {
      scrolledPixels = 0;
    }
    let from = (scrolledPixels - scrolledPixels % 42) / 42
    let d1h = (from) * 42
    let d2h = (this.state.list.length - from - this.state.renderItemsCount) * 42
    console.log(scrolledPixels, this.state.scrollTop, scrolledPixels - this.state.scrollTop)
    if (scrolledPixels > this.state.scrollTop) {
      setTimeout(() => {
        this.ulRef.current.scrollTop = scrolledPixels;
      }, 50)
    }
    this.setState({
      scrollTop: scrolledPixels,
      startRenderFrom: from,
      dummyBeforeHeight: d1h < 0 ? 0 : d1h,
      dummyAfterHeight: d2h < 0 ? 0 : d2h
    })
  }
  onScrollHandler(e) {

    /*if (this.state.prevent === true) {
      return;
    }
    this.setState({ prevent: true })*/
    const scrolledPixels = e.target.scrollTop * 1;

    if (!timeout) {
      timeout = setTimeout(() => {
        this.defineDummiesHeight(this.ulRef.current.scrollTop)
        clearTimeout(timeout)
        timeout = false
      }, 50);
    }

    if (Math.abs(scrolledPixels - this.state.scrollTop) < 21) {
      return;
    }

    /*setTimeout(() => {
      this.setState({ prevent: false })
      this.defineDummiesHeight(scrolledPixels);
    }, 50)*/

    // закомментил this.defineDummiesHeight(scrolledPixels);
  }
  shouldComponentUpdate() {
    if (this.state.scrollTop === this.ulRef.current.scrollTop && this.state.scrollTop !== 0)
      return false
    console.log(this.state.scrollTop,this.ulRef.current.scrollTop,'<!--');
    return true
  }
  render() {
    console.log('re-render');
    let list = null;
    if (this.state.list.length > 0) {
      list = this.state.list.slice(this.state.startRenderFrom, this.state.startRenderFrom + this.state.renderItemsCount).map((item, index) => {
        return (
          <li key={index}>
            {item}<span onClick={this.deleteItem.bind(this, index)}></span>
          </li>
        )
      })
    }

    //console.log(new Date());
    /*if (this.ulRef.current) {
      this.ulRef.current.scrollTop = this.state.scrollTop;
    }*/
    return (
      <div className="app">
        <Drop onGetList={list => this.setList(list)} />
        <button onClick={() => { this.ulRef.current.scrollTop = this.ulRef.current.scrollTop + 300 }}>Scroll</button>
        <span>total: {this.state.list.length}</span>
        <span>startRenderFrom: {this.state.startRenderFrom}, </span>
        <span>dummyBeforeHeight: {this.state.dummyBeforeHeight}, </span>
        <span>dummyAfterHeight: {this.state.dummyAfterHeight}, </span>
        <span>totalHeight: {this.state.list.length * 42} </span>
        <ul ref={this.ulRef} onScroll={this.onScrollHandler.bind(this)}>
          <li className="dummy dummy--before" style={{ height: this.state.dummyBeforeHeight }}></li>
          {list}
          {<li className="dummy dummy--after" style={{ height: this.state.dummyAfterHeight }}></li>}
        </ul>
      </div>
    );
  }
}

