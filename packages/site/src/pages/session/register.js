import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import {
  Button,
  FormControl,
  TextField,
} from '@material-ui/core'

import { useRequest } from '~/src/hooks'
import { useGlobalState, saveState } from '~/src/state'
import { register, session } from '~/src/services'
import { setApiAuth } from '~/src/services/api'

import styles from './styles'

const useStyles = makeStyles(styles)

const Register = () => {
  const classes = useStyles()
  const history = useHistory()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { isLoading, error, request } = useRequest(register)
  const [, setAccessToken] = useGlobalState('accessToken')
  const [, setUser] = useGlobalState('user')

  const handleSubmit = async () => {
    const { data: { accessToken } } = await request({
      name,
      email,
      password,
    })
    setApiAuth(accessToken)
    setAccessToken(accessToken)
    const { data: user } = await session()
    setUser(user)
    saveState()
    history.replace('/')
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.formContainer}>
        <div className={classes.textAndLogo}>
          <div className={classes.textStyle}>
            AUSTER
          </div>
        </div>
        <div>
          <form noValidate autoComplete="off">
            <FormControl fullWidth style={{ marginBottom: '1rem' }}>
              <TextField
                autoFocus
                fullWidth
                label="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                name="name"
                required
              />
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: '1rem' }}>
              <TextField
                autoFocus
                fullWidth
                label="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="text"
                name="email"
                required
              />
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: '1rem' }}>
              <TextField
                fullWidth
                autoComplete="current-password"
                label="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                name="password"
                required
              />
            </FormControl>
            <div>
              {error && <div>{error.message}</div>}
              <Button
                variant="contained"
                size="large"
                fullWidth
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Register
              </Button>
            </div>
            <div className={classes.textCenter}>
              Have you an account?
              <Link className={classes.textLink} to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
