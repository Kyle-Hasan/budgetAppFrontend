import React, { useState } from "react"
import WebDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { newDate } from "react-datepicker/dist/date_utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Platform, View,StyleSheet, Text,Dimensions } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import './datePicker.css'
import AntDesign from '@expo/vector-icons/AntDesign';
interface DateInputProps {
  date:string,
  setDate:Function
  formInput?:boolean
}
const DateInput = ({date,setDate,formInput}:DateInputProps)=> {

  const [openDatePicker, setOpenDatePicker] = useState(false)
  return (<View style={styles.flex}><AntDesign name="calendar" size={24} color="white" />{Platform.OS !== 'web' ? (
        (<View><TouchableOpacity onPress={()=> {setOpenDatePicker(true)}}><View style={{...styles.input,width: formInput ? 200 : Dimensions.get('window').width * 0.30}}>
          <Text style={styles.label}>{date ? date : new Date().toISOString().split('T')[0]}</Text></View></TouchableOpacity>
      {openDatePicker&&<DateTimePicker
          timeZoneOffsetInMinutes={0} 
          testID="dateTimePicker"
          value={date ? new Date(Date.parse(date)) : new Date()}
          onChange={(e)=> {
            setOpenDatePicker(false)
            if (e.type === 'set') {
              const timestamp = e.nativeEvent.timestamp;
              console.log(timestamp)
              const date = new Date(timestamp);
            
              const adjustedDate = new Date(date.getTime());
             
              setDate(date.toISOString().split('T')[0]);
           //   console.log(adjustedDate.toISOString());
            }
          }
          }
          onTouchCancel={()=> {setOpenDatePicker(false)}}
          mode='date'
          is24Hour={true}
        />}</View>)):<WebDatePicker calendarIconClassName="calendarIcon"  popperClassName="custom-datepicker" dateFormat="yyyy/MM/dd" value={date} onChange={(date:Date | null)=> {setDate(date?.toISOString().split('T')[0])}} className="custom-datepicker"></WebDatePicker>}</View>)

}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    marginVertical: 10,

    width: Dimensions.get('window').width * 0.30
  },
  label: {
    color: '#ffffff',
    marginVertical:5,
    textAlign:'center'
  },
  flex: {
    display:"flex",
    flexDirection:"row",
    gap:5,
    zIndex:999
  }
 
});

export default DateInput