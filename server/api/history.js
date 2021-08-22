var express = require('express');
var router = express.Router();

const {  getKlaytnBalanceWallet } = require('./smart_contract/Klaytn/wallet'); 
const { getUserStakedKSP, getUserVotingPool } = require('./smart_contract/Klaytn/klayswap_staking'); 

const { getUserFarmingPool: getUserKLAYSWAPFarmingPool } = require('./smart_contract/Klaytn/klayswap_farming'); 
const { getUserFarmingPool: getUserDEFINIXFarmingPool } = require('./smart_contract/Klaytn/definix_farming'); 
const { getUserFarmingPool: getUserKAIFarmingPool } = require('./smart_contract/Klaytn/kai_farming'); 

const { isAddress } = require('./smart_contract/Klaytn/functions'); 

router.get('/:address/summary', async (req, res) => { 
    const { address } = req.params; 
    const is_address = await isAddress(address); 
    if (!is_address) {
        res.json({status: false, err: 'invalid address type'})
        return; 
    }

    const [
        wallet, 
        klayswap_farming,
        definix_farming, 
        kai_farming,  
        staked_ksp, 
        voting_pool
    ] = await Promise.all([
        getKlaytnBalanceWallet(address), 
        getUserKLAYSWAPFarmingPool(address), 
        getUserDEFINIXFarmingPool(address), 
        getUserKAIFarmingPool(address), 
        getUserStakedKSP(address), 
        getUserVotingPool(address)
    ]); 
    res.json({status: true, result: {
        wallet, 
        farming: {
            KLAYSWAP: klayswap_farming, 
            DEFINIX: definix_farming, 
            KAI: kai_farming
        }, 
        staking: { 
            staked_ksp, 
            voting_pool
        }
    }})
})

module.exports = router;