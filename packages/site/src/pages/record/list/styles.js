export default (theme) => ({
  currentBalance: {
    padding: '0.5rem',
    borderRadius: '5px',
    backgroundColor: theme.color.primary,
    color: theme.color.white,
    marginBottom: '0.5rem',
  },
  currentBalanceInfo: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  transactionHistoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '300px',

    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
    },
  },
  recordItem: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  normalRecord: {
    '&:hover': {
      backgroundColor: theme.color.primaryLight,
    },
  },
  selectedRecord: {
    backgroundColor: theme.color.primaryDark,
    color: theme.color.white,
  },
  recordGroup: {
    marginBottom: '0.5rem',
  },
  recordDate: {
    fontSize: '0.8rem',
  },
  transactionRecord: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem',
  },
  recordLabel: {
    flex: 1,
    fontSize: '0.9rem',
  },
  transactionNote: {
    marginLeft: '2.8rem',
    fontSize: '0.8rem',
  },
  categoryIcon: {
    marginRight: '1rem',
    width: '1.5rem',
    height: '1.5rem',
  },
})
