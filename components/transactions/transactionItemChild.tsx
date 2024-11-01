
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
    id:string,
    from?:string,
    to?:string
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
    <View style={styles.topSection}><Text style={styles.textStyle}>{Moment(transaction.date).format('d MMM')}</Text></View>
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