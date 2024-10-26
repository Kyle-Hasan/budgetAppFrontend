// components/BudgetListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export interface budgetItem {
  name:string,
  currentSpent:number,
  total:number,
  id:number
}

interface budgetListItemProps {
  budgetItem:budgetItem
}


const BudgetListItem = ({budgetItem}:budgetListItemProps) => {
  const {name,currentSpent,total} = budgetItem
  const calculateTotal = Math.max(total,1)
  const percent = Math.min((currentSpent/(calculateTotal)*100),100)
  return (
    <View style={styles.box}>
      <View>
        <View style={styles.topSection}>
          <View style={styles.topSectionLeft}>
          <Text style={styles.textStyle}>{name}</Text>
          <View style={styles.progressBox}><Text style={styles.alignText}>${currentSpent}/${total}</Text></View>
          </View>
          <View style={styles.topSectionRight}>
           <TouchableOpacity> <MaterialCommunityIcons name='pencil' style={styles.iconStyle}></MaterialCommunityIcons></TouchableOpacity>
            <TouchableOpacity><MaterialCommunityIcons name='delete' style={styles.iconStyle}></MaterialCommunityIcons></TouchableOpacity>
          </View>
          </View>
          <ProgressBar percentage={percent}></ProgressBar>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
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
  topSectionLeft: {
    flexDirection: 'row',
    alignItems:'flex-start',
    flex: 1,
    maxWidth:300,
    gap:10
  
  },
  textStyle: {
    color: "#ffffff",
    flex:1,
    maxWidth:100,   
    paddingTop: 5,
  },
  progressBox: {
    backgroundColor: '#737373',
    padding: 5,
    flex:1,           
    alignItems: 'center', 
    maxWidth:200
   
  },
  topSectionRight: {
    flexDirection: 'row',
    alignItems: 'center',  
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


export default BudgetListItem;
