import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface dropdownProps {
  items: any[];
  labelName: string;
  keyName: string;
  defaultSelection: any;
  changeSelection: Function;
}

const Dropdown = ({
  labelName,
  items,
  keyName,
  defaultSelection,
  changeSelection,
}: dropdownProps) => {
  const [show, setShow] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(defaultSelection);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItems, setShowItems] = useState(items);

  const toggleShow = () => {
    setSearchTerm(""); 
    setShow(!show);
  };

  const changeItem = (item: any | null) => {
    changeSelection(item);
    setCurrentSelection(item);
    setShowItems(items);
    setShow(false);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filteredItems = items.filter((x) =>
      x[labelName].toLowerCase().includes(text.toLowerCase())
    );
    setShowItems(filteredItems);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.currentItem} onPress={toggleShow}>
        <Text style={styles.text}>
          {currentSelection ? currentSelection[labelName] : "Select an option"}
        </Text>
      </TouchableOpacity>
      {show && (
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <FlatList
            data={showItems}
            style={styles.listShow}
            keyExtractor={(item) => item[keyName].toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <TouchableOpacity onPress={() => changeItem(item)}>
                  <Text style={styles.text}>{item[labelName]}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListHeaderComponent={
              <View style={styles.listItem}>
                <TouchableOpacity onPress={() => changeItem(null)}>
                  <Text style={styles.text}>None</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    maxHeight: 200,
  },
  searchInput: {
    backgroundColor: "#1c1c1c",
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
    color: "white",
    borderColor: "#444",
    borderWidth: 1,
  },
  listShow: {
    display: "flex",
    position: "absolute",
    top: 40,
    zIndex: 999,
    elevation: 999,
  },
  currentItem: {
    backgroundColor: "#2c2c2c",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#444",
    minHeight: 40,
  },
  listItem: {
    backgroundColor: "#2c2c2c",
    zIndex: 24,
    padding: 10,
    minWidth: 200,
    borderWidth: 1,
    borderColor: "#444",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default Dropdown;
