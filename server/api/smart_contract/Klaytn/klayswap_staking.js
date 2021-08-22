
const { Token } = require('../../../models/Token')

const { callContract, decodeParameter, getMiningDecimal, getTotalSupply } = require("./functions");

const POOL_VOTING_ADDRESS = "0x71B59e4bC2995B57aA03437ed645AdA7Dd5B1890";
const VKSP_ADDRESS = "0x2f3713f388bc4b8b364a7a2d8d57c5ff4e054830";


// Sub Functions for getUserStakedKSP ----------------------------------------------
async function getUserLockedKSP(USER_ADDRESS){
    return await callContract(VKSP_ADDRESS, 'lockedKSP', [
        {type: 'address',value: USER_ADDRESS}
    ]).then(res => res.result) 
    .then(res => decodeParameter(res, 0, 66, added=false, divided=true))
}
async function getUserVKSP(USER_ADDRESS){
    return await callContract(VKSP_ADDRESS, 'balanceOf', [
        {type: 'address',value: USER_ADDRESS}
    ]).then(res => res.result) 
    .then(res => decodeParameter(res, 0, 66, added=false, divided=true)) 
}

async function findMinableKSP(USER_ADDRESS){
    const [miningIndex, lastIndex] = await Promise.all([
        callContract(VKSP_ADDRESS, 'miningIndex')
            .then(res => res.result) 
            .then(res => decodeParameter(res, 0, 66, added=false, divided=true)), 
        callContract(VKSP_ADDRESS, 'userLastIndex', [
            {type: 'address',value: USER_ADDRESS}
        ]).then(res => res.result) 
        .then(res => decodeParameter(res, 0, 66, added=false, divided=true))
    ]) 
    return miningIndex - lastIndex; 
};

async function getRewardedKSP(USER_ADDRESS) { 
    return await callContract(VKSP_ADDRESS, 'userRewardSum',[
        {type: 'address',value: USER_ADDRESS}
    ]).then(res => res.result) 
    .then(res => decodeParameter(res, 0, 66, added=false, divided=true))
}

async function findAPRofKSP(){

    let emissionRatePerBlock = 1;
    let secondsInDay = 60 * 60 * 24;
    let dayInYear = 365;
    const [mining_decimal, tutal_supply] = await Promise.all([
        getMiningDecimal(VKSP_ADDRESS), 
        getTotalSupply(VKSP_ADDRESS) 
    ]); 
    let oneYearLockUpIncentiveRatio = 4;
    let allocationRateInStaking = mining_decimal / 10000;
    let apr = emissionRatePerBlock * allocationRateInStaking * secondsInDay * dayInYear * oneYearLockUpIncentiveRatio / tutal_supply * 100;
    return apr;
};
// End ------- Sub Functions for getUserStakedKSP ----------------------------------------------


// Sub Functions for getUserVotingPool ----------------------------------------------
async function getVotingPool(USER_ADDRESS, atype, idx){
    return await callContract(POOL_VOTING_ADDRESS, 'userVotingPool' + atype, [
        {type: 'address', value: USER_ADDRESS}, 
        {type: 'uint256', value: idx}
    ]).then(res => res.result)
    .then(res => atype === 'Address' ? 
                '0x' + res.substring(26, 66) : 
                decodeParameter(res, 0, 66, added=false, divided=true)
    )
}

async function getCurrentIndex(address, index_type) { 
    return await callContract(POOL_VOTING_ADDRESS, index_type, [
        {type: 'address',value: address}
    ]).then(res => res.result) 
    .then(res => decodeParameter(res, 0, 66, added=false, divided=false)); 
}

async function getLastIndex(address, index_type, USER_ADDRESS){
    return await callContract(POOL_VOTING_ADDRESS, index_type, [
        {type: 'address', value: address}, 
        {type: 'address', value: USER_ADDRESS}
    ]).then(res => res.result) 
      .then(res => decodeParameter(res, 0, 66, added=false, divided=false))
}

async function findMinableRewardToken(address, amount, index_type, USER_ADDRESS) { 
    let [currentIndex, lastIndex] = await Promise.all([
        getCurrentIndex(address, 'marketIndex' + index_type), 
        getLastIndex(address, 'userLastIndex' + index_type, USER_ADDRESS)
    ]); 
    return (currentIndex - lastIndex) * amount;
}

async function getRewardedToken(address, index_type, USER_ADDRESS) { 
    return await callContract(POOL_VOTING_ADDRESS, 'userRewardSum' + index_type, [
        {type: 'address',value: address}, {type: 'address',value: USER_ADDRESS}
    ]).then(res => res.result) 
    .then(res => decodeParameter(res, 0, 66, added=false, divided=false))
}
// End ------- Sub Functions for getUserVotingPool ----------------------------------------------


