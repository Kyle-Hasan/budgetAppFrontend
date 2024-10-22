import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import BudgetListItem, { budgetItem } from "./budgets/BudgetListItem";
import api from "@/app/api/api";



export default function BudgetSummary() {




  const [budgetItems,setBudgetItems] = useState<any>([])

  
  useEffect(()=> {
    const getData = async ()=> {
      const response = await api.post('')
      setBudgetItems(response.data)
    }

    getData()

}, [])

  return (
    <View style={styles.container}>
 <View style={styles.timeContainer}> <Text style={styles.header}>Budgets</Text> <Feather name="plus" style={styles.plusIconStyle}></Feather></View>
  
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
      <Text style={styles.summaryText}>Monthly Earnings: </Text> 
      <Text style={styles.moneyText}>233$</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.summaryText}>Monthly Spendings: </Text> 
      <Text style={styles.moneyText}>233$</Text>
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

  <FlatList data={budgetItems} renderItem={({item})=> {
    return (<BudgetListItem budgetItem={item} ></BudgetListItem>)
  }}>
    
  </FlatList>
</View>

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
  }
});
