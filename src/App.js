import React, { Component } from 'react';
import './App.css';
import Drop from './Drop/Drop'

let timeout = false;                  // флаг наличия таймаута пришлось вынести из state из-за ререндера при обновлении значения

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,                   // последнее известное значение скроллТопа
      list: [],                       // список элементов
      dummyBeforeHeight: 0,           // высота болванки перед куском выводимого списка
      dummyAfterHeight: 0,            // высота болванки под куском выводимого списка
      startRenderFrom: 0,             // стартовая позиция, с которой будет браться кусок для вывода
      renderItemsCount: 200           // количество элементов, выводимых в куске. Можно сменить на любое > 0
    }
    this.ulRef = React.createRef()
  }
  setList(list) {
    this.setState({
      list: list.map((item, index) => ({ id: index, user: item }))
    });
    this.defineDummiesHeight();
  }
  deleteItem(id) {
    let index = this.state.list.findIndex(x => x.id === id)
    if (index === -1) {
      return;
    }
    const list = this.state.list.concat();
    list.splice(index, 1);
    this.setState({ list });
  }
  defineDummiesHeight(scrolledPixels) {
    if (!scrolledPixels) {
      scrolledPixels = 0;
    }
    let from = (scrolledPixels - scrolledPixels % 42) / 42    // 42 - высота элемента, жёстко заданная в CSS
    let d1h = (from) * 42
    let d2h = (this.state.list.length - from - this.state.renderItemsCount) * 42
    if (scrolledPixels > this.state.scrollTop) {              // костыль для скролла вниз
      setTimeout(() => {
        this.ulRef.current.scrollTop = scrolledPixels;
      }, 50)                                                  // 50 - экспериментально полученное число
    }
    this.setState({
      scrollTop: scrolledPixels,
      startRenderFrom: from,
      dummyBeforeHeight: d1h < 0 ? 0 : d1h,
      dummyAfterHeight: d2h < 0 ? 0 : d2h
    })
  }
  onScrollHandler(e) {

    if (!timeout) {                                           // Предотвращаем множественное обновление данных при скролле
      timeout = true;
      setTimeout(() => {
        this.defineDummiesHeight(this.ulRef.current.scrollTop)
        timeout = false;
      }, 50);                                                 // 50 - экспериментально полученное число
    }
  }
  render() {
    let list = null;
    if (this.state.list.length > 0) {
      list = this.state.list.slice(this.state.startRenderFrom, this.state.startRenderFrom + this.state.renderItemsCount).map(item => {
        return (
          <li key={item.id}>
            {item.user}<span onClick={this.deleteItem.bind(this, item.id)}></span>
          </li>
        )
      })
    }
    return (
      <div className="app">
        <Drop onGetList={list => this.setList(list)} />
        {/*<div>Данные для тестов</div>
        <button onClick={() => { this.ulRef.current.scrollTop = this.ulRef.current.scrollTop + 300 }}>Scroll</button>
        <span>total: {this.state.list.length}</span>
        <span>startRenderFrom: {this.state.startRenderFrom}, </span>
        <span>dummyBeforeHeight: {this.state.dummyBeforeHeight}, </span>
        <span>dummyAfterHeight: {this.state.dummyAfterHeight}, </span>
    <span>totalHeight: {this.state.list.length * 42} </span>*/}
        <ul ref={this.ulRef} onScroll={this.onScrollHandler.bind(this)}>
          <li className="dummy dummy--before" style={{ height: this.state.dummyBeforeHeight }}></li>
          {list}
          {<li className="dummy dummy--after" style={{ height: this.state.dummyAfterHeight }}></li>}
        </ul>
      </div>
    );
  }
}

