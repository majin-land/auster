export default (theme) => ({
  categoryListItem: {
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    alignItems: 'center',
    padding: '0.3rem 0',
  },
  subCategoryContainers: {
    marginLeft: '1rem',
  },
  checkIcon: {
    color: theme.color.green,
  },
  categoryIcon: {
    marginRight: '1rem',
    width: '1.5rem',
    height: '1.5rem',
  },
  divider: {
    margin: '0.5rem 0',
  },
})
