
import { Pie, PolarChart } from "victory-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View,Dimensions,Text, StyleSheet } from 'react-native';
import { useFont } from "@shopify/react-native-skia";
                            
type pieChartDataFormat = {
    name:string,
    currentSpent:number,
    color:string,
    percent?:string
}

interface PieChartViewComponents  {
    pieChartData:pieChartDataFormat[],
   
}



const PieChartView = ({pieChartData}:PieChartViewComponents)=> {

    function getRandomColor(): string {
        const minBrightness = 40;
        
        const red = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
        const green = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
        const blue = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
      
        // Convert RGB to hex
        return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
      }
   

    const [data,setData] = useState<pieChartDataFormat[]>([])

    const formatData = ()=> {
        const temp = [...pieChartData]
        const totalSum = temp.reduce((total,current)=> {
            return total+current.currentSpent 
        },0)
        //prevent identical colors
        let colors = new Set<string>([])
        console.log(temp)
        setData(temp.filter(x=> x.currentSpent > 0).map(x=> {

            let color = getRandomColor()
            while(colors.has(color)) {
                color = getRandomColor()
            }
            colors.add(color)
            return {...x,percent:(x.currentSpent/totalSum * 100).toFixed(2),color}
        }))

    }
    

    useLayoutEffect(()=>{
        console.log("hi3")
        formatData()
    },[pieChartData])

    const [insetWidth, setInsetWidth] = useState(0);
    const [insetColor, setInsetColor] = useState<string>("#ffffff");
    const width = Dimensions.get('window').width * 0.90
    const height = 10 * pieChartData.length
    return (
        <View style={{ height:300}}>
        <PolarChart
            data={data}
            colorKey={"color"}
            valueKey={"currentSpent"}
            labelKey={"name"}
          >
           <Pie.Chart>
              {({ slice }) => {
                return (
                  <>
                    <Pie.Slice>
                     
                        <Pie.Label  color={"white"} />
                      
                      
                    </Pie.Slice>

                    <Pie.SliceAngularInset
                      angularInset={{
                        angularStrokeWidth: insetWidth,
                        angularStrokeColor: insetColor,
                      }}
                    />
                  </>
                );
              }}
            </Pie.Chart>
          </PolarChart>
          <View style={styles.legendContainer}>
            {data.map(x=> {
                return <View key={x.name} style={styles.labelContainer} ><View style={{...styles.box,backgroundColor:x.color}}></View><Text style={styles.text}>{x.name}({x.percent}%)</Text></View>
            })}
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color:"white"
    },
    box: {
        width:20,
        height:20
    }, 
    legendContainer: {
        display:"flex",
        marginBottom:2,
        marginLeft:10
    },
    labelContainer: {
    
        display:"flex",
        flexDirection:"row",
        gap:2,
        marginBottom:2
    }
})

export default React.memo(PieChartView, (prevProps, nextProps) => {
    return prevProps.pieChartData.length == nextProps.pieChartData.length;
  });
  