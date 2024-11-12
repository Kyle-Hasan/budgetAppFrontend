import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import SpinnerComponent from "../Spinner";
import TransactionItemChild, { transaction } from "./transactionItemChild";
import { useDebounce } from "@/hooks/useDebounce";
import DateFilter from "../DateFilter";

export default function TransactionSummary() {

  const router = useRouter()
  const formContextObj = useContext(FormContext)
  const [loading,setLoading] = useState(false)

  
  const [transactions,setTransactions] = useState<transaction[]>([])
  const [displayTransactions,setDisplayTransactions] = useState<transaction[]>([])

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate,setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
  const [endDate,setEndDate] = useState(endOfMonth.toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState('date');
  const [sortOrderAsc, setSortOrderAsc] = useState(false);



  const getData = async (startDateNew?:string,endDateNew?:string)=> {
    setLoading(true)
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
     const response = await api.get('/transactions/userTransactions',{
      params: {
        startDate:startDateStr,
        endDate:endDateStr
      }
    })
     const data  = response.data
     setTransactions(data)
     setLoading(false)
     sortTransactions(sortOption,data)
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
  const newForm:transaction  = {name:'',id:-1,date:'',amount:0,account:null,budget:null,type:'EXPENSE'}
  formContextObj?.setTransactionForm(newForm)

  router.push('/transactionFormModal' as Href<string>)

}

const deleteTransaction = async(id:number)=> {
  setLoading(true)
  await api.delete(`/transactions/${id}`)
  getData()
  setLoading(false)
}

const [searchVal,setSearchVal] = useState("")


const filterAccounts = (text:string)=> {
  
  if(text.length == 0) {
    setDisplayTransactions(transactions)
  }
  
  setDisplayTransactions(transactions.filter(x=> x.name.toLowerCase().includes(text.toLowerCase())))
} 

const debouncedFilter = useDebounce(filterAccounts,200)
console.log(debouncedFilter)

const handleSearchChange = (text: string) => {
  setSearchVal(text);
  
  debouncedFilter(text); 
};



const sortTransactions = (option:string, optionalArr?:transaction[]) => {
  let sorted= [...displayTransactions];

  if(optionalArr) {
    sorted = [...optionalArr]
  }

  if (option === 'date') {
    sorted.sort((a,b)=> {

      if(!b.date) {
        return -1;
      }

      else if(!a.date){
        return -1;
      }

      return sortOrderAsc? Date.parse(a.date)-Date.parse(b.date)  : Date.parse(b.date) - Date.parse(a.date)
    });
  } else if (option === 'amount') {
    sorted.sort((a, b) => {

    if(!b.amount) {
      return -1
    }
    else if(!a.amount) {
      return 1
    }
    return  sortOrderAsc ? a.amount-b.amount : b.amount - a.amount
    }
  
  );
  } else if (option === 'budget') {
    sorted.sort((a,b)=> {
      if(!a.budget) {
        return 0
      }
      else if(!b.budget) {
        return -1
      }
      return  sortOrderAsc ? a.budget.name.localeCompare(b.budget.name)   : b.budget.name.localeCompare(a.budget.name)
    })
  }
  else if (option === 'account') {
    sorted.sort((a,b)=> {
      if(!a.account) {
        return 0
      }
      else if(!b.account) {
        return -1
      }
      return sortOrderAsc ? a.account.name.localeCompare(b.account.name)   : b.account.name.localeCompare(a.account.name)
    })
  }
  else if(option === 'name') {
    sorted.sort((a,b)=> {
      return sortOrderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })
  }

  setDisplayTransactions(sorted);
};

const handleSortChange = (option:string) => {
  setSortOrderAsc(!sortOrderAsc)
  setSortOption(option);
  sortTransactions(option);
};

const filterByType = (expense:boolean)=> {
  
  if(expense) {
    const filtered = transactions.filter(x=> x.type === "EXPENSE")
    sortTransactions(sortOption,filtered)
    
  }
  else {
    const filtered = transactions.filter(x=> x.type === "INCOME")
    sortTransactions(sortOption,filtered)

  }
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
    <View style={styles.timeContainer}>
      <DateFilter startDate={startDate} endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} callback={getData}></DateFilter>
    </View>
    <View style={styles.sortContainer}>
    <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('name')}>
    <Text style={styles.text} >Sort by Name</Text>
    {sortOption === 'name' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('date')}>
    <Text style={styles.text} >Sort by Date</Text>
    {sortOption === 'date' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('amount')}>
    <Text style={styles.text} >Sort by Amount</Text>
    {sortOption === 'amount' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('budget')}>
    <Text style={styles.text} >Sort by Budget</Text>
    {sortOption === 'budget' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange('account')}>
    <Text style={styles.text} >Sort by Account</Text>
    {sortOption === 'account' && (
      <Feather
        name={sortOrderAsc ? 'chevron-down' : 'chevron-up'}
        size={16}
        color="#ffffff"
      />
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => filterByType(false)}>
    <Text style={styles.text} >Filter by income</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => filterByType(true)}>
    <Text style={styles.text} >Filter by expense</Text>
  </TouchableOpacity>
</View>

    <TextInput
          autoCorrect={false}
          value={searchVal}
          onChangeText={handleSearchChange}
          autoCapitalize='none'
          style={styles.input}
          placeholder="search by name"
         />
    <FlatList
      data={displayTransactions}
      renderItem={({ item }) => (
        <TransactionItemChild showAccountAndBudget={true} deleteTransaction={deleteTransaction} transaction={item} />
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
    paddingTop:50,
    
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
  },

  text: {
    color: '#ffffff',
  }
 
});