// Main Functions ----------------------------------------------
async function getUserStakedKSP(USER_ADDRESS) { 
    let [KSP_TOKEN, locked_ksp, vksp_num, minable_ksp, rewarded_ksp, ksp_APR] = await Promise.all([
        Token.findOne({network: 'Klaytn', token: 'KSP'}), 
        getUserLockedKSP(USER_ADDRESS), 
        getUserVKSP(USER_ADDRESS), 
        findMinableKSP(USER_ADDRESS), 
        getRewardedKSP(USER_ADDRESS), 
        findAPRofKSP() 
    ])
    minable_ksp *= vksp_num; 
    let locked_ksp_price = locked_ksp * KSP_TOKEN.price; 
    let minable_ksp_price = minable_ksp * KSP_TOKEN.price; 
    let rewarded_ksp_price = rewarded_ksp * KSP_TOKEN.price; 

    return { 
        locked_ksp, 
        locked_ksp_price, 
        vksp_num,
        minable_ksp, 
        minable_ksp_price, 
        rewarded_ksp, 
        rewarded_ksp_price, 
        ksp_APR, 
        total_price: locked_ksp_price + minable_ksp_price
    }
}


async function getUserVotingPool(USER_ADDRESS) { 

    const tokens = await Token.find({network: 'Klaytn'}); 
    const KSLP_TOKEN = tokens.filter(token => token.atype === 'LP'); 
    const SINGLE_TOKEN = tokens.filter(token => token.atype === 'SINGLE')
                               .reduce((obj, t) => Object.assign(obj, {[t.token]: t}), {}); 

    const TOKEN_ADDRESS = KSLP_TOKEN.reduce((obj, t) => Object.assign(obj, {[t.address]: t}), {}); 


    const idxArr = Array.from({length: 65}, (_, i)=> i)
    const arrPromises = idxArr.map(async function(idx) { 
        const [votingpool_address, votingpool_amount] = await Promise.all([
            getVotingPool(USER_ADDRESS, 'Address', idx), 
            getVotingPool(USER_ADDRESS, 'Amount', idx)
        ])
        if (votingpool_address <= 0 || !TOKEN_ADDRESS[votingpool_address]) return {vksp_amount: 0};
        
        let [minable_tokenA, minable_tokenB, rewarded_tokenA, rewarded_tokenB] = await Promise.all([
            findMinableRewardToken(votingpool_address, votingpool_amount, 'A', USER_ADDRESS), 
            findMinableRewardToken(votingpool_address, votingpool_amount, 'B', USER_ADDRESS), 
            getRewardedToken(votingpool_address, 'A', USER_ADDRESS), 
            getRewardedToken(votingpool_address, 'B', USER_ADDRESS), 
        ])
        const { token: token_name } = TOKEN_ADDRESS[votingpool_address]; 
        const [tokenA_name, tokenB_name] = token_name.split("_"); 

        if (!SINGLE_TOKEN[tokenA_name] || !SINGLE_TOKEN[tokenB_name]) return {vksp_amount: 0};
        
        minable_tokenA /= Math.pow(10, SINGLE_TOKEN[tokenA_name].decimal);
        rewarded_tokenA /= Math.pow(10, SINGLE_TOKEN[tokenA_name].decimal);

        minable_tokenB /= Math.pow(10, SINGLE_TOKEN[tokenB_name].decimal);
        rewarded_tokenB /= Math.pow(10, SINGLE_TOKEN[tokenB_name].decimal);

        let minable_price = minable_tokenA * SINGLE_TOKEN[tokenA_name].price + minable_tokenB * SINGLE_TOKEN[tokenB_name].price; 
        let rewarded_price = rewarded_tokenA * SINGLE_TOKEN[tokenA_name].price + rewarded_tokenB * SINGLE_TOKEN[tokenB_name].price; 

        return {
            address: votingpool_address, 
            token: token_name, 
            vksp_amount: votingpool_amount, 
            minable_tokenA, 
            minable_tokenB,
            minable_price,  
            rewarded_tokenA, 
            rewarded_tokenB, 
            rewarded_price, 
            
        }; 
    })
    let total_rewarded = await Promise.all(arrPromises).catch(err => console.log(err)); 
    return total_rewarded.filter(token => token.vksp_amount > 0); 
}


async function staticsUserStakingPool(USER_ADDRESS) { 
    const [locked_ksp_result, voting_pool_result] = await Promise.all([
        getUserStakedKSP(USER_ADDRESS), getUserVotingPool(USER_ADDRESS) 
    ]);

    let {
        locked_ksp_price: total_price, 
        minable_ksp_price: minable_price, 
        rewarded_ksp_price: rewarded_price, 
        ksp_APR: apr 
    } = locked_ksp_result; 

    voting_pool_result.forEach(staking_pool => { 
        let {
            minable_price: elem_minable, 
            rewarded_price: elem_rewarded 
        } = staking_pool; 

        minable_price += elem_minable; 
        rewarded_price += elem_rewarded; 

    }) 
    total_price += minable_price; 
    return {
        total_price, 
        minable_price, 
        rewarded_price, 
        avg_apr: apr
    }; 
}

module.exports = { getUserStakedKSP, getUserVotingPool, staticsUserStakingPool }; 