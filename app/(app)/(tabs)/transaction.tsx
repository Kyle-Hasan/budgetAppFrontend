// pages/BudgetPage.tsx
import BudgetSummary from '@/components/budgets/BudgetSummary';
import TransactionSummary from '@/components/transactions/transactionsSummary';
import React from 'react';
import { View, StyleSheet } from 'react-native';


const transactionPage = () => {
  return (<View style={styles.container}><TransactionSummary></TransactionSummary></View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default transactionPage;
