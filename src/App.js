import React, { useState, useRef } from 'react';
import './App.css';
import Drop from './Drop/Drop'
import List from './List/List'

let timeout = false;                  // флаг наличия таймаута пришлось вынести из state из-за ререндера при обновлении значения

export default function App(props) {
  const [appState, setAppState] = useState({
    scrollTop: 0,                   // последнее известное значение скроллТопа
    list: [{ "id": 0, "user": "aBrian" }, { "id": 1, "user": "André" }, { "id": 2, "user": "Berian" }, { "id": 3, "user": "Bfrian" }, { "id": 4, "user": "Briavn" }, { "id": 5, "user": "Briqan" }, { "id": 6, "user": "Brwian" }, { "id": 7, "user": "Jay" }, { "id": 8, "user": "nBrian" }, { "id": 9, "user": "sBrian" }],                       // список элементов
    dummyBeforeHeight: 0,           // высота болванки перед куском выводимого списка
    dummyAfterHeight: 0,            // высота болванки под куском выводимого списка
    startRenderFrom: 0,             // стартовая позиция, с которой будет браться кусок для вывода
    renderItemsCount: 10           // количество элементов, выводимых в куске. Можно сменить на любое > 0
  })
  const ulRef = useRef(null)

  const setList = (list) => {
    let curState = { ...appState };
    curState.list = list.map((item, index) => ({ id: index, user: item }))
    curState = defineDummiesHeight(0, curState)
    setAppState(curState)
  }

  const onDeleteHandler = (id) => {
    const curState = { ...appState };
    const index = curState.list.findIndex(x => x.id === id)
    if (index === -1) {
      return;
    }
    curState.list.splice(index, 1);
    setAppState(curState);
  }

  const defineDummiesHeight = (scrolledPixels = 0, payloadState) => {
    const curState = !payloadState ? { ...appState } : payloadState;
    const from = (scrolledPixels - scrolledPixels % 42) / 42    // 42 - высота элемента, жёстко заданная в CSS
    const d1h = (from) * 42
    const d2h = (curState.list.length - from - curState.renderItemsCount) * 42

    Object.assign(curState, {
      scrollTop: scrolledPixels,
      startRenderFrom: from,
      dummyBeforeHeight: d1h < 0 ? 0 : d1h,
      dummyAfterHeight: d2h < 0 ? 0 : d2h
    })
    return curState
  }

  const onScrollHandler = (e) => {
    if (!timeout) {                                           // Предотвращаем множественное обновление данных при скролле
      timeout = true;
      setTimeout(() => {
        const curState = defineDummiesHeight(ulRef.current.scrollTop)
        setAppState(curState)
        timeout = false;
      }, 50);                                                 // 50 - экспериментально полученное число
    }
  }

  return (
    <div className="app">
      <Drop onGetList={list => { setList(list); }} />
      <button onClick={() => { console.log(ulRef.current.scrollTop) }}>Show Log</button>
      <ul ref={ulRef} onScroll={onScrollHandler.bind(this)}>
        <li className="dummy dummy--before" style={{ height: appState.dummyBeforeHeight }}></li>
        <List onDelete={onDeleteHandler} listItems={appState.list.slice(appState.startRenderFrom, appState.startRenderFrom + appState.renderItemsCount)} />
        <li className="dummy dummy--after" style={{ height: appState.dummyAfterHeight }}></li>
      </ul>
    </div>
  );
}