export default (theme) => ({
  container: {
    maxWidth: theme.global.maxContentWidth,
    padding: '0.5rem',
  },
  currentBalance: {
    padding: '0.5rem',
    borderRadius: '5px',
    backgroundColor: theme.color.primary,
    color: 'white',
    marginBottom: '0.5rem',
  },
  currentBalanceInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  header: {
    display: 'flex',
    flex: '1',
    justifyContent: 'flex-end',
    marginBottom: '0.5rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  leftContent: {
    flex: 2,
    marginRight: '0.5rem',
  },
  rightContent: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid lightgrey',
    borderRadius: '5px',
  },
  transactionDetail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionRecord: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
  transactionNote: {
    fontSize: '0.8rem',
    marginLeft: '1.8rem',
  },
  wrapperCategory: {
    maxHeight: '10rem',
  },
  listCategory: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  listCategoryChildren: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '1rem',
    cursor: 'pointer',
  },
  checkIcon: {
    color: '#6557b5',
  },
  recordList: {
    padding: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F0F0F0',
    },
  },
  selectedRecord: {
    backgroundColor: '#F0F0F0',
  },
  deleteButton: {
    backgroundColor: theme.color.red,
    fontWeight: 'bold',
    color: 'white',
    margin: '0 1rem',
  },
})
