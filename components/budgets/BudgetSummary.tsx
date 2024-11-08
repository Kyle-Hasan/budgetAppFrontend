import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import BudgetListItem, { budgetItem } from "./BudgetListItem";
import api from "@/app/api/api";
import { Href, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import { budgetForm } from "@/components/budgets/CreateBudgetForm";
import SpinnerComponent from "../Spinner";



interface budgetPageResponse {
  budgetGoals: budgetItem[],
  totalSpent:number,
  totalDeposited:number

}


export default function BudgetSummary() {

  const router = useRouter()
  const formContextObj = useContext(FormContext)
  const [loading,setLoading] = useState(false)

  
  const [budgetPageInfo,setBudgetPageInfo] = useState<budgetPageResponse>({budgetGoals:[],totalDeposited:0,totalSpent:0})

  const getData = async ()=> {
    setLoading(true)
    try{
      console.log("refresh full")
     const response = await api.get('/users/budgetScreen')
     const data:budgetPageResponse  = response.data
     setBudgetPageInfo(data)
     setLoading(false)
    }
    catch(error) {
      console.log("error")
      setLoading(false)
    }
    }
  

  
  useEffect(()=> {
    debugger

    formContextObj?.setRefreshBudgetSummary(() => getData);

    getData()

}, [])

const goToBudgetCreate = ()=> {
  const newForm:budgetForm  = {name:'',id:-1,transactions:[],amount:'0'}
  formContextObj?.setBudgetForm(newForm)

  router.push('/budgetFormModal' as Href<string>)

}

const deleteBudget = async(id:number)=> {
  setLoading(true)
  await api.delete(`/budgets/${id}`)
  getData()
  setLoading(false)
}

return (
  !loading ?
  (<View style={styles.container}>
    <View style={styles.timeContainer}>
      <Text style={styles.header}>Budgets</Text>
      <TouchableOpacity onPress={goToBudgetCreate}>
        <Feather name="plus" style={styles.plusIconStyle} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.timeContainer}>
      <TouchableOpacity>
        <Feather name="arrow-left" style={styles.timeIcon} />
      </TouchableOpacity>
      <Text style={styles.header}>November 2024</Text>
      <TouchableOpacity>
        <Feather name="arrow-right" style={styles.timeIcon} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Monthly Earnings:  </Text>
        <Text style={styles.moneyText}>{budgetPageInfo.totalSpent}$</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Monthly Spendings:  </Text>
        <Text style={styles.moneyText}>{budgetPageInfo.totalSpent}$</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Total: </Text>
        <Text style={styles.moneyText}>233$</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Left to Spend: </Text>
        <Text style={styles.moneyText}>233$</Text>
      </View>
    </View>
    
    <FlatList
      
      data={budgetPageInfo.budgetGoals}
      renderItem={({ item }) => (
        <BudgetListItem budgetItem={item} refreshSummary={getData} deleteBudget={deleteBudget} />
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
