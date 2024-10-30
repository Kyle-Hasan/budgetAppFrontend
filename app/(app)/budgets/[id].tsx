import CreateBudgetForm, { budgetForm } from '@/components/budgets/CreateBudgetForm';
import React, { useState } from 'react'



import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const budgetPage = () => {

   const [budgetForm,setBudgetForm] = useState<budgetForm>({name:'',amount:'12.2',id:'1',transactions: [{id:'1',name:'f',amount:'12.2',date:new Date()},{id:'2', name:'err',amount:'13.2',date:new Date()}]})
  return (<View style={styles.container}><CreateBudgetForm budgetForm={budgetForm}></CreateBudgetForm></View>);
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
