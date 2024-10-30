import TransactionForm from '@/components/transactions/transactionForm';
import { StyleSheet, Text, View } from 'react-native';

export default function transactionFormModal() {
  return (
    <View style={styles.container}>
      <TransactionForm></TransactionForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
