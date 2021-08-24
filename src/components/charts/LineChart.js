// import "./styles.css";
import React, {useState} from 'react'; 
import { Line } from "react-chartjs-2";

const color = {
  netWorth: ["221, 232, 252", "rgba(116, 146, 252, 1)"],
  totalAssets: ["224, 224, 224", "rgba(130, 130, 130, 1)"],
  totalDebts: ["255, 230, 179", "rgba(255, 175, 49, 1)"],
  getColor: function(summaryType, a) {
    return "rgba(" + this[summaryType][0] + ", " + a + ")";
  },
  getPointColor: function(summaryType) {
    return this[summaryType][1];
  }
}

function LineChart({ summaryType = "netWorth" }) { 
  const data = [33, 85, 41, 65];

  function getPointColor(ctx) {
    var index = ctx.dataIndex;
    return index === data.length-1 ? color.getPointColor(summaryType) : 'transparent';
  }
  function getPointBorderColor(ctx) {
    var index = ctx.dataIndex;
    return index === data.length-1 ? color.getColor(summaryType, 0.3) : 'transparent';
  }

  return (
    <div>
      <Line 
        data={
          {
            labels: ['1/5', '1/10', '1/15', '1/20'],
            datasets: [
              {
                label: "First dataset",
                data: data,
                fill: true,
                lineTension: 0,
                backgroundColor: color.getColor(summaryType, 1),
                borderColor: color.getColor(summaryType, 1),
                borderWidth: 0.2,

                pointBackgroundColor: getPointColor,
                pointRadius: 5,
                pointHoverRadius: 5,

                pointBorderColor : getPointBorderColor,
                pointBorderWidth: 21,
                pointHoverBorderWidth: 21
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
              display: false,
              gridLines: {display:false}
            }],
            yAxes: [{
              ticks: {display: false}, 
              gridLines: {display:false}
            }]
          },
          layout: {
            padding: {
                right: 100,
                top: 60
            } 
          }
        }}
      />
    </div>
  );
}

export default LineChart;