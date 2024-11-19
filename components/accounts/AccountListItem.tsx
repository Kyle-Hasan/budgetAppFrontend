
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';


export interface accountItem {
  name:string,
  currentAccountBalance:number,
  id:number,
  amountDeposited:number,
  icon?:string
}

interface accountListItemProps {
  accountItem:accountItem,
  deleteAccount: Function
}


const AccountListItem = ({accountItem,deleteAccount}:accountListItemProps) => {
  const router = useRouter();
  const {name,currentAccountBalance,amountDeposited,id} = accountItem
  
 
  const goToEdit = ()=> {
    const str:string = `/accounts/${id}`
    router.push(str as Href<string>);
  }

  

  const createTwoButtonAlert = () =>
    Alert.alert('Confirm Delete', 'Are you sure you want to delete', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {deleteAccount(id)}},
    ]);
  
  return (
     <View style={styles.box}>
  <View>
    <View style={styles.topSection}>
    <View style={styles.nameContainer}>
    {accountItem.icon &&<FontAwesome5 name={accountItem.icon} color="#ffffff" style={styles.topIconStyle}></FontAwesome5>}
     
        <Text style={styles.textStyle}>{name}</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.alignText}>
            ${currentAccountBalance}
          </Text>
        </View>
     
    </View>
   
    <View style={styles.buttonBar}>
      <TouchableOpacity onPress={goToEdit}>
        <MaterialCommunityIcons 
          name='pencil' 
          style={styles.iconStyle} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={createTwoButtonAlert}>
        <MaterialCommunityIcons 
          name='delete' 
          style={styles.iconStyle} 
        />
      </TouchableOpacity>
    </View>
  </View>
</View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex:1,
    backgroundColor: '#272727',
    borderRadius: 5,
    padding: 15,
    margin: 5,
    width:300
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent:'space-between',
    marginBottom: 10,
    gap:5,
    padding:10,
    width:250
  },
  
  textStyle: {
    color: "#ffffff",
    flex:1,
      
    paddingTop: 5,
  },
  progressBox: {
    backgroundColor: '#737373',
    padding: 5,
              
    alignItems: 'center', 
    width:110
   
  },
  buttonBar: {
    flexDirection: 'row',
    alignItems: 'center',  
    marginVertical:5,
    gap: 10,
  },
  iconStyle: {
    color: "#ffffff",
    fontSize: 20,
  },
  topIconStyle: {
    color: "#ffffff",
    fontSize: 25,
  },
  alignText: {
    textAlign: 'center',
    color: "#ffffff",      
  },
  nameContainer: {
    display:"flex",
    flexDirection:"row",
    alignItems:"flex-start",
    width:150,
    flexGrow:1,
    gap:3
   
  }
});


export default AccountListItem;
