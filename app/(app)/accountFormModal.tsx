

import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormContext } from '../context/FormContex';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CreateAmountForm, { accountForm } from '@/components/accounts/AccountForm';


export default function accountFormModal() {
  const isPresented = router.canGoBack()
  const [accountForm,setAccountForm] = useState<accountForm>({
    id:-1,
    name:"",
    startingBalance:0,
    transactions: []
  })
  const formContextObj = useContext(FormContext)
  useEffect(()=> {
    formContextObj?.setAccountForm(accountForm)
  },[])
  
  return (
    <View style={styles.container}>
      {isPresented && <Link href="../" style={styles.backContainer}><Feather style={styles.backIcon} name="arrow-left"></Feather><Text style={styles.textStyle}>Go Back</Text></Link>}
      <CreateAmountForm accountForm={accountForm}></CreateAmountForm>
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
