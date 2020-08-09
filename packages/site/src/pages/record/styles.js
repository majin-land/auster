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
  },
  leftContent: {
    flex: 1,
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
  },
})
