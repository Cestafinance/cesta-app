import { format } from 'date-fns' 

// Line Chart Serites
export function getChartSeries(data){
    if(!data || data.length <= 0 || data === undefined) {
        return [];
    }

    return data.map((d, index) => {
        const datas = d[1] !== undefined ? d[1].map(e => e[1]) : null;
        return {
            name: d[0], // Series Name
            data: datas, // Data
            color: d[2]
        }
    });
}

// Line Chart Categories
export function getLineChartCategorise(data) {
    if(!data || data.length <= 0 || data === undefined) {
        return [];
    }
    const firstSeriesChartData = data[0][1];
    return firstSeriesChartData.map(c =>  format(c[0], "dd-MM-yyyy"));
}