import React, { useState } from "react";
import { Text,View,TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
interface dropdownProps {
    items: any[],
    labelName: string,
    keyName:string,
    defaultSelection:any,
    changeSelection:Function,


}
const Dropdown = ({labelName,items,keyName,defaultSelection,changeSelection}:dropdownProps)=> {
    
    const [show,setShow] = useState(false)
    const [currentSelection,setCurrentSelection] = useState(defaultSelection)
    
    const [showItems,setShowItems] = useState(items.filter((x,index)=> {
        if(!currentSelection) {
            return index !== 0
        }
        else {
            return x[keyName] != currentSelection[keyName]
        }
    }))
    console.log("Show items",showItems)

    const toggleShow = ()=> {
        console.log("show")
        setShow(!show)
    }

    const changeItem = (item:any)=> {
        changeSelection(item)
        setCurrentSelection(item)
        setShowItems(items.filter((x)=> {
            return x[keyName] != item[keyName]
        }))
        setShow(false)
    }
    return (
        <View style={styles.container} >
           <TouchableOpacity style={styles.currentItem} onPress={toggleShow} > <Text style={styles.text}>{currentSelection ? currentSelection[labelName] : ""}</Text></TouchableOpacity>
           <FlatList data={showItems} style={show? styles.listShow: styles.listHide} keyExtractor={(item)=> item[keyName].toString() } renderItem={({item})=> {
                return <View style={styles.listItem}><TouchableOpacity onPress={()=> changeItem(item)}><Text style={styles.text}>{item[labelName]}</Text></TouchableOpacity></View>
           }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
        flex:1,
        minWidth:200,
        
        

    },
    listHide: {
        display:'none'
    },
    listShow: {
        display:'flex',
        position:'absolute',
        top:41,
        zIndex:999,
        elevation:999
      

    },
    currentItem: {
        backgroundColor: '#2c2c2c',
        borderRadius:5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#444',
        minHeight:40
    },
    listItem: {
        backgroundColor: '#2c2c2c',
       zIndex:24,
        padding: 10,
        
        minWidth:200,
        borderWidth:1,
        
        borderColor: '#444',
       
        
    },
    text: {
        color:'white',
        textAlign:'center'
    }
})

export default Dropdown;