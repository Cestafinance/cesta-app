import React, { useEffect, useState } from "react";
import { getStrategyChartData } from "../../Services/contracts";
import { getChartSeries, getLineChartCategorise} from "../../Util/chartUtil";
import CircularProgress from '@mui/material/CircularProgress';
import Chart from 'react-apexcharts';
import { Typography } from "@mui/material";

const TICK_AMOUNT = {
    "7d": 7,
    "30d": 15,
    "6m": 15,
    "1y": 15
}

function LoadingContainer(){
    return <div style={{minHeight: "390px", display: "flex", alignItems:"center", justifyContent: "center", flexDirection: "column"}}>
        <CircularProgress color="primary" />
        <Typography variant="h5" style={{marginTop: "15px", color: "#ffffff"}}>Loading Chart...</Typography>
    </div> 
}

export default function StrategyChart({
    isExpanded,
    strategyData,
    selectedTimeRange
}) {
    const [chartData, setChartData] = useState([]);
    const [chartCategories, setChartCategories ] = useState([]);
    const [tickAmount, setTickAmount] = useState(7);
    const [loading, setLoading] = useState(false);
   
    useEffect(() => {
        async function getChartData () {
            setLoading(true);
            const strategyId = strategyData.symbol;
            let data = await getStrategyChartData(strategyId, selectedTimeRange);

            if(data.status === 200) {
                data = data.data.chartData;
                
                setChartData(getChartSeries(data));
                setChartCategories(getLineChartCategorise(data));
            }

            setLoading(false);
        }
        if(isExpanded) {
            getChartData();
            setTickAmount(TICK_AMOUNT[selectedTimeRange]);
        }
    }, [isExpanded, selectedTimeRange])

    return loading ? <LoadingContainer/>:  <Chart type={'area'} options={{
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
            foreColor: '#ffffff'
        },
        grid: {
            show: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: "category",
            categories: chartCategories,
            tickAmount: tickAmount, // To reduce or increase the number of label on chart
            labels: {
                rotate: -60
            },
           
           
        },
        yaxis: {
            opposite: true,
            title: {
                text: "Performance(%)",
                rotate: -90,
                offsetX: 0,
                offsetY: 0,
            },
        },
        dataLabels: {
            enabled: false,
        },
        noData: {
            text: undefined,
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: undefined,
                fontSize: '14px',
                fontFamily: undefined,
            },
        },
        }}
        series={chartData}
    />;
}