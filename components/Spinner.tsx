import React from "react";

import { ActivityIndicator,StyleSheet,View } from "react-native";

interface PropTypes {
  show: boolean;
}

const SpinnerComponent = ({ show }: PropTypes) => {
  return (
    show &&
    <View style={styles.container}>
       <ActivityIndicator size="large" color="#6200ea" />
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop:100
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

export default SpinnerComponent;
