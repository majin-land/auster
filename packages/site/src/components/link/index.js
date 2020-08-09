import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MuiLink } from '@material-ui/core'

const Link = (props) => {
  return (
    <MuiLink
      component={RouterLink}
      to={props.to}
    >
      {props.children}
    </MuiLink>
  )
}

export default Link
