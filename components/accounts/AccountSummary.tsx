import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView, TextInput,Dimensions } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import { budgetForm } from "@/components/budgets/CreateBudgetForm";
import AccountListItem from "./AccountListItem";
import { accountForm } from "./AccountForm";
import SpinnerComponent from "../Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import DateFilter from "../DateFilter";



export interface AccountItem {
  id:number,
  name:string,
  currentAccountBalance:number,
  amountDeposited:number
  


}

interface AccountPageInfo {
  accounts: AccountItem[],
  totalDeposited:number,
  totalBalance:number
}

export default function AccountSummary() {

  const router = useRouter()
  const formContextObj = useContext(FormContext)
  const [loading,setLoading] = useState(false)

  
  const [accountPageInfo,setAccountPageInfo] = useState<AccountPageInfo>({accounts:[],totalDeposited:0,totalBalance:0})
  const [accounts,setAccounts] = useState<AccountItem[]>([])

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate,setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
  const [endDate,setEndDate] = useState(endOfMonth.toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState('name');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);
  const sortOptions = [{label:"current account balance",option:"currentAccountBalance"},{label:"name",option:"name"}, 
    {label:"amount deposited",  option:"amountDeposited"}]
  
  const getColumnCount = ()=>{
    const screenWidth = Dimensions.get('window').width;
    const spaceForItem = 175
    return Math.floor(screenWidth / spaceForItem);                       
  }
  const [numColumns, setNumColumns] = useState(getColumnCount());
  const getData = async (startDateNew?:string,endDateNew?:string)=> {

    console.log("refresh full")
   
      let startDateObj = new Date(startDate); 
      if(startDateNew) {
        startDateObj = new Date(startDateNew)
      }
      
      let endDateObj = new Date(endDate); 
      if(endDateNew) {
        endDateObj = new Date(endDateNew); 
      }
      
      const startDateStr =  startDateObj.toISOString().split('T')[0]; 
      
      const endDateStr =  endDateObj.toISOString().split('T')[0]; 
    try{
     setLoading(true)
     const response = await api.get('/accounts/userAccounts',{
      params: {
        startDate:startDateStr,
        endDate:endDateStr
      }
     })
     const data:AccountPageInfo  = response.data
     setAccountPageInfo(data)
     
     setLoading(false)
     sortAccounts(sortOption,data.accounts)
    }
    catch(error) {
      console.error(error)
      setLoading(false)
    }
    }
  
  useFocusEffect(

    useCallback(()=>{
      formContextObj?.setRefreshAccountSummary(() => getData);

      getData()
    },[])
  
)


const deleteAccount = async(id:number)=> {
 
  setLoading(true)
  await api.delete(`/accounts/${id}`)
  getData()
  setLoading(false)
}

const [searchVal,setSearchVal] = useState("")


const filterAccounts = (text:string)=> {
  
  if(text.length == 0) {
    setAccounts(accountPageInfo.accounts)
  }
  
  setAccounts(accountPageInfo.accounts.filter(x=> x.name.toLowerCase().includes(text.toLowerCase())))
} 

const debouncedFilter = useDebounce(filterAccounts,200)
console.log(debouncedFilter)

const handleSearchChange = (text: string) => {
  setSortOrderAsc(!sortOrderAsc)
  setSearchVal(text);
  
  debouncedFilter(text); 
};



const goToAccountCreate = ()=> {
  const newForm:accountForm  = {name:'',id:-1,transactions:[],startingBalance:0}
  formContextObj?.setAccountForm(newForm)

  router.push('/accountFormModal' as Href<string>)

}




const sortAccounts = (option:string, optionalArr?:AccountItem[]) => {
  let sortedAccounts = [...accounts];

  if(optionalArr) {
    sortedAccounts = [...optionalArr]
  }

  if (option === 'date') {
    sortedAccounts.sort();
  } else if (option === 'currentAccountBalance') {
    sortedAccounts.sort((a, b) =>sortOrderAsc ? a.currentAccountBalance-b.currentAccountBalance : b.currentAccountBalance - a.currentAccountBalance);
  } else if (option === 'amountDeposited') {
    sortedAccounts.sort((a, b) => sortOrderAsc ? a.amountDeposited-b.amountDeposited : b.amountDeposited - a.amountDeposited);
  }
  else if(option === 'name') {
    sortedAccounts.sort((a,b)=> {
     return sortOrderAsc ?  a.name.localeCompare(b.name) :  b.name.localeCompare(a.name)
    })
  }

  setAccounts(sortedAccounts);
};

const handleSortChange = (option:string) => {
  setSortOrderAsc(!sortOrderAsc)
  setSortOption(option);
  sortAccounts(option);
};



return (
  !loading ?
  (<View style={styles.container}>
    <View style={styles.timeContainer}>
      <Text style={styles.header}>Accounts</Text>
      <TouchableOpacity onPress={goToAccountCreate}>
        <Feather name="plus" style={styles.plusIconStyle} />
      </TouchableOpacity>
    </View>
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Total Deposits:  </Text>
        <Text style={styles.moneyText}>${accountPageInfo.totalDeposited}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Total Balance:  </Text>
        <Text style={styles.moneyText}>${accountPageInfo.totalBalance}</Text>
      </View>
     
    </View>
    <View style={styles.timeContainer}>
    <DateFilter startDate={startDate} endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} callback={getData}></DateFilter>
    </View>
    <View style={styles.sortContainer}>
    <FlatList contentContainerStyle={{ gap: 16 }} numColumns={numColumns}  data={sortOptions} keyExtractor={(item)=> item.option} renderItem={
      ({item})=> {
      return (<TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange(item.option)}>
    <Text style={styles.text} >Sort by {item.label}</Text>
    {sortOption === item.option && (
      <Feather
        name={sortOrderAsc ? 'chevron-down': 'chevron-up' }
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>)
      }
    }></FlatList>
    </View>
    <TextInput
          autoCorrect={false}
          value={searchVal}
          onChangeText={handleSearchChange}
          autoCapitalize='none'
          style={styles.input}
          placeholderTextColor={"white"}
          placeholder="search by name"
         />
    
   
    
    <FlatList
      
      data={accounts}
      renderItem={({ item }) => (
        <AccountListItem deleteAccount={deleteAccount} accountItem={item} />
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
    zIndex:901
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

  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap:10,
    flexWrap:'wrap',
    

  },
  sortButton: {
    color: '#ffffff',
    fontSize: 14,
    padding: 5,
    backgroundColor: '#444',
    borderRadius: 5,
    textAlign: 'center',
    marginRight:8
  },
  text: {
    color: '#ffffff',
  }
 
});
