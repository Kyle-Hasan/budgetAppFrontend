// components/BudgetListItem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { budgetItem } from './BudgetListItem';
import { transaction } from '../transactions/transactionItemChild';
import { FlatList } from 'react-native-gesture-handler';


import TransactionItemChild from '../transactions/transactionItemChild'
import { Href, useRouter } from 'expo-router';
import { setStorageValue } from '@/app/storage/storage';


export interface budgetForm {
    name:string,
    amount:string,
    id:string,
    transactions:transaction[]
}

interface budgetFormProps {
    budgetForm:budgetForm
}

const CreateBudgetForm = ({budgetForm}:budgetFormProps) => {

    const router = useRouter()


    const [formData,setFormData] = useState<budgetForm>(budgetForm)


    const navigateToTransactionForm = ()=> {

      const transaction:transaction = {
        name: "",
        id: "",
        date: new Date(),
        amount: "",
        from:budgetForm.id
      }
      setStorageValue("transactionForm",JSON.stringify(transaction))
      router.push('/transactionFormModal' as Href<string>)

    }



    const handleSubmit = () => {}
    

  
  return (
     <View style={styles.container}>
        <Text style={styles.title} >Budget Form</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <Text style={styles.label}>Amount</Text>
        <TextInput
          autoCorrect={false}
          keyboardType="numeric"
          autoCapitalize='none'
          style={styles.input}
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text.replace(/[^0-9]/g, '')})}
        />
    <View style={styles.transactionsHeading}><Text style={styles.label}>Transactions</Text> <TouchableOpacity onPress={navigateToTransactionForm}><Feather name="plus" style={styles.plusIconStyle} /></TouchableOpacity> </View> 
    <FlatList
    keyExtractor={item=> item.id}
    renderItem={({ item }) => (
        <TransactionItemChild transaction={item} />
      )}
    data={budgetForm.transactions}>
    </FlatList>
    <Button title="Submit" onPress={handleSubmit} color="#6200ea" />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      }

      
  });


export default CreateBudgetForm;
