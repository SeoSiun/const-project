// import "./styles.css";
import React, {useState} from 'react'; 
import { Line } from "react-chartjs-2";

function convertPercentage(val, total) { 
  return (val/total).toFixed(4) * 100; 
}

function StackedBarChart(props) { 
  const { total_price, wallet, farming, staking } = props.summaryInfo; 

  console.log(total_price, wallet, farming, staking); 

  const data = [
    {
      color: "#7492FC",
      ratio: convertPercentage(wallet.total_price, total_price),
      value: convertPercentage(wallet.total_price, total_price),
      label: "지갑"
    },
    {
      color: "#A2B9FC",
      ratio: convertPercentage(farming.total_price, total_price),
      value: convertPercentage(farming.total_price, total_price),
      label: "파밍"
    },
    {
      color: "#C1D0FE",
      ratio: convertPercentage(staking.total_price, total_price),
      value: convertPercentage(staking.total_price, total_price),
      label: "스테이킹"
    },
  ];

  // const data = {
  //   colors: [ "#7492FC", "#A2B9FC" ,"#C1D0FE" ],  // 지갑, 파밍, 스테이킹
  //   ratios: [ 1, 1, 1 ],
  //   values: [ 0, 0, 0 ],
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 5px', fontSize: '0.8em' }}>
      {/* <h4>바 차트 넣을거야</h4> */}
      { data.map(each => {
        return (
          <div style={{ flex: each.ratio, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '15px', backgroundColor: each.color }}> </div>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ width: '0.7em', height: '0.7em', backgroundColor: each.color, marginRight: '5px' }}></div>
            <span style={{ color: '#828282', marginRight: '5px' }}>{ each.label }</span><span style={{ color: '#4F4F4F', fontWeight: '600' }}>{`${each.value} %` }</span>
            </div>
          </div>
          );
      }) }
    </div>
  );
}

export default StackedBarChart;
