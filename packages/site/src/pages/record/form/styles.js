export default (theme) => ({
  formContainer: {
    width: '280px',
    padding: '1rem',
    position: 'fixed',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  deleteButton: {
    backgroundColor: theme.color.red,
    fontWeight: 'bold',
    color: 'white',
    margin: '0 1rem',
  },
  categoryIcon: {
    marginRight: '1rem',
    width: '1.5rem',
    height: '1.5rem',
  },
  selectCategoryField: {
    padding: '0.2rem 0 0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    borderBottom: '1px solid grey',
  },
})
