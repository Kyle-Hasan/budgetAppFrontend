
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, FlatList,ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { setStorageValue } from "@/app/storage/storage";
import Moment from 'moment';
export interface transaction {
    name: string,
    date: Date,
    amount:string,
    id:number,
    budget?:ParentEntity | null
    account?:ParentEntity | null,
    type?: string | null
}

interface ParentEntity {
  id:number,
  name:string
}

interface transctionProps {
    transaction:transaction
  }

const TransactionItemChild = ({transaction}:transctionProps)=> {
    const router = useRouter()

    const editNavigate = ()=> {
        setStorageValue("transactionForm",JSON.stringify(transaction))
        router.push('/transactionFormModal' as Href<string>)
    }


    return (<View style={styles.box}>
    <View style={styles.topSection}><Text style={styles.textStyle}>{transaction.name}</Text>
          <Text style={styles.alignText}>
            ${transaction.amount}
          </Text>
        </View>
    <View style={styles.topSection}><Text style={styles.textStyle}>{Moment(transaction.date).format('d MMMM Y')}</Text><Text style={styles.whiteText}>{transaction.type}</Text></View>
    <View style={styles.buttonBar}>
      <TouchableOpacity onPress={editNavigate}>
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
      width:'100%'
    },
    topSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',  
      justifyContent: 'space-between',
      marginBottom: 10,
      width:'100%'
    },
    whiteText: {
      color: "#ffffff",
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
  });