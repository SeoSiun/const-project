
const { getUserFarmingPool: getUserKLAYSWAPFarmingPool } = require('./klayswap_farming'); 
const { getUserFarmingPool: getUserDEFINIXFarmingPool } = require('./definix_farming'); 
const { getUserFarmingPool: getUserKAIFarmingPool } = require('./kai_farming'); 

async function staticsUserFarmingPool(USER_ADDRESS) { 
    const [ klayswap_farming, definix_farming, kai_farming ] = await Promise.all([
        getUserKLAYSWAPFarmingPool(USER_ADDRESS), 
        getUserDEFINIXFarmingPool(USER_ADDRESS), 
        getUserKAIFarmingPool(USER_ADDRESS)
    ]); 

    let total_price = 0;
    let minable_price = 0;
    let rewarded_price = 0;
    let avg_apr = 0; 

    klayswap_farming.forEach(farming_pool => {
        let {
            total_price: elem_total_price, 
            minable_reward_ksp_price, 
            rewarded_ksp_price, 
            apr
        } = farming_pool; 
        total_price += elem_total_price; 
        minable_price += minable_reward_ksp_price; 
        rewarded_price += rewarded_ksp_price; 
        avg_apr += (elem_total_price * apr / 100); 
    });

    definix_farming.forEach(farming_pool => { 
        let { 
            total_price: elem_total_price, 
            minable_reward_finix_price, 
            apr
        } = farming_pool; 
        total_price += elem_total_price; 
        minable_price += minable_reward_finix_price; 
        avg_apr += (elem_total_price * apr / 100); 
    });

    let { 
        total_price: skai_total_price, 
        minable_kai_price, 
        apr
    } = kai_farming; 
    total_price += skai_total_price; 
    total_price += minable_kai_price; 
    avg_apr += (skai_total_price * apr / 100);

    avg_apr *= (100 / total_price); 

    return  { 
        total_price, 
        minable_price, 
        rewarded_price, 
        avg_apr
    }
}

module.exports = { staticsUserFarmingPool }; 