import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Dropdown from "../Dropdown";
import api from "@/app/api/api";
import { FormContext } from "@/app/context/FormContex";
import { useToastController } from "@tamagui/toast";
import SpinnerComponent from "../Spinner";
import CurrencyInput from "react-native-currency-input";
import { useFocusEffect, useRouter } from "expo-router";
import { ParentEntity } from "../transactions/transactionItemChild";
import CurrentToast from '@/components/CurrentToast';
import IconPicker from "../IconPicker";

const frequencyOptions = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Biweekly', value: 'Biweekly' },
  { label: 'Daily', value: 'Daily' }
];

const transactionTypeOptions = [
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' }
];

export interface RecurringTransaction {
    id:number,
    amount:number,
    frequency:string,
    transactionType:string,
    account:ParentEntity | null,
    budget: ParentEntity | null,
    name:string,
    icon?:string
    
}

interface RecurringTransactionFormProps {
    recurringTransactionProp:RecurringTransaction
}

const RecurringTransactionForm = ({recurringTransactionProp}:RecurringTransactionFormProps) => {
  const toast = useToastController();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formContextObj = useContext(FormContext);
  
  const [recurringTransaction, setRecurringTransaction] = useState<RecurringTransaction>(recurringTransactionProp);
  const [budgets, setBudgets] = useState<any[] | null>(null);
  const [accounts, setAccounts] = useState<any[] | null>(null);

  useFocusEffect(useCallback(() => {
    toast.hide();
    const fetchBudgetsAndAccounts = async () => {
      try {
        const budgetResponse = await api.get('/budgets/budgetSelections');
        const accountResponse = await api.get('/accounts/accountSelections');
        setBudgets(budgetResponse.data);
        setAccounts(accountResponse.data);
      } catch (e) {
        console.error("Failed to load budgets or accounts:", e);
      }
    };

    fetchBudgetsAndAccounts();
  }, []));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = { ...recurringTransaction, amount: recurringTransaction.amount, frequency: recurringTransaction.frequency, transactionType: recurringTransaction.transactionType ? recurringTransaction.transactionType.toUpperCase() : null };
     
      const response = recurringTransaction.id !== -1
        ? await api.patch("/recurring", body)
        : await api.post("/recurring", body);
    
        setRecurringTransaction(response.data)

      toast.show("Successfully saved!", { message: "Recurring Transaction Saved", native: false, customData: { color: "green" } });
      
      
    } catch (e) {
      toast.show("Failed", { message: "Error saving transaction", native: false, customData: { color: "red" } });
    } finally {
      setLoading(false);
    }
  };

  const setFormData = (fieldName: string, value: any) => setRecurringTransaction((prev) => ({ ...prev, [fieldName]: value }));
  const budgetChanged = (budget: any) => setRecurringTransaction((prev) => ({ ...prev, budget }));
  const accountChanged = (account: any) => setRecurringTransaction((prev) => ({ ...prev, account }));
  const frequencyChanged = (frequency: { label: string }) => setRecurringTransaction((prev) => ({ ...prev, frequency: frequency.label }));
  const typeChanged = (type: { label: string }) => setRecurringTransaction((prev) => ({ ...prev, transactionType: type.label == "Income" ? "INCOME": "EXPENSE" }));


  const changeIcon = (icon:string)=> {
      
    setFormData("icon",icon)
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recurring Transaction Form</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={recurringTransaction.name} onChangeText={(text) => setFormData('name', text)} />

      <Text style={styles.label}>Amount</Text>
      <CurrencyInput
        value={recurringTransaction.amount}
        onChangeValue={(value) => setFormData("amount", value)}
        prefix="$"
        delimiter=","
        separator="."
        precision={2}
        style={styles.input}
        keyboardType="numeric"
        placeholder="$0.00"
      />

      {budgets && (
        <View style={styles.budgetContainer}>
          <Text style={styles.label}>Budget</Text>
          <Dropdown changeSelection={budgetChanged} defaultSelection={recurringTransaction.budget} items={budgets} keyName="id" labelName="name" />
        </View>
      )}

      {accounts && (
        <View style={styles.accountContainer}>
          <Text style={styles.label}>Account</Text>
          <Dropdown changeSelection={accountChanged} defaultSelection={recurringTransaction.account} items={accounts} keyName="id" labelName="name" />
        </View>
      )}

      <View style={styles.frequencyContainer}>
        <Text style={styles.label}>Frequency</Text>
        <Dropdown changeSelection={frequencyChanged} defaultSelection={{ label: recurringTransaction.frequency, value: recurringTransaction.frequency }} items={frequencyOptions} keyName="value" labelName="label" />
      </View>

      <View style={styles.typeContainer}>
        <Text style={styles.label}>Transaction Type</Text>
        <Dropdown changeSelection={typeChanged} defaultSelection={{ label: recurringTransaction.transactionType, value: recurringTransaction.transactionType }} items={transactionTypeOptions} keyName="value" labelName="label" />
      </View>

      <View><IconPicker onSelect={changeIcon} selectedIcon={recurringTransaction.icon ? recurringTransaction.icon : null}></IconPicker></View>


      <Button title="Submit" onPress={handleSubmit} color="#6200ea" disabled={loading} />
      <CurrentToast />
      <SpinnerComponent show={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    marginVertical: 10,
    width: 200
  },
  dropdownContainer: {
    marginBottom: 10,
    width: 200
  },
  budgetContainer: {
    marginBottom: 10,
    width: 200,
    zIndex:900
  },
  accountContainer: {
    marginBottom:10,
    width:200,
    zIndex:899
  },
  frequencyContainer: {
    marginBottom:10,
    width:200,
    zIndex:898

  },
  typeContainer: {
    marginBottom:10,
    width:200,
    zIndex:897

  }
});

export default RecurringTransactionForm;
