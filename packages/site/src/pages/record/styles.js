export default (theme) => ({
  container: {
    maxWidth: theme.global.maxContentWidth,
    margin: 'auto',
    padding: '0.5rem',
    marginTop: 0,
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
    flexDirection: 'column',
  },
  transactionHistoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '300px',

    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
    },
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
    alignItems: 'center',
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
    marginTop: '1rem',
    alignItems: 'center',
  },
  listCategoryChildren: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    alignItems: 'center',
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
