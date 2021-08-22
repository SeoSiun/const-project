const { Token } = require('../../../models/Token'); 

const { 
    callContract, abiDecodeParameter
} = require('./functions'); 

const BOARDROOM_ADDRESS = '0x7B566d57Ad1908405bD844E47d87063650845D3b';

async function stakedsKAI(USER_ADDRESS) { 
  return callContract(BOARDROOM_ADDRESS, 'balanceOf', [{type: 'address', value: USER_ADDRESS}])
          .then(res => res.result)
          .then(staked_sKAI => abiDecodeParameter(staked_sKAI))
};
async function earnedKAI(USER_ADDRESS) { 
  return callContract(BOARDROOM_ADDRESS, 'earned', [{type: 'address', value: USER_ADDRESS}])
          .then(res => res.result)
          .then(earned_KAI => abiDecodeParameter(earned_KAI))
};
async function rewardPersKAI() { 
  return callContract(BOARDROOM_ADDRESS, 'rewardPerSKAI')
          .then(res => res.result)
          .then(rewardPer_SKAI => abiDecodeParameter(rewardPer_SKAI))
};


// MAIN FUNCTION 
async function getUserFarmingPool(USER_ADDRESS) {

    const KAI = await Token.findOne({token: 'KAI'}); 
    const sKAI = await Token.findOne({token: 'sKAI'}); 
    
        
    let [ staked_sKAI, earned_KAI, rewardPer_sKAI] = await Promise.all([ 
        stakedsKAI(USER_ADDRESS), 
        earnedKAI(USER_ADDRESS),
        rewardPersKAI()
    ]); 
    const KAI_decimal = Math.pow(10, KAI.decimal);
    staked_sKAI /= KAI_decimal; 
    earned_KAI /= KAI_decimal; 

    const staked_sKAI_price = staked_sKAI * sKAI.price; 
    const earned_KAI_price = earned_KAI * KAI.price; 

    let apr = (rewardPer_sKAI / KAI_decimal * KAI.price) / sKAI.price * 1e2;

    return {
      staked_sKAI,
      staked_sKAI_price, 
      earned_KAI,
      earned_KAI_price, 
      apr
    }
};

module.exports = { getUserFarmingPool }; 