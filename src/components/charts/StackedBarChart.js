// import "./styles.css";
import React, {useState} from 'react'; 
import { Line } from "react-chartjs-2";
import { Row, Col } from 'react-bootstrap'; 


function StackedBarChart(props) { 
  const data = [
    {
      color: "#7492FC",
      ratio: 2,
      value: 0,
      label: "지갑"
    },
    {
      color: "#A2B9FC",
      ratio: 1,
      value: 0,
      label: "파밍"
    },
    {
      color: "#C1D0FE",
      ratio: 1,
      value: 0,
      label: "스테이킹"
    },
  ];

  // const data = {
  //   colors: [ "#7492FC", "#A2B9FC" ,"#C1D0FE" ],  // 지갑, 파밍, 스테이킹
  //   ratios: [ 1, 1, 1 ],
  //   values: [ 0, 0, 0 ],
  // };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 5px', fontSize: '0.8em' }}>
        { data.map(each => {
          return (
            <div style={{ flex: each.ratio, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ height: '15px', backgroundColor: each.color }}> </div>
            </div>
            );
        }) }
      </div>
      <div style={{ width: '100%', margin: '20px auto 10px', display: 'flex', flexDirection: 'row' }}>
      {
        data.map(each => {
          return (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-block', width: '0.7em', height: '0.7em', backgroundColor: each.color, marginRight: '10px' }}></div>
              <span style={{ color: '#828282', marginRight: '5px' }}>{ each.label }</span><span style={{ color: '#4F4F4F', fontWeight: '600' }}>{`${each.value} %` }</span>
            </div>
          );
        })
      }
      </div>
    </>
  );
}

export default StackedBarChart;
