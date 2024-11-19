
import React, { useCallback, useContext, useEffect, useState } from 'react'



import { View, StyleSheet } from 'react-native';

import { useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import { transaction } from '@/components/transactions/transactionItemChild';
import TransactionForm from "@/components/transactions/transactionForm"

const transactionPage = () => {
  
  const formContextObj = useContext(FormContext)
  const glob = useGlobalSearchParams();
  const [id,setId] = useState()
  console.log(glob)
  useFocusEffect(
    useCallback(()=> {
      const getData = async()=> {
        
        
        const id = glob.id
        console.log(glob)
        if(!id) return
       
        const response = await api.get("/transactions/"+id)
        console.log(response.data)
        
        formContextObj?.setTransactionForm(response.data)

        return ()=> {
            formContextObj?.setTransactionForm(null)
        }        
      }
      getData()
}, [glob.id]))

  



  return (<View style={styles.container}>{ formContextObj?.transactionForm && <TransactionForm></TransactionForm>}</View>);
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
