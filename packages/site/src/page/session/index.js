import React, { useState }  from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  Button,
  FormControl,
  TextField,
} from '@material-ui/core'

import styles from './styles'

const useStyles = makeStyles(styles)

const Login = () => {
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={classes.wrapper}>
      <div className={classes.formContainer}>
        <div className={classes.textAndLogo}>
          <div className={classes.textStyle}>
            AUSTER
          </div>
        </div>
        <div>
          <form>
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
              <Button
                variant="contained"
                type="submit"
                size="large"
                fullWidth
                color="primary"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
