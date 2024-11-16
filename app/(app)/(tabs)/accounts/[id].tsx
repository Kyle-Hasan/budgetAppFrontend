
import React, { useCallback, useContext, useEffect, useState } from 'react'



import { View, StyleSheet } from 'react-native';
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { FormContext } from '@/app/context/FormContex';
import CreateAmountForm, { accountForm } from '@/components/accounts/AccountForm';


const accountPage = () => {
  const glob = useGlobalSearchParams();
  const formContextObj = useContext(FormContext)
  const [accountForm,setAccountForm] = useState<accountForm | null>(null)


  useFocusEffect(useCallback(()=> {
    const getData = async()=> {
      const id = glob.id
     
      const response = await api.get("/accounts/"+id)
      
       formContextObj?.setAccountForm({...response.data})
      
    }
    getData()
  },[glob.id]))



  return (<View style={styles.container}> { accountForm &&  <CreateAmountForm ></CreateAmountForm>}</View>);
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

export default accountPage;
