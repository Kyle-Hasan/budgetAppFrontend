// pages/BudgetPage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';
import BudgetListItem from '../components/BudgetListItem'

const budgetPage = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.timeContainer}>
        <Text style={styles.heading}>Budgets</Text>
        <TouchableOpacity><Text style={styles.buttonText}> + </Text></TouchableOpacity>
      </View>
      <View style={styles.timeContainer}>
        <TouchableOpacity><Text style={styles.buttonText}> &lt; </Text></TouchableOpacity>
        <Text style={styles.heading}>November 2024</Text>
        <TouchableOpacity><Text style={styles.buttonText}> &gt; </Text></TouchableOpacity>
      </View>
      <View style={styles.details}>
        <View><Text>Monthly Earnings:</Text><Text>150$</Text></View>
        <View><Text>Monthly Spendings:</Text><Text>179$</Text></View>
        <View><Text>Total:</Text><Text>-29$</Text></View>
        <View><Text>Left to spend:</Text><Text>2024$</Text></View>
      </View>
      <View>
        <BudgetListItem />
        <BudgetListItem />
      </View>
    </View>
  );
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
