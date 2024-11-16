
import React, { useCallback, useContext, useEffect, useState } from 'react'



import { View, StyleSheet } from 'react-native';
import CreateBudgetForm, {budgetForm} from '../../../../components/budgets/CreateBudgetForm'
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';


const budgetPage = () => {
  const glob = useGlobalSearchParams();
  
  const formContextObj = useContext(FormContext)
  const [budgetForm,setBudgetForm] = useState<budgetForm | null>(null)


  useFocusEffect(
    useCallback(()=> {
    const getData = async()=> {
  
      
      const id = glob.id

      if(!id) return

     
     
      const response = await api.get("/budgets/"+id)
      console.log("trigger use effect paretn",response.data)
      formContextObj?.setBudgetForm({...response.data})
      
      
    }
    getData()
  },[glob.id]))



  return (<View style={styles.container}>{ budgetForm && <CreateBudgetForm></CreateBudgetForm>}</View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default budgetPage;
