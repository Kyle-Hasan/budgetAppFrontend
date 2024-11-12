import React from "react";
import { StyleSheet, View } from "react-native";
import DateInput from "./DateInput";
interface DateFilterProps{
 startDate:string,
 endDate:string,
 setStartDate:Function,
 setEndDate:Function,
 callback:Function
}

const DateFilter = ({startDate,endDate,setEndDate,setStartDate,callback}:DateFilterProps)=> {

    const dateChange = (date:string,value:string,callback:Function)=> {
        const dateObj = new Date(value); 
        const dateStr =  dateObj.toISOString().split('T')[0]; 
       
          if(date == "start" ) {
            setStartDate(dateStr)
            if(dateObj.getTime() <= Date.parse(endDate)) {
             callback(dateStr,endDate)
            }
          }
          else if(date == "end") {
            setEndDate(dateStr)
            if(dateObj.getTime() >= Date.parse(startDate)) {
            callback(startDate,dateStr)
            }
          }
      }
    return (<View style={styles.box}><DateInput date={startDate} setDate={(value:string)=>{dateChange("start",value,callback)}}/><DateInput date={endDate} setDate={(value:string)=>{dateChange("end",value,callback)}}/></View>)

}

const styles = StyleSheet.create({
    box: {
        display:'flex',
        flexDirection:'row',
        gap:10,
        zIndex:900
    }
})

export default DateFilter;