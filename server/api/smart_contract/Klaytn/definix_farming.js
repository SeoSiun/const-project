const { Token } = require('../../../models/Token'); 

const { 
    callContract, getTotalSupply, abiDecodeParameter, abiDecodeParameters
} = require('./functions'); 

const DEFINIXLP_DECIMAL = 1e18; 
const HERODOTUS_ADDRESS = "0x2afc6d4babcdfba8fad56f7d25c9f930e9c093ad";

const KLAYTN_BLOCK_TIME = 1;
const blocksPerYear = (60 / KLAYTN_BLOCK_TIME) * 60 * 24 * 365; 

async function userLPBalance(poolID, USER_ADDRESS) { 
    return callContract(HERODOTUS_ADDRESS, 'userInfo', [
        {type: 'uint256', value: poolID}, 
        {type: 'address', value: USER_ADDRESS}
    ]).then(res => res.result)
    .then(user_LP_balance => abiDecodeParameters([
        {type : 'uint256', name : 'amount'},
        {type : 'uint256', name : 'debt'}
    ], user_LP_balance))
};

async function pendingFinix(poolID, USER_ADDRESS) { 
    return callContract(HERODOTUS_ADDRESS, 'pendingFinix', [
        {type: 'uint256', value: poolID}, 
        {type: 'address', value: USER_ADDRESS}
    ]).then(res => res.result)
    .then(pending_Finix => abiDecodeParameter(pending_Finix))
};

//LP에 대한 totalsupply는 똑같이 사용
//LP에 대한 decimal 값은 미리 저장
async function ratioOfHerodotus(pool_address) { 
    return callContract(pool_address, 'balanceOf', [{type: 'address', 'value': HERODOTUS_ADDRESS}])
            .then(res => res.result)
            .then( ratioOf_Herodotus=> abiDecodeParameter(ratioOf_Herodotus))
};

async function tokenABalanceInLP(token_address, pool_address) { //토큰 주소 넘겨야함
    return callContract(token_address, 'balanceOf', [{type: 'address', 'value': pool_address}])
            .then(res => res.result)
            .then( tokenABalance_InLP=> abiDecodeParameter(tokenABalance_InLP))
};

async function tokenBBalanceInLP(token_address, pool_address) { //토큰 주소 넘겨야함
    return callContract(token_address, 'balanceOf', [{type: 'address', 'value': pool_address}])
            .then(res => res.result)
            .then( tokenBBalance_InLP=> abiDecodeParameter(tokenBBalance_InLP))
};

async function getAllocPoint() { 
    return callContract(HERODOTUS_ADDRESS, 'totalAllocPoint')
            .then(res => res.result)
            .then(total_AllocPoint =>  abiDecodeParameter(total_AllocPoint))
};

async function getFinixPerBlock() { 
    return callContract(HERODOTUS_ADDRESS, 'finixPerBlock')
            .then(res => res.result)
            .then(finix_perBlock => abiDecodeParameter(finix_perBlock))
}
async function poolInfo_allocPoint(pool_id) { 
    return callContract(HERODOTUS_ADDRESS, 'poolInfo', [{type: 'uint256', value: pool_id}])
            .then(res => res.result)
            .then(pool_Info_allocPoint => abiDecodeParameters([
                {type: 'address', name: 'tokenAddress'},
                {type: 'uint256', name: 'allocPoint'},
                {type: 'uint256', name: 'lasRewardBlock'},
                {type: 'uint256', name: 'accFinixPerShare'}
            ], pool_Info_allocPoint))
};

async function getFinixPrice(six_price) { 
    const FINIX_ADDRESS = "0xd51c337147c8033a43f3b5ce0023382320c113aa";
    const SIX_ADDRESS = "0xef82b1c6a550e730d8283e1edd4977cd01faf435";
    const FINIX_SIX_ADDRESS = "0x36C53ecBD87d105E8d2D71984cE4eB4f3f341402";
    let [tokenA_BalanceInLP, tokenB_BalanceInLP] = await Promise.all([ 
        tokenABalanceInLP(FINIX_ADDRESS, FINIX_SIX_ADDRESS), 
        tokenBBalanceInLP(SIX_ADDRESS, FINIX_SIX_ADDRESS), 
    ]); 
    let ratio = tokenB_BalanceInLP / tokenA_BalanceInLP;
    const finix_price = ratio * six_price;
    return finix_price; 
}

////// MAIN FUNCTION 

