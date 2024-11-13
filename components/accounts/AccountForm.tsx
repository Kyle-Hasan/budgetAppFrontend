
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { Href, useRouter } from 'expo-router';

import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import TransactionItemChild, { transaction } from '@/components/transactions/transactionItemChild';
import { useToastController } from '@tamagui/toast';
import CurrentToast from '../CurrentToast';
import SpinnerComponent from '../Spinner';
import CurrencyInput from 'react-native-currency-input';


export interface accountForm {
    name:string,
    startingBalance:number | null,
    id:number,
    transactions:transaction[]
}

interface accountFormProps {
    accountForm:accountForm
}

const CreateAmountForm = ({accountForm}:accountFormProps) => {


    const toast = useToastController();
    const router = useRouter()
    const formContextObj = useContext(FormContext)
    const [loading,setLoading] = useState(false)


    const [formData,setFormData] = useState<accountForm>(accountForm)
    console.log("form data render", formData)


    const navigateToTransactionForm = ()=> {

      const transaction:transaction = {
        name: "",
        id: -1,
        date: '',
        amount: 0,
        account: {name:formData.name,id:formData.id},
        budget:null
      }
      if(formContextObj) {
        formContextObj.setTransactionForm(transaction)
      }
     
      router.push('/transactionFormModal' as Href<string>)

    }
    // get new transactions that shoulded added on this one
    useEffect(()=> {
      toast.hide()
      console.log(" trigger use effect ")
      if(formContextObj?.transactionForm?.id == -1 && formContextObj?.transactionForm?.name) {
      
        const newTransactions = [...formData.transactions,formContextObj?.transactionForm]
        console.log("new transactions", newTransactions)
        setFormData({...formData,transactions:newTransactions})
        formContextObj.setAccountForm({...formData,transactions:newTransactions})
      }
      
      formContextObj?.setTransactionForm(null)


    }, [formContextObj?.transactionForm])


    const handleSubmit = async() => {
      try{
      setLoading(true)
      console.log("form data is  ",formData)
        const body = {...formData,startingBalance:formData.startingBalance}
        let response:any
        
        console.log("form data pre check",formData.id)
        if(formData.id && formData.id !== -1) {
            response = await api.patch("/accounts",body)

        }
        else {
          console.log("body is", body)
          
          response = await api.post("/accounts",body)
         
         
        }
        formContextObj?.setTransactionForm(null)

        setFormData(response.data)
     
        formContextObj?.setAccountForm(response.data)

        if(formContextObj?.refreshAccountSummary) {
          formContextObj?.refreshAccountSummary()
        }

        toast.show('Successfully saved!', {
          message: "Budget Saved",
          native:false,
          customData: {
            color:'green'
          }
          
        })
        setLoading(false)
      }
      catch(e) {
        toast.show('Failed', {
          message: "Failure",
          native:false,
          customData: {
            color:'red'
          }
        })
        console.log(e)
        setLoading(false)
      }

    }

   
    const deleteTransaction = async(id:number)=> {
      setLoading(true)
      await api.delete(`/transactions/${id}`)
      
      setLoading(false)
    }
  
  return (
     <View style={styles.container}>
      
        <Text style={styles.title} >Account Form</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}/>
        <Text style={styles.label}>Starting Balance</Text>
       
          <CurrencyInput
        value={formData.startingBalance}
        onChangeValue={(value)=> setFormData({...formData,startingBalance:value})}
        prefix="$"
        delimiter=","
        separator="."
        precision={2}
        style={styles.input}
        keyboardType="numeric"
        placeholder="$0.00"
        placeholderTextColor={"text"}
      />
    <View style={styles.transactionsHeading}><Text style={styles.label}>Transactions</Text><TouchableOpacity onPress={navigateToTransactionForm}><Feather name="plus" style={styles.plusIconStyle} /></TouchableOpacity></View> 
    { formData.transactions && formData.transactions.length > 0 &&
    (<View style={{ flexGrow:0.6 ,flex:1, marginBottom:10, borderColor:'red',borderWidth:1,minWidth:200}}>
      
    <FlatList
     ListEmptyComponent={() => <View style={{ height: 0}} />}
    contentContainerStyle={{ }}
    keyExtractor={(item,index)=> index.toString()}
    renderItem={({ item }) => (
        <TransactionItemChild deleteTransaction={deleteTransaction} transaction={item} />
      )}
    data={formData.transactions}>
    </FlatList>
    </View>)}
    <Button title="Submit" onPress={handleSubmit} color="#6200ea" disabled={loading} />
    <SpinnerComponent show={loading}></SpinnerComponent>
   
   <CurrentToast></CurrentToast>
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
      minWidth:200
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


export default CreateAmountForm;
