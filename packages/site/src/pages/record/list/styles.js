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
  transactionRecord: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem',
    fontSize: '1rem',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionNote: {
    fontSize: '0.8rem',
    marginLeft: '2.8rem',
  },
  categoryIcon: {
    marginRight: '1rem',
    width: '1.5rem',
    height: '1.5rem',
  },
})
