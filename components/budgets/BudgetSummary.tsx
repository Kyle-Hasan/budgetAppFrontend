import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView, TextInput, Dimensions } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import BudgetListItem, { budgetItem } from "./BudgetListItem";
import api from "@/app/api/api";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import { budgetForm } from "@/components/budgets/CreateBudgetForm";
import SpinnerComponent from "../Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import DateFilter from "../DateFilter";
import PieChartView from "../PieChartView";



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
  const [budgets,setBudgets] = useState<budgetItem[]>([])

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate,setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
  const [endDate,setEndDate] = useState(endOfMonth.toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState('name');
  const [sortOrderAsc, setSortOrderAsc] = useState(true); 
  const getColumnCount = ()=>{
    const spacePerItem = 175
    const screenWidth = Dimensions.get('window').width;
    return Math.floor(screenWidth / spacePerItem);                       
  }
  const [numColumns, setNumColumns] = useState(getColumnCount());

  const sortOptions = [{label:"total amount",option:"totalAmount"},{label:"name",option:"name"}, 
    {label:"amount spent",  option:"amountSpent"}]
  

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
  

  
  useFocusEffect(
    useCallback(()=>{
  
    getData()

    }, [])
    
)

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
    sortedBudgets.sort((a, b) =>sortOrderAsc ? a.currentSpent-b.currentSpent : b.currentSpent - a.currentSpent);
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

  (<View style={{ flex: 1 }}><ScrollView contentContainerStyle={{}} style={styles.container}>
    <View style={styles.timeContainer}>
      <Text style={styles.header}>Budgets</Text>
      <TouchableOpacity onPress={goToBudgetCreate}>
        <Feather name="plus" style={styles.plusIconStyle} />
      </TouchableOpacity>
    </View>
    <View>
      <PieChartView pieChartData={budgets}></PieChartView>
    </View>
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.summaryText}>Total Expenses:  </Text>
        <Text style={styles.moneyText}>${budgetPageInfo.totalSpent}</Text>
      </View>
     
    </View>
    <View style={styles.timeContainer}>
      <DateFilter startDate={startDate} endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} callback={getData}></DateFilter>
    </View>
    <View style={styles.sortContainer}>
    <View style={styles.horizontalList}>
      {sortOptions.map(item=>{
        return (<TouchableOpacity key={item.label} style={styles.sortButton} onPress={() => handleSortChange(item.option)}>
        <Text style={styles.text} >Sort by {item.label}</Text>
        {sortOption === item.option && (
          <Feather
            name={sortOrderAsc ? 'chevron-down': 'chevron-up' }
            size={16}
            color="#ffffff"
          />
        )}
      </TouchableOpacity>)
      })}
    </View>
</View>
    <View style={styles.center}><TextInput
          autoCorrect={false}
          value={searchVal}
          onChangeText={handleSearchChange}
          autoCapitalize='none'
          style={styles.input}
          placeholderTextColor={"white"}
          placeholder="search by name"
         /></View>
    
    
    <View style={styles.listContainer}>
      {budgets.map(item=> {
        return <BudgetListItem refreshSummary={getData} deleteBudget={deleteBudget} key={item.id} budgetItem={item}/>
      })}
    </View>
  
   
  </ScrollView></View>):
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
    
    flex:1,
    paddingTop:50
  },
  timeContainer: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 10,
    zIndex:901,
    alignContent:"center",
    justifyContent:"center"
  },
  row: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:"center",
  },
  summaryText: {
    color: "#ffffff",
    fontSize: 14,
    paddingVertical: 5,
    fontWeight:"bold"

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
    margin:5,
    alignContent:"center",
    justifyContent:"center",

    display:"flex",
    alignSelf:"center",
    flexDirection:"row"
    
   
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
    justifyContent: 'center',
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
    flexDirection:"row",
    marginRight:8
  },
  text: {
    color: '#ffffff',
  },

  horizontalList: {
    display:"flex",
    flexDirection:"row",
    flexWrap:"wrap",
    gap:5
  },
  center: {
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexGrow:0.4,
    
  }, 

  listContainer: {
    alignSelf:"center"
  }

  
 
});