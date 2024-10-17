// components/BudgetListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar'

const BudgetListItem = () => {
  return (
    <View style={styles.boxItem}>
      <View style={styles.boxItemTop}>
        <Text style={styles.padding}>Budget Name</Text>
        <View style={styles.budgetDetails}><Text>100$/200$</Text></View>
      </View>
      <ProgressBar percentage={32} />
      <View style={styles.budgetActions}>
        <TouchableOpacity style={styles.actionButton}><Text>✏️ Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text>🗑️ Delete</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxItem: {
    flexDirection: 'column',
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
  },
  boxItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  padding: {
    padding: 5,
  },
  budgetDetails: {
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 5,
  },
  budgetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#555',
    borderRadius: 5,
  },
});

export default BudgetListItem;
