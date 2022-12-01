import { svg } from 'd3'
import React from 'react';
import * as d3 from 'd3';
import useD3 from '../hooks/useD3'
import { apiData } from '../App';

type Props = {
    apiData:apiData[]
}

function BarChart({apiData}: Props) {
    
//Draw bar chart
    const ref = useD3((svg:any) => {
        //draw pie chart credit amount vs debit amount
        const width = 500;
        const height = 500;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;
        svg.select("#barchart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        const data = apiData;
        const creditAmount = data.map((item) => item.credit_amount);
        const debitAmount = data.map((item) => item.debit_amount);
        const creditAmountSum = creditAmount.reduce((a, b) => a + b, 0);
        const debitAmountSum = debitAmount.reduce((a, b) => a + b, 0);
        const data_ready = [
            { name: "Credit Amount", value: creditAmountSum },
            { name: "Debit Amount", value: debitAmountSum },
        ];
        const color = d3.scaleOrdinal()
        .domain(data_ready.map((d:any) => d.name))
        .range(["#ff0000", "#0000ff"]);
        const pie = d3.pie().value((d:any) => d.value);
        const data_ready_pie = pie(data_ready.map((d:any) => d));
        const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
        svg
        .selectAll('mySlices')
        .data(data_ready_pie)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d:any) => (color(d.data.name)))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        svg
        .selectAll('mySlices')
        .data(data_ready_pie)
        .enter()
        .append('text')
        .text((d:any) => d.data.name)
        .attr("transform", (d:any) => "translate(" + arcGenerator.centroid(d) + ")")
        .style("text-anchor", "middle")
        .style("font-size", 17)
    },[apiData])
return (
        <div>
            <svg ref={ref} width={500} height={500} />
        </div>
    )
}

export default BarChart