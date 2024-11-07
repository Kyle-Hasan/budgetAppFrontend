// pages/BudgetPage.tsx
import BudgetSummary from '@/components/budgets/BudgetSummary';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const budgetPage = () => {
  return (<View style={styles.container}><BudgetSummary></BudgetSummary></View>);
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

export default budgetPage;
