import TransactionForm from '@/components/transactions/transactionForm';
import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function transactionFormModal() {

  const isPresented = router.canGoBack()
  return (
    <View style={styles.container}>
     {isPresented && <Link href="../" style={styles.backContainer}><Feather style={styles.backIcon} name="arrow-left"></Feather><Text style={styles.textStyle}>Go Back</Text></Link>}
      <TransactionForm></TransactionForm>
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
    marginBottom:10,
    marginLeft:20
   
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
