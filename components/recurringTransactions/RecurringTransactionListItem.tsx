import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Moment from "moment";
import { Href, useRouter } from "expo-router";
import { useContext } from "react";
import { FormContext } from "@/app/context/FormContex";
import { RecurringTransaction } from "./RecurringTransactionForm";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export interface ParentEntity {
  id: number;
  name: string;
}

interface RecurringTransactionProps {
  recurringTransaction: RecurringTransaction;
  deleteTransaction: (id: number) => void;
  showAccountAndBudget?: boolean;
  icon?:string
}

const RecurringTransactionListItem = ({
  recurringTransaction,
  deleteTransaction,
  showAccountAndBudget,
}: RecurringTransactionProps) => {
  const router = useRouter();
  const formContextObj = useContext(FormContext);

  const editNavigate = () => {
    const str:string = `/recurringTransactions/${recurringTransaction.id}`
    router.push(str as Href<string>);
  };

  const createDeleteAlert = () => {

    if(Platform.OS !== 'web') {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this recurring transaction?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteTransaction(recurringTransaction.id);
        },
      },
    ])} 
    else {

      if (window.confirm("Are you sure you want to delete this item?")) {
        deleteTransaction(recurringTransaction.id);
      }

    }
  };

  return (
    <View style={styles.box}>
      <View style={styles.topSection}>
      {recurringTransaction.icon &&<FontAwesome5 name={recurringTransaction.icon} style={styles.topIconStyle}></FontAwesome5>}

        <Text style={styles.textStyle}>
          <Text style={styles.boldText}>Name:</Text> {recurringTransaction.name}
        </Text>
      </View>
      <View style={styles.topSection}>
        <Text style={styles.textStyle}>
          <Text style={styles.boldText}>Amount:</Text> ${recurringTransaction.amount}
        </Text>
      </View>
      <View style={styles.topSection}>
        <Text style={styles.textStyle}>
          <Text style={styles.boldText}>Frequency:</Text> {recurringTransaction.frequency}
        </Text>
      </View>
      <View style={styles.topSection}>
        <Text style={styles.textStyle}>
          <Text style={styles.boldText}>Type:</Text> {recurringTransaction.transactionType?.toLowerCase()}
        </Text>
      </View>
      {showAccountAndBudget && (
        <View style={styles.topSection}>
          <Text style={styles.textStyle}>
            <Text style={styles.boldText}>Account:</Text> {recurringTransaction.account?.name || "N/A"}
          </Text>
        </View>
      )}
      {showAccountAndBudget && (
        <View style={styles.topSection}>
          <Text style={styles.textStyle}>
            <Text style={styles.boldText}>Budget:</Text> {recurringTransaction.budget?.name || "N/A"}
          </Text>
        </View>
      )}
      <View style={styles.buttonBar}>
        <TouchableOpacity onPress={editNavigate}>
          <MaterialCommunityIcons name="pencil" style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createDeleteAlert}>
          <MaterialCommunityIcons name="delete" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecurringTransactionListItem;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#272727",
    borderRadius: 5,
    padding: 10,
    margin: 5,
    width: 500,
    height: 300,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "90%",
  },
  textStyle: {
    color: "#ffffff",
    flex: 1,
    paddingTop: 5,
  },
  boldText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  buttonBar: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 10,
  },
  iconStyle: {
    color: "#ffffff",
    fontSize: 20,
    
  },
  topIconStyle: {
    color: "#ffffff",
    fontSize: 30,
    marginRight:5

  }
});
