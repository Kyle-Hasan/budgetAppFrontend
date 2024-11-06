import AccountSummary from "@/components/accounts/AccountSummary";
import React from "react";
import { View,TextInput, Text,StyleSheet } from "react-native";


const accountPage = ()=> {


    return <View style={styles.container}><AccountSummary/></View>

}

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


export default accountPage