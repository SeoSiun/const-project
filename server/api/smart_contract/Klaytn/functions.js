const CaverExtKAS = require('caver-js-ext-kas');
const caver = new CaverExtKAS();

const access_key_array = ["KASKQO63SLJW75Q0FJB61B4N", "KASKBDIFAXVXK14IEVRJDFVS", "KASKQOPVI2ZMJW4UM1VV871R"]; //  
const ACCESS_KEY = access_key_array[1]; 

const private_key_array = ["QAXbYjYlXCf5BAgax7Dm-C0j-kk8RRcW0yfJYNcH", "xW5VfL4rS6lOuEENPBs5jt0UeVDYMxgRIA14EAoS",
                            "LdvsS4SJUFLPgS8-a_6vE177NI2hIJmojVeII4tr"]; 
const PRIVATE_KEY = private_key_array[1]; 

caver.initKASAPI(8217, ACCESS_KEY, PRIVATE_KEY);

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider());

const KSLP_DECIMAL = 1e18;

async function callContract(contract_address, method, USER_DATA=null){
    if(!USER_DATA){
        return await caver.kas.wallet.callContract(contract_address, method);
    }
    return await caver.kas.wallet.callContract(contract_address, method, USER_DATA);
};

function decodeParameterSimple(astring) { 
    return web3.eth.abi.decodeParameter("uint256", astring); 
}
  
function decodeParameter(astring, start_str, end_str, added=true, divided=true) { 
    let param_string = astring.substring(start_str, end_str); 
    if (added) param_string = '0x' + param_string;
    let result = decodeParameterSimple(param_string); 
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

//사용자의 자산이 예치되어있는 모든 pool을 조회하고 해당 pool에서 지금 수령이 가능한 보상을 출력합니다.
async function minableRewardKSPNow(address, USER_DATA, LPBalance_num){

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

async function caverGetBalance(address) { 
    return await caver.rpc.klay.getBalance(address); 
}

async function isAddress(address) { 
    return await caver.utils.isAddress(address); 
}

module.exports = { callContract, decodeParameter, decodeParameterSimple, 
    getCurrentPool, getTotalSupply, getMiningDecimal, minableRewardKSPNow, 
    caverGetBalance, isAddress }; 