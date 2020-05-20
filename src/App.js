import React, { useState, useRef } from 'react';
import './App.css';
import Drop from './Drop/Drop'
import List from './List/List'

export default function App(props) {
  const [list, setList] = useState([]) // список элементов
  const [common, setCommon] = useState({
    scrollTop: 0,                   // последнее известное значение скроллТопа
    dummyBeforeHeight: 0,           // высота болванки перед куском выводимого списка
    dummyAfterHeight: 0,            // высота болванки под куском выводимого списка
    startRenderFrom: 0,             // стартовая позиция, с которой будет браться кусок для вывода
  })
  const renderItemsCount = 10 
  const ulRef = useRef(null)

  const onGetListHandler = (list) => {
    setList(list.map((item, index) => ({ id: index, user: item })))
    defineDummiesHeight(0, list.length);
  }

  const onDeleteHandler = (id) => {
    setList(list.concat().filter(item => item.id !== id));
  }

  const defineDummiesHeight = (scrolledPixels = 0, listLength = null) => {
    listLength = !listLength ? list.length : listLength;
    const from = (scrolledPixels - scrolledPixels % 42) / 42    // 42 - высота элемента, жёстко заданная в CSS
    const d1h = (from) * 42
    const d2h = (listLength - from - renderItemsCount) * 42

    setCommon({
      scrollTop: scrolledPixels,
      startRenderFrom: from,
      dummyBeforeHeight: d1h < 0 ? 0 : d1h,
      dummyAfterHeight: d2h < 0 ? 0 : d2h
    })
  }

  const slicedList = list.slice(common.startRenderFrom, common.startRenderFrom + renderItemsCount)

  return (
    <div className="app">
      <Drop onGetList={list => { onGetListHandler(list); }} />
      <ul ref={ulRef} onScroll={(e) => defineDummiesHeight(e.target.scrollTop)}>
        <li className="dummy dummy--before" style={{ height: common.dummyBeforeHeight }}></li>
        <List onDelete={onDeleteHandler} listItems={slicedList} />
        <li className="dummy dummy--after" style={{ height: common.dummyAfterHeight }}></li>
      </ul>
    </div>
  );
}