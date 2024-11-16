

import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormContext } from '../context/FormContex';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CreateBudgetForm, {budgetForm} from '../../components/budgets/CreateBudgetForm';

export default function budgetFormModal() {
  const isPresented = router.canGoBack()
  const [budgetForm,setBudgetForm] = useState<budgetForm>({
    id:-1,
    name:"",
    amount: 0,
    transactions: [],
    icon:null
  })
  const formContextObj = useContext(FormContext)
  useEffect(()=> {
    formContextObj?.setBudgetForm(budgetForm)
  },[])
  
  return (
    <View style={styles.container}>
      {isPresented && <Link href="../" style={styles.backContainer}><Feather style={styles.backIcon} name="arrow-left"></Feather><Text style={styles.textStyle}>Go Back</Text></Link>}
      <CreateBudgetForm></CreateBudgetForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  backContainer: {
    backgroundColor: '#121212',
    marginTop:50,
    marginLeft:10
   
  },
  textStyle: {
    color: "#ffffff",
  },
  backIcon: {
   
    color: "#ffffff",
    fontSize: 25,
    paddingVertical: 5,
  },
});
