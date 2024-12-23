// components/BudgetListItem.tsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { Href, useFocusEffect, useRouter } from 'expo-router';

import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import TransactionItemChild, { transaction } from '@/components/transactions/transactionItemChild';
import { useToastController} from '@tamagui/toast';

import CurrentToast from '@/components/CurrentToast';
import SpinnerComponent from '../Spinner';
import CurrencyInput from 'react-native-currency-input';
import { set } from 'react-datepicker/dist/date_utils';
import IconPicker from '../IconPicker';


export interface budgetForm {
    name:string,
    amount:number | null,
    id:number,
    transactions:transaction[],
    icon:string | null
}

interface budgetFormProps {

    refreshSummary?: Function
}



const CreateBudgetForm = ({refreshSummary}:budgetFormProps) => {


    
    const toast = useToastController();
    
    const [loading,setLoading] = useState(false)

    const router = useRouter()
    const formContextObj = useContext(FormContext)


    const [formData,setFormData] = useState<budgetForm>({name:"",amount:0,id:-1,transactions:[],icon:""})
  //  console.log("form data render", formData)

    if (!formData) {
      console.log(formData)
      console.log("nothing")
    return null;
    }


    const navigateToTransactionForm = ()=> {

      const transaction:transaction = {
        name: "",
        id: -1,
        
        amount: 0,
        date:new Date().toISOString().split('T')[0],
        budget: {name:formData.name,id:formData.id}
      }
      if(formContextObj) {
        formContextObj.setTransactionForm(transaction)
      }
     
      router.push('/transactionFormModal' as Href<string>)

    }
    // get new transactions that shoulded added on this one
    useFocusEffect(useCallback(()=> {
      toast.hide()
      console.log(" trigger use effect ")
      
      if(formContextObj?.transactionForm?.id == -1 && formContextObj?.transactionForm?.name) {
      
        const newTransactions = [...formData.transactions,formContextObj?.transactionForm]
        console.log("new transactions", newTransactions)
        setFormData({...formData,transactions:newTransactions})
        formContextObj.setBudgetForm({...formData,transactions:newTransactions})
      }
      
      formContextObj?.setTransactionForm(null)


    }, [formContextObj?.transactionForm]))

    useFocusEffect(useCallback(()=> {
      if(formContextObj?.budgetForm) {
      setFormData({...formContextObj?.budgetForm})
      }

      return ()=> {
        formContextObj?.setBudgetForm(null)
        
      
      }


    }, [formContextObj?.budgetForm]))





    const handleSubmit = async() => {
      try{
      setLoading(true)
      console.log("form data is  ",formData)
        const body = {...formData,amount:formData.amount}
        let response:any
        
        console.log("form data pre check",formData.id)
        if(formData.id && formData.id !== -1) {
            response = await api.put("/budgets",body)

        }
        else {
          console.log("body is", body)
          
          response = await api.post("/budgets",body)
          
         
        }

        formContextObj?.setTransactionForm(null)

        setFormData(response.data)
        console.log(" form data is  " , formData)
        console.log(" response is " , response.data)
        formContextObj?.setBudgetForm(response.data)
        
        console.log("budget form context", formContextObj)
        toast.hide()
        toast.show('Successfully saved!', {
          message: "Budget Saved",
          native:false,
          customData: {
            color:'green'
          }
          
        })
        setLoading(false)
        if(refreshSummary) {
          refreshSummary()
        }
      }
      catch(e) {
        toast.hide()
        toast.show('Failed', {
          message: "Failed to save",
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

    const changeIcon = (icon:string)=> {
      
      setFormData({...formData,icon})
      console.log("icon changed to " + icon)
    }
    
    

  
  return (
     <View style={styles.container}>
        <Text style={styles.title} >Budget Form</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}/>
        <Text style={styles.label}>Monthly Limit</Text>
        <CurrencyInput
        value={formData.amount}
        onChangeValue={(value)=> setFormData({...formData,amount:value})}
        prefix="$"
        delimiter=","
        separator="."
        precision={2}
        style={styles.input}
        keyboardType="numeric"
        placeholder="$0.00"
        placeholderTextColor={"white"}
      />
    <View style={styles.iconPickerContainer} ><IconPicker onSelect={changeIcon} selectedIcon={formData.icon ? formData.icon : null}></IconPicker></View>
    <View style={styles.transactionsHeading}><Text style={styles.label}>Transactions</Text><TouchableOpacity onPress={navigateToTransactionForm}><Feather name="plus" style={styles.plusIconStyle} /></TouchableOpacity></View> 
    { formData.transactions && formData.transactions.length > 0 &&
    (<View style={{ flexGrow:1 ,flex:1, marginBottom:10,minWidth:200}}>
    <FlatList
    
    persistentScrollbar={true}
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
    <CurrentToast />
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

      },

    iconPickerContainer: {
      height:120
    }

      
  });


export default CreateBudgetForm;
