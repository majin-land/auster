export default (theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    padding: '10rem',
  },
  formContainer: {
    width: '30rem',
    padding: '2rem',
  },
  textAndLogo: {
    display: 'flex',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: '2rem',
  },
  textLink: {
    textDecoration: 'none',
    color: theme.color.primary,
    marginLeft: '5px',
  },
  textCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
})
