import { View, Text, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import SpinnerComponent from "../Spinner";
import TransactionItemChild, { transaction } from "./transactionItemChild";

export default function TransactionSummary() {

  const router = useRouter()
  const formContextObj = useContext(FormContext)
  const [loading,setLoading] = useState(false)

  
  const [transactions,setTransactions] = useState<transaction[]>([])


  const getData = async ()=> {
    setLoading(true)
    try{
     const response = await api.get('/transactions/userTransactions')
     const data  = response.data
     setTransactions(data)
     setLoading(false)
    }
    catch(error) {
      console.log("error")
      setLoading(false)
    }
    }
  

  
  useEffect(()=> {
    formContextObj?.setRefreshTransactionSummary(() => getData);
    

    getData()

}, [])

const goToTransactionCreate = ()=> {
  const newForm:transaction  = {name:'',id:-1,date:new Date(),amount:'',account:null,budget:null,type:'EXPENSE'}
  formContextObj?.setTransactionForm(newForm)

  router.push('/transactionFormModal' as Href<string>)

}

const deleteTransaction = async(id:number)=> {
  setLoading(true)
  await api.delete(`/transactions/${id}`)
  getData()
  setLoading(false)
}

return (
  !loading ?
  (<View style={styles.container}>
    <View style={styles.timeContainer}>
      <Text style={styles.header}>Transactions</Text>
      <TouchableOpacity onPress={goToTransactionCreate}>
        <Feather name="plus" style={styles.plusIconStyle} />
      </TouchableOpacity>
    </View>
    <FlatList
      data={transactions}
      renderItem={({ item }) => (
        <TransactionItemChild deleteTransaction={deleteTransaction} transaction={item} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>):
  (<SpinnerComponent show={loading}/>)
);
}

const styles = StyleSheet.create({
  header: {
    color: "#ffffff",
    fontSize: 25,
  },
  timeIcon: {
    color: "#ffffff",
    fontSize: 25,
    paddingVertical: 5,
  },

  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex:1,
    paddingTop:50
  },
  timeContainer: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 10,
  },
  row: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  summaryText: {
    color: "#ffffff",
    fontSize: 14,
    paddingVertical: 5,

  },
  moneyText: {
    color: "#ffffff",
    fontSize: 14,
    paddingVertical: 5,
    fontWeight:'bold'
    
  },
  box: {
    backgroundColor: '#272727',
    borderRadius:5,
    padding:10,
    margin:5
  },
  plusIconStyle: {
    color: "#ffffff",
    fontSize:20,
    paddingTop:5
  },
  list: {
    alignItems:'center',
    width:'100%'
  }
 
});
