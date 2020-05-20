import React from 'react';

const List = (props) => {
    return (
        props.listItems.map((item) => {
            return (<li key={item.id}>
                {item.user}<span onClick={() =>{ props.onDelete(item.id)}/*this.deleteItem.bind(this, item.id)*/}></span>
            </li>)
        })
    )
}

export default List
