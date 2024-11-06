
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';


export interface accountItem {
  name:string,
  currentAccountBalance:number,
  id:number,
  amountDeposited:number
}

interface accountListItemProps {
  accountItem:accountItem
}


const AccountListItem = ({accountItem}:accountListItemProps) => {
  const router = useRouter();
  const {name,currentAccountBalance,amountDeposited,id} = accountItem
  
 
  const goToEdit = ()=> {
    const str:string = `/accounts/${id}`
    router.push(str as Href<string>);
  }
  return (
     <View style={styles.box}>
  <View>
    <View style={styles.topSection}>
      <View style={styles.topSection}>
        <Text style={styles.textStyle}>{name}</Text>
        <View style={styles.progressBox}>
          <Text style={styles.alignText}>
            ${currentAccountBalance}
          </Text>
        </View>
      </View>
    </View>
   
    <View style={styles.buttonBar}>
      <TouchableOpacity onPress={goToEdit}>
        <MaterialCommunityIcons 
          name='pencil' 
          style={styles.iconStyle} 
        />
      </TouchableOpacity>
      <TouchableOpacity>
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
    padding: 10,
    margin: 5,
    width:'100%'
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent:'center',
    marginBottom: 10,
    gap:10
  },
  
  textStyle: {
    color: "#ffffff",
    flex:1,
      
    paddingTop: 5,
  },
  progressBox: {
    backgroundColor: '#737373',
    padding: 5,
    flex:1,           
    alignItems: 'center', 

   
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
  alignText: {
    textAlign: 'center',
    color: "#ffffff",      
  },
});


export default AccountListItem;
