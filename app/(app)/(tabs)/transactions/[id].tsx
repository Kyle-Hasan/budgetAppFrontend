
import React, { useContext, useEffect, useState } from 'react'



import { View, StyleSheet } from 'react-native';

import { useGlobalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import { transaction } from '@/components/transactions/transactionItemChild';
import TransactionForm from "@/components/transactions/transactionForm"

const transactionPage = () => {
  const glob = useGlobalSearchParams();
  const formContextObj = useContext(FormContext)



  useEffect(()=> {
    const getData = async()=> {
      const id = glob.id
     
      const response = await api.get("/transactions/"+id)
    
      
      formContextObj?.setTransactionForm(response.data)
      
    }
    getData()
  },[])



  return (<View style={styles.container}> { formContextObj?.transactionForm && <TransactionForm></TransactionForm>}</View>);
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
