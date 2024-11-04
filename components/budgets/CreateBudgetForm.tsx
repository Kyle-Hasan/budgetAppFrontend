// components/BudgetListItem.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { transaction } from '../transactions/transactionItemChild';
import { FlatList, ScrollView } from 'react-native-gesture-handler';


import TransactionItemChild from '../transactions/transactionItemChild'
import { Href, useRouter } from 'expo-router';
import { setStorageValue } from '@/app/storage/storage';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';


export interface budgetForm {
    name:string,
    amount:string,
    id:number,
    transactions:transaction[]
}

interface budgetFormProps {
    budgetForm:budgetForm
}

const CreateBudgetForm = ({budgetForm}:budgetFormProps) => {

    const router = useRouter()
    const formContextObj = useContext(FormContext)


    const [formData,setFormData] = useState<budgetForm>(budgetForm)
    console.log("form data render", formData)


    const navigateToTransactionForm = ()=> {

      const transaction:transaction = {
        name: "",
        id: -1,
        date: new Date(),
        amount: "",
        budget: {name:formData.name,id:formData.id}
      }
      if(formContextObj) {
        formContextObj.setTransactionForm(transaction)
      }
     
      router.push('/transactionFormModal' as Href<string>)

    }
    // get new transactions that shoulded added on this one
    useEffect(()=> {
      console.log(" trigger use effect ")
      if(formContextObj?.transactionForm?.id == -1 && formContextObj?.transactionForm?.name) {
        debugger
        const newTransactions = [...formData.transactions,formContextObj?.transactionForm]
        console.log("new transactions", newTransactions)
        setFormData({...formData,transactions:newTransactions})
        formContextObj.setBudgetForm({...formData,transactions:newTransactions})
      }
      
      formContextObj?.setTransactionForm(null)


    }, [formContextObj?.transactionForm])





    const handleSubmit = async() => {
      try{
      console.log("form data is  ",formData)
        const body = {...formData,amount:+formData.amount}
        let response:any
        debugger
        console.log("form data pre check",formData.id)
        if(formData.id && formData.id !== -1) {
            response = await api.patch("/budgets",body)

        }
        else {
          console.log("body is", body)
          
          response = await api.post("/budgets",body)
          formContextObj?.setTransactionForm(null)
         
        }

        setFormData(response.data)
        console.log(" form data is  " , formData)
        console.log(" response is " , response.data)
        formContextObj?.setBudgetForm(response.data)
        console.log("budget form context", formContextObj)
      }
      catch(e) {
        console.log(e)
      }

    }
    

  
  return (
     <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title} >Budget Form</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}/>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          autoCorrect={false}
          keyboardType="numeric"
          autoCapitalize='none'
          style={styles.input}
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text.replace(/[^0-9]/g, '')})}/>
    <View style={styles.transactionsHeading}><Text style={styles.label}>Transactions</Text><TouchableOpacity onPress={navigateToTransactionForm}><Feather name="plus" style={styles.plusIconStyle} /></TouchableOpacity></View> 
    <View style={{flexGrow:0}}>
    <FlatList
    ListEmptyComponent={()=> <View style={styles.emptyTransactions} />}
    contentContainerStyle={{flexGrow:0}}
    keyExtractor={(item,index)=> index.toString()}
    renderItem={({ item }) => (
        <TransactionItemChild transaction={item} />
      )}
    data={formData.transactions}>
    </FlatList>
    </View>
    <Button title="Submit" onPress={handleSubmit} color="#6200ea" />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      width:'100%',
      
      backgroundColor: '#121212',
      padding: 20,
    },
    formContainer: {
      backgroundColor: '#1e1e1e',
      padding: 20,
      borderRadius: 8,
      width: '100%',
      maxWidth: 400,
      elevation: 5, 
    },
    input: {
      backgroundColor: '#2c2c2c',
      color: '#ffffff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#444',
      padding: 10,
      marginVertical: 10,
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
      color: '#ffffff',
      marginBottom: 20,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 5,
    },
    linkText: {
      marginTop: 20,
      color: '#ffffff',
      textAlign: 'center',
    },
    label: {
      color: '#ffffff',
      marginVertical:5
    },
    plusIconStyle: {
        color: "#ffffff",
        fontSize:20,
        paddingTop:5
      },
      transactionsHeading: {
        flexDirection:'row',
        gap:5
      },

      emptyTransactions: {

        flexGrow:0, 
        marginBottom: 1,
         height:0

      }

      
  });


export default CreateBudgetForm;
