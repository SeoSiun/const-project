

const CaverExtKAS = require('caver-js-ext-kas');
const caver = new CaverExtKAS();
const ACCESS_KEY = "KASKQO63SLJW75Q0FJB61B4N";//"KASKBDIFAXVXK14IEVRJDFVS"; 
const PRIVATE_KEY = "QAXbYjYlXCf5BAgax7Dm-C0j-kk8RRcW0yfJYNcH";//"xW5VfL4rS6lOuEENPBs5jt0UeVDYMxgRIA14EAoS";  
caver.initKASAPI(8217, ACCESS_KEY, PRIVATE_KEY);

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider());//'http://localhost:8551'

const { Token } = require('../../../models/Token')

const KSLP_DECIMAL = 1e18; //klay, ksp의 decimal 값도 동일함 => 혼용해서 사용예정

async function callContract(contract_address, method, USER_DATA=null){
  if(!USER_DATA){
    return await caver.kas.wallet.callContract(contract_address, method);
  }
  return await caver.kas.wallet.callContract(contract_address, method, USER_DATA);
};

function decodeParameter(astring, start_str, end_str, added=true, divided=true) { 
  let param_string = astring.substring(start_str, end_str); 
  if (added) param_string = '0x' + param_string;
  let result = web3.eth.abi.decodeParameter("uint256", param_string); 
  if (divided) result /= KSLP_DECIMAL; 
  return result;
}

async function getCurrentPool(address) { 
  return callContract(address, 'getCurrentPool')
          .then(res => res.result)
          .then(current_pool => [
            decodeParameter(current_pool, 0, 66, added=false, divided=false),
            decodeParameter(current_pool, 66, 132, added=true, divided=false)
            // decodeParameter(current_pool, 66, 132, added=true, divided=false) * KSLP_DECIMAL // 왜 1e18을 곱해야 올바른 값이 나올까요...
          ])
};

async function getTotalSupply(address) { 
  return callContract(address, 'totalSupply')
          .then(res => res.result)
          .then(total_supply => decodeParameter(total_supply, 0,66, added=false, divided=true))
}

async function getMiningDecimal(address) { 
  return callContract(address, 'mining', null)
          .then(res => res.result)
          .then(res => decodeParameter(res, 0, 66, added=false, divided=false))
}

//단일 예치되어 있는 경우는 따로 계산합니다.
//단일예치에 한에서만 deposit, total earned, minable, apr 모두 아래 함수가 한번에 알려줍니다.
async function depositOnlyKLAY(USER_DATA){

  try {
    let _token_query = ['KLAY', 'SKLAY', 'KSP']; 
    _token_query = _token_query.map( (token) => {return {token} });
    let token_price = await Token.find({ $or:_token_query})
                                 .then(tokens => tokens.reduce((obj, t) => Object.assign(obj, { [t.token]: t.price}), {}))
    
    const SINGLE_DEPOSIT_LP_CONTRACT_ADDRESS = "0xcebc9bd990d03423eb77359d56259c6e8c5638a4";
    const KLAY_SKLAY_LP_CONTRACT_ADDRESS = "0x073fde66b725d0ef5b54059aca22bbfc63a929ce";

    const user_stat = await callContract(SINGLE_DEPOSIT_LP_CONTRACT_ADDRESS, '_getUserStat', USER_DATA)
                                .then(res => res.result);
     let singleDepositLPBalance_decimal = decodeParameter(user_stat, 66, 130);
    //  if (singleDepositLPBalance_decimal < 1) return false; 
    
     // 단일 예치된 자산이 있는지 LP 잔고로 확인 후 deposit, total earned, minable, apr 값을 반환합니다.
    let deposited = decodeParameter(user_stat, 130, 194); // 예치된 klay 개수
    let earned = decodeParameter(user_stat, 386, 450); // 해당 풀에서 지금까지 claim한 KSP

    const miningIndex_decimal = await callContract(KLAY_SKLAY_LP_CONTRACT_ADDRESS, 'miningIndex')
                                        .then(res => res.result)
                                        .then(res => decodeParameter(res, 0, 66, added=false, divided=false)); 

    let lastIndex_decimal = decodeParameter(user_stat, 450, 514, divided=false);

    let minable = (miningIndex_decimal - lastIndex_decimal) * (singleDepositLPBalance_decimal);
    minable /= KSLP_DECIMAL;// 해당 풀에서 현재 claim 가능한 KSP

    let tokenAName = "KLAY";
    let tokenBName = "SKLAY";

    let [current_pool, total_supply, mining_decimal] = await Promise.all([
      getCurrentPool(KLAY_SKLAY_LP_CONTRACT_ADDRESS), 
      getTotalSupply(KLAY_SKLAY_LP_CONTRACT_ADDRESS), 
      getMiningDecimal(KLAY_SKLAY_LP_CONTRACT_ADDRESS)
    ]); 
    
    let [tokenA_decimal, tokenB_decimal] = current_pool; 

    const KLAY_DECIMAL = 1e18;
    tokenA_decimal /= KLAY_DECIMAL;
    tokenB_decimal /= KLAY_DECIMAL;
    
    let tokenAInSingleLP = tokenA_decimal / total_supply;
    let tokenBInSingleLP = tokenB_decimal / total_supply;

    
    let tokenAInSingleLP_price = tokenAInSingleLP * token_price[tokenAName];
    let tokenBInSingleLP_price = tokenBInSingleLP * token_price[tokenBName];
    let singleLP_price = tokenAInSingleLP_price + tokenBInSingleLP_price;

    let apr = (Math.floor((mining_decimal/10000) * 86400) * token_price.KSP * 365)
                / (total_supply * singleLP_price) * 100;
    apr = Math.floor(apr * 1e2) / 1e2;
    return { deposited, earned, minable, apr };
      
  }catch(err){
    console.error(err);
  }
};

