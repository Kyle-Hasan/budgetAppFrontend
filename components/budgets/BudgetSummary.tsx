import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import BudgetListItem, { budgetItem } from "./BudgetListItem";
import api from "@/app/api/api";
import { Href, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import { budgetForm } from "@/components/budgets/CreateBudgetForm";
import SpinnerComponent from "../Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import DateFilter from "../DateFilter";



interface budgetPageResponse {
  budgetGoals: budgetItem[],
  totalSpent:number,
  totalDeposited:number

}


export default function BudgetSummary() {

  console.log("budget summary")

  const router = useRouter()
  const formContextObj = useContext(FormContext)
  const [loading,setLoading] = useState(false)

  
  const [budgetPageInfo,setBudgetPageInfo] = useState<budgetPageResponse>({budgetGoals:[],totalDeposited:0,totalSpent:0})
  const [budgets,setBudgets] = useState<budgetItem[]>([])

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate,setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
  const [endDate,setEndDate] = useState(endOfMonth.toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState('name');
  const [sortOrderAsc, setSortOrderAsc] = useState(true); 
  

  const getData = async (startDateNew?:string,endDateNew?:string)=> {
    setLoading(true)
    try{
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
     const response = await api.get('/users/budgetScreen',{
      params: {
        startDate:startDateStr,
        endDate:endDateStr
      }
     })
     const data:budgetPageResponse  = response.data
     setBudgetPageInfo(data)
     sortBudgets(sortOption,data.budgetGoals)
     setLoading(false)
    }
    catch(error) {
      console.log("error")
      setLoading(false)
    }
    }
  

  
  useEffect(()=> {
    
    console.log("trigger useffect")

    formContextObj?.setRefreshBudgetSummary(() => getData);

    getData()

}, [])

const goToBudgetCreate = ()=> {
  const newForm:budgetForm  = {name:'',id:-1,transactions:[],amount:0}
  formContextObj?.setBudgetForm(newForm)

  router.push('/budgetFormModal' as Href<string>)

}

const [searchVal,setSearchVal] = useState("")

const deleteBudget = async(id:number)=> {
  setLoading(true)
  await api.delete(`/budgets/${id}`)
  getData()
  setLoading(false)
}

const filterBudgets = (text:string)=> {
  
  if(text.length == 0) {
    setBudgets(budgetPageInfo.budgetGoals)
  }
  
  setBudgets(budgetPageInfo.budgetGoals.filter(x=> x.name.toLowerCase().includes(text.toLowerCase())))
} 

const debouncedFilter = useDebounce(filterBudgets,200)
console.log(debouncedFilter)

const handleSearchChange = (text: string) => {
  setSearchVal(text);
  
  debouncedFilter(text); 
};



const sortBudgets = (option:string, optionalArr?:budgetItem[]) => {
  let sortedBudgets = [...budgets];

  if(optionalArr) {
    sortedBudgets = [...optionalArr]
  }

  if (option === 'date') {
    sortedBudgets.sort();
  } else if (option === 'totalAmount') {
    sortedBudgets.sort((a, b) =>sortOrderAsc ? a.total-b.total : b.total - a.total);
  } else if (option === 'amountSpent') {
    sortedBudgets.sort((a, b) =>sortOrderAsc ? a.total-b.total : b.currentSpent - a.currentSpent);
  }
  else if(option === 'name') {
    sortedBudgets.sort((a,b)=> {
     return sortOrderAsc ?  a.name.localeCompare(b.name) :  b.name.localeCompare(a.name)
    })
  }

  setBudgets(sortedBudgets);
};

const handleSortChange = (option:string) => {
  setSortOrderAsc(!sortOrderAsc);
  setSortOption(option);
  sortBudgets(option);
  
};


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
      <DateFilter startDate={startDate} endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} callback={getData}></DateFilter>
    </View>
    <View style={styles.sortContainer}>
    <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('name')}>
    <Text style={styles.text} >Sort by name</Text>
    {sortOption === 'name' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('totalAmount')}>
    <Text style={styles.text} >Sort by total amount</Text>
    {sortOption === 'totalAmount' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('amountSpent')}>
    <Text style={styles.text} >Sort by amount spent</Text>
    {sortOption === 'amountSpent' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
</View>
    <View><TextInput
          autoCorrect={false}
          value={searchVal}
          onChangeText={handleSearchChange}
          autoCapitalize='none'
          style={styles.input}
          placeholder="search by name"
         /></View>
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
      
      data={budgets}
      renderItem={({ item }) => (
        <BudgetListItem budgetItem={item} refreshSummary={getData} deleteBudget={deleteBudget} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  
   
  </View>):
  (<View style={styles.spinnerStyle}><SpinnerComponent show={loading}/></View>)
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
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    marginVertical: 10,
    minWidth:200,
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
  spinnerStyle:{
    marginTop:100
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
    display:"flex",
    flexDirection:"row"
  },
  text: {
    color: '#ffffff',
  }

  
 
});
