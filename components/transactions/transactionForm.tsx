
import React, { useEffect, useState } from "react";
import {Platform, View, StyleSheet,Text, Button  } from "react-native";
import { transaction } from "./transactionItemChild";
import { getStorageValue } from "@/app/storage/storage";
import { TextInput } from "react-native-gesture-handler";
import Dropdown from "../Dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import './datePicker.css'


import DatePicker from 'react-datepicker'; // For web
import api from "@/app/api/api";


 const TransactionForm = ()=> {
    const [transaction,setTransaction] = useState<transaction>({name:'',id:1,amount:'',date:new Date(),account:null,budget:null,})
    const [budgets,setBudgets] = useState<any [] | null>(null)
    const [accounts,setAccounts] = useState<any[] | null>(null)
    useEffect(
      ()=> {


        let formString = getStorageValue("transactionForm")
        if(formString) {

        setTransaction(JSON.parse(formString as string) as transaction)
        }

        const getBudgets = async() => {
          try{

          let response = await api.get('/budgets/budgetSelections')
         
          setBudgets(response.data)
          
          
          }
          catch(e) {

          }
        }

        const getAccounts = async() => {
          try{
          let response = await api.get('/accounts/accountSelections')
          setAccounts(response.data)
          }
          catch(e) {

          }

        }

        getBudgets()
        getAccounts()


    }, [])

    const submit = ()=>{}
    
    const budgetChanged = (budget:any)=> {
      console.log(budget)
    }

    const accountChanged = (account:any) => {
      console.log(account)
    }


    return (<View style={styles.container}>
            <Text style={styles.title}>Transaction Form</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={transaction.name}></TextInput>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input}  value={transaction.amount}></TextInput>
            <Text style={styles.label}>Date</Text>
           { Platform.OS === 'web' ?  ( <DatePicker className="custom-datepicker"  value={"2022-01-12"}>

        </DatePicker>) :
        (
            <DateTimePicker  style={styles.input}
                value={new Date()}
        />
        )
        
     }

      {budgets &&  ( <View style={styles.budgetDropdown}><Text style={styles.label}>Budget</Text> <Dropdown changeSelection={budgetChanged} defaultSelection={transaction?.budget} items={budgets} keyName="id" labelName="name" ></Dropdown></View>) }
      {accounts &&  ( <View style={styles.accountDropdown}><Text style={styles.label}>Account</Text> <Dropdown changeSelection={accountChanged} defaultSelection={transaction?.account} items={accounts} keyName="id" labelName="name" ></Dropdown></View>) }

        <Button title="Submit" onPress={submit} color="#6200ea"  ></Button>

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
        marginBottom:10,
        zIndex:5,
      },

      budgetDropdown: {
        marginBottom:10,
        zIndex:200,
      },

      accountDropdown: {
        marginBottom:10,
        zIndex:5,
      }

      
  });

  export default TransactionForm