async function getUserFarmingPool(USER_ADDRESS) {

    const tokens = await Token.find({network: 'Klaytn'}); 

    const DEFINIXLP_TOKEN = tokens.filter(token => token.atype === 'LP' && token.defi === 'DEFINIX'); 
    let SINGLE_TOKEN = tokens.filter(token => token.atype === 'SINGLE'); 
    SINGLE_TOKEN = SINGLE_TOKEN.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {}); // 큰틀에서 배열에서 객체로

    if (SINGLE_TOKEN.FINIX && SINGLE_TOKEN.FINIX.price <= 0) SINGLE_TOKEN.FINIX.price = await getFinixPrice(SINGLE_TOKEN.SIX.price); 

    const arrayPromises = DEFINIXLP_TOKEN.map( async function(lp_token) { 
        let { token:token_name, address, pool_id } = lp_token; 
        
        let user_LPBalance = await userLPBalance(pool_id, USER_ADDRESS)
                                    .then(res => res.amount / DEFINIXLP_DECIMAL)
        if (user_LPBalance <= 0) return {token: token_name, value: user_LPBalance};

        let [tokenA_name, tokenB_name] = token_name.split('_'); 
        
        let tokenA_address = SINGLE_TOKEN[tokenA_name].address;
        let tokenB_address = tokenB_name == "SINGLE" ? tokenA_address : SINGLE_TOKEN[tokenB_name].address; 

        let [ total_supply, pending_Finix, ratioOf_Herodotus, tokenA_BalanceInLP, tokenB_BalanceInLP, totoalAllocPoint, finixPerBlock, poolInfoallocPoint] = await Promise.all([ 
            getTotalSupply(address),
            pendingFinix(pool_id, USER_ADDRESS), 
            ratioOfHerodotus(address),
            tokenABalanceInLP(tokenA_address, address), 
            tokenBBalanceInLP(tokenB_address, address), 
            getAllocPoint(),
            getFinixPerBlock(),
            poolInfo_allocPoint(pool_id)
        ]); 
        
        pending_Finix /= DEFINIXLP_DECIMAL;
        
        let tokenA_decimal;
        let tokenB_decimal;
        let tokenA_num;
        let tokenB_num;
        let tokenA_price;
        let tokenB_price;
        let total_price;

        if(tokenB_name != "SINGLE"){
            ratioOf_Herodotus /= DEFINIXLP_DECIMAL;
            tokenA_decimal = tokenA_BalanceInLP / Math.pow(10, SINGLE_TOKEN[tokenA_name].decimal);
            tokenB_decimal = tokenB_BalanceInLP / Math.pow(10, SINGLE_TOKEN[tokenB_name].decimal);

            tokenA_decimal *= ratioOf_Herodotus / total_supply;
            tokenB_decimal *= ratioOf_Herodotus / total_supply;

            tokenA_num = tokenA_decimal / total_supply * user_LPBalance; 
            tokenB_num = tokenB_decimal / total_supply * user_LPBalance; 

            tokenA_price = tokenA_num * SINGLE_TOKEN[tokenA_name].price;
            tokenB_price = tokenB_num * SINGLE_TOKEN[tokenB_name].price;
            total_price = tokenA_price + tokenB_price; 
        }
        else{
            tokenA_decimal = tokenA_BalanceInLP / Math.pow(10, SINGLE_TOKEN[tokenA_name].decimal);
            tokenA_num = 0;
            tokenA_price = user_LPBalance * SINGLE_TOKEN[tokenA_name].price;
            total_price = tokenA_price;

            tokenB_decimal = 0;
            tokenB_num = 0;
            tokenB_price = 0;
        }
        let minable_reward_finix_price = pending_Finix * SINGLE_TOKEN.FINIX.price; 

        
        
        let apr = 0;
        if(tokenB_name != "SINGLE"){
            apr = Number(poolInfoallocPoint.allocPoint) / totoalAllocPoint * finixPerBlock * blocksPerYear * Number(SINGLE_TOKEN["FINIX"].price) / (2 * Number(tokenB_decimal) * Number(SINGLE_TOKEN[tokenB_name].price) ) * 100;
            apr = apr / 1e15;
        }
        else{
            apr = Number(poolInfoallocPoint.allocPoint) / totoalAllocPoint * finixPerBlock * blocksPerYear  / Number(ratioOf_Herodotus) * Number(SINGLE_TOKEN["FINIX"].price) / Number(SINGLE_TOKEN[tokenA_name].price) * 100000;
        }    
        return {
            token: token_name, value: user_LPBalance, 
            tokenA_num, tokenB_num, 
            tokenA_price, tokenB_price, 
            lp_price: total_price, 
            minable_reward_finix:  pending_Finix, 
            minable_reward_finix_price, 
            total_price: total_price+minable_reward_finix_price, 
            apr
        }; 
    });
    let total_pool = await Promise.all(arrayPromises).catch(err => console.log(err));
    return total_pool.filter(token => token.value > 0);
};

module.exports = { getUserFarmingPool }; 