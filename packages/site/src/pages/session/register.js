import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  FormControl,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core'

import { useRequest } from 'site/hooks'
import { useGlobalState, saveState } from 'site/state'
import { register, fetchCurrentUser } from 'site/services'
import { setApiAuth } from 'site/services/api'

import Link from 'site/components/link'

import styles from './styles'

const useStyles = makeStyles(styles)

const Register = () => {
  const classes = useStyles()
  const history = useHistory()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { isLoading, request } = useRequest(register)
  const [, setAccessToken] = useGlobalState('accessToken')
  const [, setUser] = useGlobalState('user')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await request({
      name,
      email,
      password,
    })
    if (!response) return
    const { data: { accessToken } } = response
    setApiAuth(accessToken)
    setAccessToken(accessToken)

    const responseUser = await fetchCurrentUser()
    if (!responseUser) return
    const { data: user } = responseUser
    setUser(user)
    saveState()
    history.replace('/')
  }

  return (
    <div className={classes.wrapper}>
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography
            variant="h1"
            className={classes.header}
          >
            AUSTER
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth className={classes.formField}>
              <TextField
                autoFocus
                fullWidth
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="text"
                name="email"
                required
              />
            </FormControl>
            <FormControl fullWidth className={classes.formField}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                name="name"
                required
              />
            </FormControl>
            <FormControl fullWidth className={classes.formField}>
              <TextField
                fullWidth
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                name="password"
                required
              />
            </FormControl>
            <Button
              fullWidth
              className={classes.actionButton}
              type="submit"
              color="primary"
              variant="contained"
              size="large"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              Register
            </Button>
          </form>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Typography>
            Already have an account?
          </Typography>
          <Link to="/login">
            Login
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default Register
