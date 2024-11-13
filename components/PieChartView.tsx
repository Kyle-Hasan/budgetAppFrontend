import { Pie, PolarChart } from "victory-native";
import { Platform, View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie as WebPie } from 'react-chartjs-2';
import "./pieChartWeb.css"
ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartDataFormat = {
    name: string;
    currentSpent: number;
    color: string;
    percent?: string;
};

interface PieChartViewProps {
    pieChartData: PieChartDataFormat[];
}

const PieChartView: React.FC<PieChartViewProps> = ({ pieChartData }) => {
    const [data, setData] = useState<PieChartDataFormat[]>([]);

   
    const formatData = () => {
        const temp = pieChartData.filter((x) => x.currentSpent > 0);
        const totalSum = temp.reduce((total, current) => total + current.currentSpent, 0);
        const colors = new Set<string>();
        
        const formattedData = temp.map((x) => {
            let color = getRandomColor();
            while (colors.has(color)) {
                color = getRandomColor();
            }
            colors.add(color);

            return {
                ...x,
                percent: ((x.currentSpent / totalSum) * 100).toFixed(2),
                color,
            };
        });

        setData(formattedData);
    };

    useEffect(() => {
        formatData();
    }, [pieChartData]);

    const webData = {
        labels: data.map((x) => x.name),
        datasets: [
            {
                data: data.map((x) => x.currentSpent),
                backgroundColor: data.map((x) => x.color || '#000'),
            },
        ],
    };

    const webOptions = {
        plugins: {
            legend: {
                display: false, 
            },
        },
    };

    return (
        <View style={{ height: 300 }}>
            {Platform.OS === 'web' ? (
                <WebPie data={webData} options={webOptions} className="chart" />
            ) : (
                <PolarChart
                    data={data}
                    colorKey="color"
                    valueKey="currentSpent"
                    labelKey="name"
                >
                    <Pie.Chart>
                        {({ slice }) => (
                            <>
                                <Pie.Slice>
                                    <Pie.Label color="white" />
                                </Pie.Slice>
                                <Pie.SliceAngularInset angularInset={{ angularStrokeWidth: 0,angularStrokeColor:"white" }} />
                            </>
                        )}
                    </Pie.Chart>
                </PolarChart>
            )}
            <View style={styles.legendContainer}>
                {data.map((x) => (
                    <View key={x.name} style={styles.labelContainer}>
                        <View style={{ ...styles.box, backgroundColor: x.color }} />
                        <Text style={styles.text}>
                            {x.name} ({x.percent}%)
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Utility function to generate random colors
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
}

const styles = StyleSheet.create({
    text: { color: "white" },
    box: { width: 20, height: 20 },
    legendContainer: { display: "flex", marginBottom: 2, marginLeft: Platform.OS == "web" ? "35%" : 10 },
    labelContainer: { display: "flex", flexDirection: "row", gap: 2, marginBottom: 2 },
});

export default React.memo(PieChartView, (prevProps, nextProps) => {
    return prevProps.pieChartData.length === nextProps.pieChartData.length;
});
