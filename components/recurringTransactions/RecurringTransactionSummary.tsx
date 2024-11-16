import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { Feather } from "@expo/vector-icons";

import api from "@/app/api/api";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { FormContext } from "@/app/context/FormContex";
import SpinnerComponent from "../Spinner";
import RecurringTransactionListItem, {  } from "./RecurringTransactionListItem";
import { useDebounce } from "@/hooks/useDebounce";
import { RecurringTransaction } from "./RecurringTransactionForm";

interface RecurringTransactionPageResponse {
  transactions: RecurringTransaction[]
  totalRecurringIncome: number;
  totalRecurringExpense: number;
}

export default function RecurringTransactionSummary() {
  const router = useRouter();
  const formContextObj = useContext(FormContext);
  const [loading, setLoading] = useState(false);

  const [recurringTransactions,setRecurringTransaction] = useState<RecurringTransaction[]>([]);
  const [displayTransactions, setDisplayTransactions] = useState<RecurringTransaction[]>([]);

  const [sortOption, setSortOption] = useState("frequency");
  const [sortOrderAsc, setSortOrderAsc] = useState(false);

  const getColumnCount = () => {
    const screenWidth = Dimensions.get("window").width;
    const spaceForItem = 175;
    return Math.ceil(screenWidth / spaceForItem);
  };

  const [numColumns, setNumColumns] = useState(getColumnCount());

  const sortOptions = [
    { label: "frequency", option: "frequency" },
    { label: "name", option: "name" },
    { label: "amount", option: "amount" },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/recurring");
      const data: RecurringTransaction[] = response.data;
      setRecurringTransaction(data)
      setLoading(false);
      sortTransactions(sortOption, data);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const goToRecurringTransactionCreate = () => {
    const newForm: RecurringTransaction = { name: "", id: -1, amount: 0, frequency: "Monthly", transactionType: "EXPENSE", account: null, budget: null };
    formContextObj?.setRecurringTransactionForm(newForm);

    router.push("/recurringTransactionFormModal" as Href<string>);
  };

  const deleteTransaction = async (id: number) => {
    setLoading(true);
    await api.delete(`/recurring/${id}`);
    getData();
    setLoading(false);
  };

  const [searchVal, setSearchVal] = useState("");

  const filterTransactions = (text: string) => {
    if (text.length === 0) {
      setDisplayTransactions(recurringTransactions);
    }
    setDisplayTransactions(
      recurringTransactions.filter((x) => x.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const debouncedFilter = useDebounce(filterTransactions, 200);

  const handleSearchChange = (text: string) => {
    setSearchVal(text);
    debouncedFilter(text);
  };

  const sortTransactions = (option: string, optionalArr?: RecurringTransaction[]) => {
    let sorted = [...displayTransactions];

    if (optionalArr) {
      sorted = [...optionalArr];
    }

    if (option === "frequency") {
      sorted.sort((a, b) => (sortOrderAsc ? a.frequency.localeCompare(b.frequency) : b.frequency.localeCompare(a.frequency)));
    } else if (option === "amount") {
      sorted.sort((a, b) => {
        if (!b.amount) return -1;
        else if (!a.amount) return 1;
        return sortOrderAsc ? a.amount - b.amount : b.amount - a.amount;
      });
    } else if (option === "name") {
      sorted.sort((a, b) => (sortOrderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    }

    setDisplayTransactions(sorted);
  };

  const handleSortChange = (option: string) => {
    setSortOrderAsc(!sortOrderAsc);
    setSortOption(option);
    sortTransactions(option);
  };

  const filterByType = (expense: boolean) => {
    if (expense) {
      const filtered = recurringTransactions.filter((x) => x.transactionType === "EXPENSE");
      sortTransactions(sortOption, filtered);
    } else {
      const filtered = recurringTransactions.filter((x) => x.transactionType === "INCOME");
      sortTransactions(sortOption, filtered);
    }
  };

  return !loading ? (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.header}>Recurring Transactions</Text>
        <TouchableOpacity onPress={goToRecurringTransactionCreate}>
          <Feather name="plus" style={styles.plusIconStyle} />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <FlatList
          contentContainerStyle={{ gap: 16 }}
          numColumns={numColumns}
          data={sortOptions}
          keyExtractor={(item) => item.option}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.sortButton} onPress={() => handleSortChange(item.option)}>
              <Text style={styles.text}>Sort by {item.label}</Text>
              {sortOption === item.option && (
                <Feather name={sortOrderAsc ? "chevron-down" : "chevron-up"} size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.sortButton} onPress={() => filterByType(true)}>
          <Text style={styles.text}>Filter by expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => filterByType(false)}>
          <Text style={styles.text}>Filter by income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setDisplayTransactions(recurringTransactions)}>
          <Text style={styles.text}>Reset Filter</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        autoCorrect={false}
        value={searchVal}
        onChangeText={handleSearchChange}
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor={"white"}
        placeholder="search by name"
      />
      <FlatList
        data={displayTransactions}
        renderItem={({ item }) => (
          <RecurringTransactionListItem
            showAccountAndBudget={true}
            deleteTransaction={deleteTransaction}
            recurringTransaction={item}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  ) : (
    <SpinnerComponent show={loading} />
  );
}

const styles = StyleSheet.create({
  header: {
    color: "#ffffff",
    fontSize: 25,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: 50,
  },
  timeContainer: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 10,
    zIndex: 901,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "bold",
  },
  box: {
    backgroundColor: "#272727",
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  plusIconStyle: {
    color: "#ffffff",
    fontSize: 20,
    paddingTop: 5,
  },
  input: {
    backgroundColor: "#2c2c2c",
    color: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    marginVertical: 10,
    minWidth: 200,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 5,
    flexWrap: "wrap",
  },
  sortButton: {
    color: "#ffffff",
    fontSize: 14,
    padding: 5,
    backgroundColor: "#444",
    borderRadius: 5,
    textAlign: "center",
    marginRight: 8,
  },
  text: {
    color: "#ffffff",
  },
});
