import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function DoughnutChart(props) { 

  const tokens = props.data;

  //task2

  let labels = [];
  let values = [];
  if (tokens) {

    const argumentsArray = Array.from(tokens); //sort를 사용하기위해 배열로 정보 복사
    argumentsArray.sort((a, b) => 
    {
       if (a.amount < b.amount) 
        return 1; 
       if (a.amount > b.amount) 
        return -1; 

      return 0;
     });
    for (const [key, value] of Object.entries(argumentsArray)) {
      labels.push(value.token);
      values.push(value.amount);
    }
    if(values.length > 4)
    {
      labels[4] = "OTHERS";
      for(var i = 5;i<values.length;i++) //크기가 가장큰 4개의 항목 이외의 값들 => other
      {
            values[4] += values[i];
      }
      labels = labels.slice(0,5);
      values = values.slice(0,5);
    }
  } else{ 
    labels = ['1','2','3','4']; //디파이 이름
    values = [1, 2, 3, 4];     //도넛의 비율
  }

  let data = {
    labels: labels, 
    datasets: [
      {
        data: values, 
        backgroundColor: [
          '#8EB2FF',
          '#6B69F7',
          '#B095FF',
          '#D2D2D2',
          '#6699FF' //other
        ], 
        borderWidth: 1,
        legend: { 
          display: true, 
          position: 'right'
        },
        options: {
          gridLines: {
            display: false,
            drawOnChartArea: false
          }, 
          legend: { 
            display: true, 
            position: 'right'
          }
        }
      }
    ]
  }

  return (
    <Doughnut 
      data={data}
      legend={{
        display: true, 
        position: 'right', 
        generateLabels: function(chart) {
          let data = chart.data;
          if (data.labels.length) {
            return data.labels.map(function(label, i) {
              let ds = data.datasets[0];
                return {
                text: `${label}: ${ds.data[i]}`,
                index: i
              };
            })
          }
          return [];
        }
      }}

      options={{
        legend: {
          display: true,
          position: 'right'}
      }}

    />
  )
}

export default DoughnutChart;