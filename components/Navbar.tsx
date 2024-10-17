// components/Navbar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Budgets</Text></TouchableOpacity>
      <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Accounts</Text></TouchableOpacity>
      <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Transactions</Text></TouchableOpacity>
      <View style={styles.userMenu}>
        <Text style={styles.navText}>User Name</Text>
        <DropdownMenu />
      </View>
    </View>
  );
};

const DropdownMenu = () => (
  <View style={styles.dropdownMenu}>
    <TouchableOpacity style={styles.dropdownItem}><Text>Profile</Text></TouchableOpacity>
    <TouchableOpacity style={styles.dropdownItem}><Text>Settings</Text></TouchableOpacity>
    <TouchableOpacity style={styles.dropdownItem}><Text>Log Out</Text></TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: '#fff',
  },
  userMenu: {
    position: 'relative',
    padding: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#333',
    padding: 10,
    zIndex: 10,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
  },
});

export default Navbar;
