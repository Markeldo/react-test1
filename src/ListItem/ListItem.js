import React, { useContext } from 'react'
import Context from '../context'

const ListItem = (props) => {
    const { onDeleteHandler } = useContext(Context)
    return (
        <li>
            {props.user}<span onClick={onDeleteHandler.bind(null,props.id)}></span>
        </li>
    )
}

export default ListItem
