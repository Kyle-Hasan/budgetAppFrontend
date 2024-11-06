import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import { budgetForm } from "@/app/(app)/(tabs)/CreateBudgetForm";
import AccountListItem from "./AccountListItem";
import { accountForm } from "./AccountForm";



export interface AccountItem {
  id:number,
  name:string,
  currentAccountBalance:number,
  amountDeposited:number
  


}

interface AccountPageInfo {
  accounts: AccountItem[]
}

export default function AccountSummary() {

  const router = useRouter()
  const formContextObj = useContext(FormContext)

  
  const [accountPageInfo,setAccountPageInfo] = useState<AccountPageInfo>({accounts:[]})
  

  
  useEffect(()=> {
    const getData = async ()=> {
    try{
     const response = await api.get('/accounts/userAccounts')
     const data:any  = response.data
     setAccountPageInfo({...accountPageInfo,accounts:data})
    }
    catch(error) {
      console.log("error")
    }
    }

    getData()

}, [])

const goToAccountCreate = ()=> {
  const newForm:accountForm  = {name:'',id:-1,transactions:[],startingBalance:'0'}
  formContextObj?.setAccountForm(newForm)

  router.push('/accountFormModal' as Href<string>)

}

return (
  <View style={styles.container}>
    <View style={styles.timeContainer}>
      <Text style={styles.header}>Accounts</Text>
      <TouchableOpacity onPress={goToAccountCreate}>
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
    
   
    
    <FlatList
      
      data={accountPageInfo.accounts}
      renderItem={({ item }) => (
        <AccountListItem accountItem={item} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  
   
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
    flex:1
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
