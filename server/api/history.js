var express = require('express');
var router = express.Router();

const {  getKlaytnBalanceWallet, staticsUserWallet } = require('./smart_contract/Klaytn/wallet'); 
const { getUserStakedKSP, getUserVotingPool, staticsUserStakingPool } = require('./smart_contract/Klaytn/klayswap_staking'); 

const { getUserFarmingPool: getUserKLAYSWAPFarmingPool } = require('./smart_contract/Klaytn/klayswap_farming'); 
const { getUserFarmingPool: getUserDEFINIXFarmingPool } = require('./smart_contract/Klaytn/definix_farming'); 
const { getUserFarmingPool: getUserKAIFarmingPool } = require('./smart_contract/Klaytn/kai_farming'); 

const { staticsUserFarmingPool } = require('./smart_contract/Klaytn/statics'); 

router.get('/:address/summary', async (req, res) => { 
    const { address } = req.params; 
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

router.get('/:address/asset', async (req, res) => { 
    const { address } = req.params; 
    getKlaytnBalanceWallet(address).then(result => { 
        res.json({status: true, result})
    })
})

router.get('/:address/farming', async (req, res) => { 
    const { address } = req.params; 
    const [klayswap_farming, definix_farming, kai_farming] = await Promise.all([
        getUserKLAYSWAPFarmingPool(address), 
        getUserDEFINIXFarmingPool(address), 
        getUserKAIFarmingPool(address)
    ]); 
    res.json({status: true, result: {
        KLAYSWAP: klayswap_farming,
        DEFINIX: definix_farming, 
        KAI: kai_farming 
    }})
})

router.get('/:address/staking', async (req, res) => { 
    const { address } = req.params; 
    const [user_staked_KSP, user_voting_pool] = await Promise.all([
        getUserStakedKSP(address), 
        getUserVotingPool(address) 
    ]).catch(err => res.json({status: false, err}))

    res.json({status: true, result: {
        stakedKSP: user_staked_KSP, 
        votingPool: user_voting_pool
    }})
})

module.exports = router;