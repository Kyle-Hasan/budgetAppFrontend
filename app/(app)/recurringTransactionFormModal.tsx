

import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormContext } from '../context/FormContex';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import RecurringTransactionForm, { RecurringTransaction } from '@/components/recurringTransactions/RecurringTransactionForm';


export default function recurringTransactionFormModal() {
  const isPresented = router.canGoBack()
  const [recurringTransactionForm,setRecurringTransactionForm] = useState<RecurringTransaction>({ name: "", id: -1, amount: 0, frequency: "Monthly", transactionType: "Expense", account: null, budget: null })
  const formContextObj = useContext(FormContext)
  useEffect(()=> {
    formContextObj?.setRecurringTransactionForm(recurringTransactionForm)
  },[])
  
  return (
    <View style={styles.container}>
      {isPresented && <Link href="../" style={styles.backContainer}><Feather style={styles.backIcon} name="arrow-left"></Feather><Text style={styles.textStyle}>Go Back</Text></Link>}
      <RecurringTransactionForm recurringTransactionProp={recurringTransactionForm} ></RecurringTransactionForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  backContainer: {
    backgroundColor: '#121212',
    marginTop:50,
    marginLeft:10
   
  },
  textStyle: {
    color: "#ffffff",
  },
  backIcon: {
   
    color: "#ffffff",
    fontSize: 25,
    paddingVertical: 5,
  },
});
