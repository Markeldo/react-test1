import React from 'react'
import ListItem from '../ListItem/ListItem'

const List = (props) => {
    return (
        <ul onScroll={(e) => props.onScroll(e)}>
            <li className="dummy dummy--before" style={{ height: props.dummyBeforeHeight }}></li>
            {props.listItems.map(item => {
                return <ListItem key={item.id} id={item.id} user={item.user} />
            }) }
            <li className="dummy dummy--after" style={{ height: props.dummyAfterHeight }}></li>
        </ul>
    )
}

export default List
