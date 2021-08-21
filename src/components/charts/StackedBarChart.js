// import "./styles.css";
import React from 'react'; 

function convertPercentage(val, total) {
  const  percentage = total > 0 ? (val/total) * 100 : 0; 
  return percentage.toFixed(2); 
}

function StackedBarChart(props) { 
  const {assetSummaryInfo, farmingSummaryInfo, stakingSummaryInfo} = props; 
  const total_price = assetSummaryInfo.total_price + farmingSummaryInfo.total_price + stakingSummaryInfo.total_price;

  const data = [
    {
      color: "#7492FC",
      ratio: convertPercentage(assetSummaryInfo.total_price, total_price),
      value: convertPercentage(assetSummaryInfo.total_price, total_price),
      label: "지갑"
    },
    {
      color: "#A2B9FC",
      ratio: convertPercentage(farmingSummaryInfo.total_price, total_price),
      value: convertPercentage(farmingSummaryInfo.total_price, total_price),
      label: "파밍"
    },
    {
      color: "#C1D0FE",
      ratio: convertPercentage(stakingSummaryInfo.total_price, total_price),
      value: convertPercentage(stakingSummaryInfo.total_price, total_price),
      label: "스테이킹"
    },
  ];

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
