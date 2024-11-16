
import React, { useCallback, useContext, useEffect, useState } from 'react'



import { View, StyleSheet } from 'react-native';

import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import RecurringTransactionForm, { RecurringTransaction } from '@/components/recurringTransactions/RecurringTransactionForm';


const recurringTransactionPage = () => {
  const glob = useGlobalSearchParams();
  
  const formContextObj = useContext(FormContext)
  const [recurringTransaction,setRecurringTransaction] = useState<RecurringTransaction | null>(null)



  useFocusEffect(
    useCallback(()=> {
      const getData = async()=> {
        const id = glob.id

      if(!id) return
      const response = await api.get("/recurring/"+id)
      console.log("trigger use effect paretn",response.data)
      setRecurringTransaction({ ...response.data });
        
      }
      getData()
}, [glob.id]))



  return (<View style={styles.container}>{ recurringTransaction && <RecurringTransactionForm recurringTransactionProp={recurringTransaction as RecurringTransaction}></RecurringTransactionForm>}</View>);
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

export default recurringTransactionPage;
