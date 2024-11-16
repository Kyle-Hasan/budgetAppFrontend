import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export interface IconPickerProps {
  selectedIcon: string | null;
  onSelect: (icon: string) => void; 
}


const icons = ['home', 'car', 'shopping-cart', 'money-bill-alt', 'heart','hamburger'];

const IconPicker = ({selectedIcon,onSelect}:IconPickerProps)=> {

  
  return (
    <View style={styles.iconPickerContainer}>
      <Text style={styles.label}>Select Icon</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {icons.map((iconName) => (
          <TouchableOpacity
            key={iconName}
            style={[
              styles.iconOption,
              selectedIcon === iconName && styles.selectedIconOption, 
            ]}
            onPress={() => onSelect(iconName)}
          >
            <FontAwesome5 name={iconName as any} size={30} color="#ffffff" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconPickerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    marginVertical: 5,
  },
  iconOption: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#2c2c2c',
  },
  selectedIconOption: {
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default IconPicker;
