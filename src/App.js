import React, { useState } from 'react';
import './App.css';
import Drop from './Drop/Drop'
import List from './List/List'
import Context from './context'

export default function App(props) {
  const [list, setList] = useState([]) // список элементов
  const [common, setCommon] = useState({
    dummyBeforeHeight: 0,           // высота болванки перед куском выводимого списка
    dummyAfterHeight: 0,            // высота болванки под куском выводимого списка
    startRenderFrom: 0,             // стартовая позиция, с которой будет браться кусок для вывода
  })
  const renderItemsCount = 10

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
      startRenderFrom: from,
      dummyBeforeHeight: d1h < 0 ? 0 : d1h,
      dummyAfterHeight: d2h < 0 ? 0 : d2h
    })
  }

  const slicedList = list.slice(common.startRenderFrom, common.startRenderFrom + renderItemsCount)

  return (
    <Context.Provider value={{ onDeleteHandler }}>
      <div className="app">

        <Drop onGetList={list => { onGetListHandler(list); }} />

        <List
          onScroll={defineDummiesHeight}
          listItems={slicedList}
          dummyAfterHeight={common.dummyAfterHeight}
          dummyBeforeHeight={common.dummyBeforeHeight}
        />

      </div>
    </Context.Provider>
  );
}