//사용자의 자산이 예치되어있는 모든 pool에 대해 여태까지 수령한 보상의 총 합을 출력합니다.
async function getEarnedReward(USER_ADDRESS){
    const USER_DATA = [
        {
            type: 'address',
            value: USER_ADDRESS,
        }
    ]
    const tokens = await Token.find({network: 'Klaytn'}); 
    const KSLP_TOKEN = tokens.filter(token => token.atype === 'LP'); 

    const arrayPromises = KSLP_TOKEN.map(async function(lp_token) { 
            let { token:token_name, address } = lp_token; 
            let res = await callContract(address, 'userRewardSum', USER_DATA)
                                .then(res => res.result) 
                                .then(res => decodeParameter(res, 0, 66, added=false, divided=true))
            return {token: token_name, value: res}; 
    }); 
    let total_rewarded = await Promise.all(arrayPromises);
    return total_rewarded.filter(token => token.value > 0);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//사용자의 자산이 예치되어있는 모든 pool을 조회하고 해당 pool에서 지금 수령이 가능한 보상을 출력합니다.
async function minableRewardKSPNow(address, LPBalance_num, USER_DATA){

    const promise_minable_reward_lastIdx = callContract(address, 'userLastIndex', USER_DATA)
                                                .then(res => res.result)
                                                .then(res => decodeParameter(res, 0, 66, added=false, divided=false));
    const promise_minable_reward_miningIdx = callContract(address, 'miningIndex')
                                                .then(res => res.result)
                                                .then(res => decodeParameter(res, 0, 66, added=false, divided=false));
    let [minable_reward_lastIdx, minable_reward_miningIdx] = await Promise.all([
        promise_minable_reward_lastIdx, promise_minable_reward_miningIdx
    ]); 

    // 계산방법은 (current - last) * 현재 KSLP balance
    let reward_ksp = (minable_reward_miningIdx - minable_reward_lastIdx) * LPBalance_num / KSLP_DECIMAL ; 
    return reward_ksp; 
};

//전체 klayswap pool 중에 사용자가 자산을 예치한 풀을 추출합니다.
// async function identifyPool(USER_DATA, contract_address, decimal){
async function identifyPool(USER_ADDRESS) {

    const USER_DATA = [
        {
            type: 'address',
            value: USER_ADDRESS,
        }
    ]
    const tokens = await Token.find({network: 'Klaytn'}); 
    const KSLP_TOKEN = tokens.filter(token => token.atype === 'LP'); 
    let SINGLE_TOKEN = tokens.filter(token => token.atype === 'SINGLE'); 
    SINGLE_TOKEN = SINGLE_TOKEN.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {})

    const ksp_price = SINGLE_TOKEN.KSP.price; 

    const arrayPromises = KSLP_TOKEN.map( async function(lp_token) { 
        let { token:token_name, address, decimal } = lp_token; 
        let lp_decimal = KSLP_DECIMAL; 
        if (decimal && decimal !== 18) lp_decimal = Math.pow(10, decimal);  
        
        let LPBalance_num = await callContract(address, 'balanceOf', USER_DATA)
                                    .then(res => res.result)
                                    .then(res => web3.eth.abi.decodeParameter("uint256", res) / lp_decimal); 
        // LPBalance_num = LPBalance_num > 0 ? Number(LPBalance_num.toFixed(6)) : 0;
        if (LPBalance_num <= 0) return {token: token_name, value: LPBalance_num};
        let [tokenA_name, tokenB_name] = token_name.split('_'); 
        if (!SINGLE_TOKEN[tokenA_name] || !SINGLE_TOKEN[tokenB_name]) {
        return {token: token_name, value: LPBalance_num};
        }

        let [current_pool, total_supply, mining_decimal, minable_reward_ksp] = await Promise.all([ 
        getCurrentPool(address), getTotalSupply(address), getMiningDecimal(address), minableRewardKSPNow(address, LPBalance_num) ]); 
        let tokenA_decimal = current_pool[0] / Math.pow(10, SINGLE_TOKEN[tokenA_name].decimal); 
        let tokenB_decimal = current_pool[1] / Math.pow(10, SINGLE_TOKEN[tokenB_name].decimal); 

        if (decimal && decimal !== 18) {
        // tokenA_decimal /= Math.pow(10, 18 - decimal);
        // tokenB_decimal /= Math.pow(10, 18 - decimal);
        total_supply *= Math.pow(10, 18-decimal);  // Not sure, temporary debugging...
        }
        let tokenA_num = tokenA_decimal / total_supply * LPBalance_num;
        let tokenB_num = tokenB_decimal / total_supply * LPBalance_num;
        let tokenA_price = tokenA_num * SINGLE_TOKEN[tokenA_name].price;
        let tokenB_price = tokenB_num * SINGLE_TOKEN[tokenB_name].price;
        let total_price = tokenA_price + tokenB_price; 

        // find APR ( ONLY APR of KSP reward )
        let total_LP_price = tokenA_decimal * SINGLE_TOKEN[tokenA_name].price + tokenB_decimal * SINGLE_TOKEN[tokenB_name].price;
        let apr = (Math.floor((mining_decimal/10000) * 86400) * ksp_price*365) / (total_LP_price) * 100;
        apr = Number(apr.toFixed(2)); 
        // apr = Math.floor(apr * 1e2)/1e2;

        if (decimal && decimal !== 18) {
        minable_reward_ksp /= Math.pow(10, 18-decimal);  // Not sure, temporary debugging...
        }

        return {
        token: token_name, value: LPBalance_num, 
        tokenA_num, tokenB_num, 
        tokenA_price, tokenB_price, 
        total_price, 
        minable_reward_ksp, 
        apr
        }; 
    })
    let total_pool = await Promise.all(arrayPromises).catch(err => console.log(err));
    return total_pool.filter(token => token.value > 0);
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// async function main(){

//     //사용자 정보
//     // const USER_ADDRESS = "0xe30d11D8f97755ef528e5Ff7a25296c528eE607A";//example "0x41C542F3c3eB1687e835B98AAa0b00447F355e1B";//
//     // const USER_ADDRESS = "0x330384d4299ca1Fec3B0487Cd72a0b249464161b";
//     // const USER_DATA = [
//     //   {
//     //     type: 'address',
//     //     value: USER_ADDRESS,
//     //   },
//     // ];

//     const tokens = await Token.find({network: 'Klaytn'}); 
//     const KSLP_TOKEN = tokens.filter(token => token.atype === 'LP'); 
//     let SINGLE_TOKEN = tokens.filter(token => token.atype === 'SINGLE'); 
//     SINGLE_TOKEN = SINGLE_TOKEN.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {})

//     let res = await identifyPool(USER_DATA, KSLP_TOKEN, SINGLE_TOKEN);
//     console.log("res: ", res); 

//     let singleDeposit = await depositOnlyKLAY(USER_DATA);
//     console.log('singleDeposit: ', singleDeposit); 

//     let earned_reward = await getEarnedReward(KSLP_TOKEN, USER_DATA);
//     console.log(earned_reward); 
// };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { identifyPool, depositOnlyKLAY, getEarnedReward }; 