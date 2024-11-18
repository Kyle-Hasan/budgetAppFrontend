// components/BudgetListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Dimensions } from 'react-native';
import ProgressBar from './ProgressBar'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import api from '@/app/api/api';


export interface budgetItem {
  name:string,
  currentSpent:number,
  total:number,
  id:number,
  color:string,
  icon?:string
}

interface budgetListItemProps {
  budgetItem:budgetItem,
  deleteBudget:Function,
  refreshSummary:Function
}


const BudgetListItem = ({budgetItem,deleteBudget}:budgetListItemProps) => {
  const router = useRouter();
  const {name,currentSpent,total,id} = budgetItem
  const calculateTotal = Math.max(total,1)
  let percent = Math.max((currentSpent/(calculateTotal)*100),0)
  percent = Math.min(percent,100)

  const createTwoButtonAlert = () =>
    Alert.alert('Confirm Delete', 'Are you sure you want to delete', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {deleteBudget(id)}},
    ]);

  const goToEdit = ()=> {
    const str:string = `/budgets/${id}`
    router.push(str as Href<string>);
  }
  
  return (
     <View style={styles.box}>
  <View>
    <View style={styles.topSection}>
     
      <View style={styles.topSection}>
      <View style={styles.nameContainer} >
      {budgetItem.icon &&<FontAwesome5 name={budgetItem.icon} color="#ffffff" style={styles.topIconStyle}></FontAwesome5>}
        <Text style={styles.textStyle}>{name}</Text>
        </View>
     
        <View style={styles.progressBox}>
          <Text style={styles.alignText}>
            ${currentSpent}/${total}
          </Text>
        </View>
      </View>
    </View>
    <ProgressBar percentage={percent} />
    <View style={styles.buttonBar}>
      <TouchableOpacity onPress={goToEdit}>
        <MaterialCommunityIcons 
          name='pencil' 
          style={styles.iconStyle} 
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{createTwoButtonAlert()}}>
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
    width:300,
    alignSelf:"center",
    
  },
  topSection: {
    flexDirection: 'row',
    width:250,
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
              
    alignItems: 'center', 
    width:150

   
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
    fontSize:25
  },
  alignText: {
    textAlign: 'center',
    color: "#ffffff",      
  },
  nameContainer: {
    display:"flex",
    flexDirection:"row",
    alignItems:"flex-start",
    width:100,
    flexGrow:1,
    gap:3
   
  }
});


export default BudgetListItem;