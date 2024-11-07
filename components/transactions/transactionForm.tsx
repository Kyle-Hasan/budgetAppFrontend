
import React, { useEffect, useState } from "react";
import {Platform, View, StyleSheet,Text, Button, TextInput   } from "react-native";
import { transaction } from "./transactionItemChild";


import Dropdown from "../Dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import './datePicker.css'

import { useContext } from "react";
import DatePicker from 'react-datepicker'; // For web
import api from "@/app/api/api";
import { FormContext } from "@/app/context/FormContex";
import { useRouter } from "expo-router";
import { useToastController } from "@tamagui/toast";
import CurrentToast from "../CurrentToast";
import SpinnerComponent from "../Spinner";


 const TransactionForm = ()=> {
  const toast = useToastController();
  const [loading,setLoading] = useState(false)
  const types = [{
     
    label:'Income'
  },
  {
   
    label:'Expense'
  }

]

    const router = useRouter()
    const formContextObj = useContext(FormContext)
    const [transaction,setTransaction] = useState<transaction>({name:'',id:1,amount:'',date:new Date(),account:null,budget:null,type:"Expense"})
    const [budgets,setBudgets] = useState<any [] | null>(null)
    const [accounts,setAccounts] = useState<any[] | null>(null)
   
  const [defaultType,setDefaultType] = useState<{label:string} | null | undefined>(null)
    useEffect(
      ()=> {
        let transactionData = formContextObj?.transactionForm
        if(transactionData) {
       
        setTransaction(transactionData)
       
        const type = types.find(x=> x.label === transactionData.type)
        if(type) {
          setDefaultType(type)
        }
        else {
          setDefaultType(types[0])
        }
        
        }

        else {
          
          setDefaultType(types[0])
        }

        const getBudgets = async() => {
          try{

          let response = await api.get('/budgets/budgetSelections')
         
          setBudgets(response.data)
          // adding budget being created right now
          if(formContextObj?.budgetForm?.id === -1) {
            setBudgets([...budgets as any[],{name:formContextObj.budgetForm.name,id:formContextObj.budgetForm.id}])
          }
          
          }
          catch(e) {

          }
        }

        const getAccounts = async() => {
          try{
          let response = await api.get('/accounts/accountSelections')
          setAccounts(response.data)

          if(formContextObj?.accountForm?.id === -1) {
            setAccounts([...accounts as any[],{name:formContextObj.accountForm.name,id:formContextObj.accountForm.id}])
          }
          }
          catch(e) {

          }

        }

        getBudgets()
        getAccounts()


    }, [])

    const submit = async()=>{
      try {
        setLoading(true)
        // dont make api request for budget still being made
        console.log(formContextObj)
        const getType = transaction.type ? transaction.type: defaultType?.label.toUpperCase()
        if(formContextObj?.budgetForm?.id !== -1 && formContextObj?.accountForm?.id !== -1) {
        console.log(transaction)
        
        const body = {...transaction, amount: +transaction.amount, type: getType}
        let response:any;
        if(transaction.id && transaction.id !== -1) {
          response = await api.patch('/transactions',body)
        }
        else {
        response = await api.post('/transactions',body)
       
        }

        setTransaction(response.data)
        formContextObj?.setTransactionForm(transaction)
        console.log("updated")
        toast.show('Successfully saved!', {
          message: "Transaction Saved",
          native:false,
          customData: {
            color:'green'
          }
          
        })
        setLoading(false)
      }

      else {
        formContextObj?.setTransactionForm({...transaction,type:getType})
        setLoading(false)
        router.back()
      }


      }

      catch(e) {
        toast.show('Failed', {
          message: "Failure",
          native:false,
          customData: {
            color:'red'
          }
        })
        setLoading(false)
      }

    }


    const setFormData = (fieldName:string,value:any) => {
      setTransaction(prev => ({...prev,[fieldName]:value}))
    }
    
    const budgetChanged = (budget:any) => {
      setTransaction(prev => ({ ...prev, budget }));
  };

    const accountChanged = (account:any) => {
      setTransaction(prev => ({...prev,account}))
    }

    const typeChanged = (type:{label:string})=> {
      setTransaction(prev => ({...prev,type:type.label.toUpperCase()}))
    }


    return (<View style={styles.container}>
            <Text style={styles.title}>Transaction Form</Text>
            <Text style={styles.label} >Name</Text>
            <TextInput style={styles.input} value={transaction.name} onChangeText={(text) => setFormData('name',text)}></TextInput>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input}  value={transaction.amount} onChangeText={(text) => setFormData('amount',text.replace(/[^0-9]/g, ''))}></TextInput>
            <Text style={styles.label}>Date</Text>
           
      {budgets && (<View style={styles.budgetDropdown}><Text style={styles.label}>Budget</Text><Dropdown changeSelection={budgetChanged} defaultSelection={transaction?.budget} items={budgets} keyName="id" labelName="name" ></Dropdown></View>) }
      {accounts && (<View style={styles.accountDropdown}><Text style={styles.label}>Account</Text><Dropdown changeSelection={accountChanged} defaultSelection={transaction?.account} items={accounts} keyName="id" labelName="name" ></Dropdown></View>) }
      {defaultType && (<View style={styles.typeDropdown}><Text style={styles.label}>Transaction Type</Text><Dropdown changeSelection={typeChanged} defaultSelection={types[0]} items={types} keyName="label" labelName="label" ></Dropdown></View>)}
      <Button title="Submit" onPress={submit} color="#6200ea" disabled={loading}></Button>
      <SpinnerComponent show={loading}></SpinnerComponent>
      <CurrentToast></CurrentToast>
    </View>)

}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:'100%',
      alignItems: 'center',
      
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
      marginVertical:5,
      textAlign:'center'
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

      dropdown: {
        marginBottom:0,
        zIndex:5,
      },

      budgetDropdown: {
        marginBottom:10,
        zIndex:201,
        
        flexShrink:1
      },

      accountDropdown: {
        marginBottom:10,
        zIndex:200,
        
        flexShrink:1
      },
      typeDropdown: {
        marginBottom:10,
        zIndex:199,
       
        flexShrink:1
      }


      
  });

  export default TransactionForm
