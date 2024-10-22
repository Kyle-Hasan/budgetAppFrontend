// components/BudgetListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export interface budgetItem {
  name:string,
  currentSpent:number,
  total:number
}

interface budgetListItemProps {
  budgetItem:budgetItem
}


const BudgetListItem = ({budgetItem}:budgetListItemProps) => {
  const {name,currentSpent,total} = budgetItem
  return (
    <View style={styles.box}>
      <View>
        <View style={styles.topSection}>
          <View style={styles.topSectionLeft}>
          <Text style={styles.textStyle}>{name}</Text>
          <View style={styles.progressBox}><Text>${currentSpent}/{total}</Text></View>
          </View>
          <View style={styles.topSectionRight}>
            <MaterialCommunityIcons name='pencil' style={styles.iconStyle}></MaterialCommunityIcons>
            <MaterialCommunityIcons name='delete' style={styles.iconStyle}></MaterialCommunityIcons>
          </View>
          </View>
          <ProgressBar percentage={70}></ProgressBar>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#272727',
    borderRadius:5,
    padding:10,
    margin:5,
  },
  topSection: {
    flexDirection:'row',
    gap:10,
    marginBottom:10
  },

  topSectionLeft: {
      flexDirection:'row',
      gap:10
  },

  textStyle: {
    color: "#ffffff",
    paddingTop:5
  },

  progressBox: {
    backgroundColor:'#737373',
    padding:5,
    
  },

  topSectionRight: {
    flexDirection:'row',
    gap:10
  },

  iconStyle: {
    color: "#ffffff",
    fontSize:20
  }

});

export default BudgetListItem;
