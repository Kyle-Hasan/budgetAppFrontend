
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { setStorageValue } from "@/app/storage/storage";
import Moment from 'moment';
import { useContext } from "react";
import { FormContext } from "@/app/context/FormContex";
export interface transaction {
    name: string,
    date: string,
    amount:number | null,
    id:number,
    budget?:ParentEntity | null
    account?:ParentEntity | null,
    type?: string | null
}

export interface ParentEntity {
  id:number,
  name:string
}

interface transctionProps {
    transaction:transaction,
    deleteTransaction:Function,
    showAccountAndBudget?: boolean
   
  }

const TransactionItemChild = ({transaction,deleteTransaction,showAccountAndBudget}:transctionProps)=> {
    const router = useRouter()
    const formContextObj = useContext(FormContext)

    const editNavigate = ()=> {
      const str:string = `/transactions/${transaction.id}`
      router.push(str as Href<string>);
    }

   

    const createTwoButtonAlert = () =>
      Alert.alert('Confirm Delete', 'Are you sure you want to delete', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {deleteTransaction(transaction.id)}},
      ]);


    return (<View style={styles.box}>
    <View style={styles.topSection}><Text style={styles.textStyle}><Text style={styles.boldText}>Name:</Text> {transaction.name}</Text></View>
    <View style={styles.topSection}><Text style={styles.textStyle}><Text style={styles.boldText}>Amount:</Text>  ${transaction.amount}</Text></View>
    <View style={styles.topSection}><Text style={styles.textStyle}><Text style={styles.boldText}>Date:</Text>  {Moment(transaction.date).format('d MMMM Y')}</Text></View>
    <View style={styles.topSection}><Text style={styles.rightText}><Text style={styles.boldText}>Type:</Text>  {transaction.type?.toLowerCase()}</Text></View>
    {showAccountAndBudget && <View style={styles.topSection}><Text style={styles.textStyle}><Text style={styles.boldText}>Account:</Text> {transaction.account?.name}</Text></View>}
    {showAccountAndBudget && <View style={styles.topSection}><Text style={styles.rightText}><Text style={styles.boldText}>Budget:</Text> : {transaction.budget?.name}</Text></View>}
    
    <View style={styles.buttonBar}>
      <TouchableOpacity onPress={editNavigate}>
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
    </View>)

}





export default TransactionItemChild

const styles = StyleSheet.create({
    box: {
      flex:1,
      backgroundColor: '#272727',
      borderRadius: 5,
      padding: 10,
      margin: 5,
      width:500,
      height:300
    },
    topSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',  
      justifyContent: 'space-between',
      marginBottom: 10,
      width:"90%",
      
    },
    whiteText: {
      color: "#ffffff",
    
    },
    rightText: {
      color: "#ffffff",
      textAlign:'right',
      paddingTop: 5,
    },
    textStyle: {
      color: "#ffffff",
      flex:1,
        
      paddingTop: 5,
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
    boldText: {
      color: "#ffffff",
      fontWeight:"bold"
    }
  });