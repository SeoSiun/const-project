// import "./styles.css";
import React, {useState} from 'react'; 
import { Line } from "react-chartjs-2";

const borderColor = {
  netWorth: "rgba(149, 191, 255, 1)",
  totalAssets: "rgba(188, 188, 188, 1)",
  totalDebts: "rgba(250, 198, 14, 1)"
};

const backgroundColor = {
  netWorth: "rgba(149, 191, 255, 0.2)",
  totalAssets: "rgba(188, 188, 188, 0.2)",
  totalDebts: "rgba(250, 198, 14, 0.2)"
};

function LineChart(props) { 
  return (
    <div>
      <Line 
        data={
          {
            labels: ['1/5', '1/10', '1/15', '1/20'],
            datasets: [
              {
                label: "First dataset",
                data: [33, 85, 41, 65],
                fill: true,
                backgroundColor: backgroundColor[props.summaryType],
                borderColor: borderColor[props.summaryType],
                pointRadius: 1,
                pointHoverRadius: 1
              }
            ]
          }
        }
        options={{
          legend: {
            display: false
          }, 
          scales: {
            xAxes: [{
              gridLines: {display:false}
            }],
            yAxes: [{
              ticks: {display: false}, 
              gridLines: {display:false}
            }]
          }
        }}
      />
    </div>
  );
}

export default LineChart;
