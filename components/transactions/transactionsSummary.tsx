import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import SpinnerComponent from "../Spinner";
import TransactionItemChild, { transaction } from "./transactionItemChild";
import { useDebounce } from "@/hooks/useDebounce";
import DateFilter from "../DateFilter";
import { DateNumberType } from "react-datepicker/dist/date_utils";

interface TransactionPageResponse {
  transactions: transaction[];
  totalDeposited: number;
  totalSpent: number;
}

export default function TransactionSummary() {
  const router = useRouter();
  const formContextObj = useContext(FormContext);

  // State variables
  const [loading, setLoading] = useState(false);
  const [transactionPageResponse, setTransactionPageResponse] =
    useState<TransactionPageResponse>({
      transactions: [],
      totalDeposited: 0,
      totalSpent: 0,
    });
  const [displayTransactions, setDisplayTransactions] = useState<transaction[]>(
    []
  );
  const [sortOption, setSortOption] = useState("date");
  const [sortOrderAsc, setSortOrderAsc] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const SIZE = 5; // Number of items per page

  // Pagination-related state
  const [listBottomLoading, setListBottomLoading] = useState(false);

  // Date range filter
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState(startOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(endOfMonth.toISOString().split("T")[0]);
  const [filter,setFilter] = useState("")

  // Sorting options
  const sortOptions = [
    { label: "date", option: "date" },
    { label: "name", option: "name" },
    { label: "amount", option: "amount" },
  ];

  const getColumnCount = ()=>{
    const screenWidth = Dimensions.get('window').width;
    const spaceForItem = 175
    
    return Math.ceil(screenWidth / spaceForItem);                       
  }
  const [numColumns, setNumColumns] = useState(getColumnCount());

  // Search state
  const [searchVal, setSearchVal] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const getData = async (
    pageNumber: number,
    firstLoad: boolean,
    startDateNew?: string,
    endDateNew?: string,
    onlyListLoading?: boolean,
    sortOptionArg?: string,
    sortOrderAscArg?: boolean,
    filterArg?:string | null
  ) => {
    if (firstLoad) setLoading(true);
    else if (onlyListLoading) setListBottomLoading(true);

    try {
      let startDateObj = startDateNew ? new Date(startDateNew) : new Date(startDate);
      let endDateObj = endDateNew ? new Date(endDateNew) : new Date(endDate);

      const response = await api.get("/transactions/userTransactions", {
        params: {
          startDate: startDateObj.toISOString().split("T")[0],
          endDate: endDateObj.toISOString().split("T")[0],
          sort: sortOptionArg || sortOption,
          order: sortOrderAscArg !== undefined ? (sortOrderAscArg ? "ASC" : "DESC") : sortOrderAsc ? "ASC" : "DESC",
          pageNumber: pageNumber || 0,
          size: SIZE,
          filter:filterArg !==undefined ? filterArg : filter
        },
      });

      const data: TransactionPageResponse = response.data;
      setTransactionPageResponse(data);

      const newTransactions = firstLoad || onlyListLoading ? data.transactions : [...displayTransactions, ...data.transactions];
      setDisplayTransactions(newTransactions);

      if (firstLoad) setPageNumber(1);
      else setPageNumber(pageNumber + 1);

      setLoading(false);
      setListBottomLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setListBottomLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSearchVal("")
      setPageNumber(0);
      getData(0, true);
    }, [])
  );

  const handleSearchChange = (text: string) => {
    setSearchVal(text);
    debouncedFilter(text);
  };

  const filterTransactions = (text: string) => {
    if (text.length === 0) {
      getData(0, true);
    } else {
      nameSearch(0, text);
    }
  };

  const debouncedFilter = useDebounce(filterTransactions, 500);

  const nameSearch = async (pageNumber: number, name: string) => {
    setLoading(true);
    try {
      const response = await api.get("/transactions/searchByName", {
        params: {
          startDate,
          endDate,
          sort: sortOption,
          order: sortOrderAsc ? "ASC" : "DESC",
          pageNumber: pageNumber || 0,
          size: SIZE,
          name,
        },
      });

      const data: TransactionPageResponse = response.data;
      setTransactionPageResponse(data);
      setDisplayTransactions(data.transactions);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSortChange = (option: string) => {
    setSortOrderAsc(!sortOrderAsc);
    setSortOption(option);
    getData(0, false, startDate, endDate, true, option,!sortOrderAsc);
  };

  const handleScrollEnd = () => {
    if (!listBottomLoading) {
      getData(pageNumber, false, startDate, endDate);
    }
  };
const filterByType = (type:string) => {
  setFilter(type)
  getData(0,false,startDate,endDate,true,sortOption,sortOrderAsc,type)
}
  


  return (
    !loading ? (
      <FlatList
        ref={flatListRef}
        data={displayTransactions}
        contentContainerStyle={{ paddingBottom: 16,justifyContent:"center" , alignContent:"center",display:"flex", flexDirection:"column"}}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TransactionItemChild
            showAccountAndBudget={true}
            deleteTransaction={(id:number) => {
              setLoading(true);
              api.delete(`/transactions/${id}`).then(() => getData(0, true));
            }}
            transaction={item}
          />
        )}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.timeContainer}>
              <Text style={styles.header}>Transactions</Text>
              <TouchableOpacity onPress={() => 
                
                {
                  formContextObj?.setTransactionForm({name:'',id:-1,amount:0,date:'',account:null,budget:null,type:null})
                  router.push("/transactionFormModal" as Href<string>)}
                }>
                <Feather name="plus" style={styles.plusIconStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.box}>
              <Text style={styles.summaryText}>Total Spent: ${transactionPageResponse.totalSpent}</Text>
              <Text style={styles.summaryText}>Total Deposited: ${transactionPageResponse.totalDeposited}</Text>
            </View>
            <DateFilter startDate={startDate} endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} callback={(startDate:string,endDate:string)=> {getData(0,true,startDate,endDate)}} />
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
    <TouchableOpacity style={filter === "EXPENSE" ? styles.sortButtonSelected : styles.sortButton} onPress={() => filterByType("EXPENSE")}>
    <Text style={styles.text} >Filter by expense</Text>
   
  </TouchableOpacity>
  <TouchableOpacity style={filter === "INCOME" ? styles.sortButtonSelected : styles.sortButton} onPress={() =>  filterByType("INCOME")}>
    <Text style={styles.text} >Filter by income</Text>
    
  </TouchableOpacity>
  <TouchableOpacity style={styles.sortButton} onPress={() => { 
    setFilter("")
    getData(0,false,startDate,endDate,true,sortOption,sortOrderAsc,null)
  }}>
    <Text style={styles.text} >Reset Filter</Text>
    
  </TouchableOpacity>
</View>
<View style={styles.center}>
              <TextInput
                autoCorrect={false}
                value={searchVal}
                onChangeText={handleSearchChange}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"white"}
                placeholder="search by name"
              />
            </View>
          </View>
        }
        onEndReachedThreshold={0.1}
        onEndReached={handleScrollEnd}
        ListFooterComponent={<SpinnerComponent show={listBottomLoading} />}
      />
    ) : (
      <SpinnerComponent show={loading} />
    )
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
    gap:5,
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
  sortButtonSelected: {
    color: '#ffffff',
    fontSize: 14,
    padding: 5,
    backgroundColor: '#444',
    borderRadius: 5,
    textAlign: 'center',
    marginRight:8,
    borderColor: '#ffffff',
    borderWidth:1

  },

  text: {
    color: '#ffffff',
  },

  center: {
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexGrow:0.4,
    
  }, 
 
});

