import React, { Component }  from 'react';
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

export default function DrawerButton(props) {

  return (
    <ListItem >
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.text}/>
    </ListItem>
    )
}