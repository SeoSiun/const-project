var express = require('express');
var router = express.Router();

const { Wallet } = require('../models/Wallet'); 
const { History } = require('../models/History'); 
const { checkAddress, getKlaytnBalanceWallet, staticsUserWallet } = require('./smart_contract/Klaytn/wallet'); 
const { getUserStakedKSP, getUserVotingPool, staticsUserStakingPool } = require('./smart_contract/Klaytn/klayswap_staking'); 

const { getUserFarmingPool: getUserKLAYSWAPFarmingPool } = require('./smart_contract/Klaytn/klayswap_farming'); 
const { getUserFarmingPool: getUserDEFINIXFarmingPool } = require('./smart_contract/Klaytn/definix_farming'); 
const { getUserFarmingPool: getUserKAIFarmingPool } = require('./smart_contract/Klaytn/kai_farming'); 

const { staticsUserFarmingPool } = require('./smart_contract/Klaytn/statics'); 

const { addRecentValues } = require('./utils'); 

router.get('/check', (req, res) => { 
    const {wallet_address: address} = req.query; 
    checkAddress(address).then(result => { 
        res.json({status: true, result})
    }).catch(err => res.json({status: false, msg: err}))
})

router.get('/:user_id', (req, res) => { 
    const { user_id } = req.params; 

    Wallet.find({ user_id }, (err, wallets) => { 
        if (err) res.json({status: false, err})
        else res.json({status: true, result: wallets})
    })
})

router.post('/import', (req, res) => { 

    const {user_id, address, atype} = req.body; 

    Wallet.findOne({user_id, address, atype}, (err, wallet) => {

        if (err) return res.json({status: false, err })
        if (wallet) { res.json({status: false, msg: 'duplicated wallet'})}
        else { 
            const wallet = new Wallet(req.body); 
            wallet.save((err, _) => { 
                if (err) return res.json({status: false, msg: err })
                else { res.json({status: true}) }
            })
        }
    })

})

router.get('/:user_id/summary', async (req, res) => { 
    const { atype } = req.query; 
    const { user_id } = req.params; 
    const wallet = await Wallet.findOne({user_id, atype: 'Klaytn'});

    if (!wallet) {
        res.json({status: false, result: {
            total_price: 0, 
            wallet: 0, 
            farming: 0, 
            staking: 0 
        }})
        return;
    }

    const { address } = wallet;

    switch (atype) {
        case 'asset': 
            staticsUserWallet(address) 
                .then(result => res.json({statis: true, result}))
                .catch(err => res.json({status: false, err}));
            break; 

        case 'farming':
            staticsUserFarmingPool(address)
                .then(result => res.json({status: true, result}))
                .catch(err => res.json({status: false, err}))
            break;

        case 'staking': 
            staticsUserStakingPool(address)
                .then(result => res.json({status: true, result}))
                .catch(err => res.json({status: false, err}))
            break; 

        default:
            try {
                const [
                    wallet_result, 
                    farming_result, 
                    staking_result
                ] = await Promise.all([
                    staticsUserWallet(address), 
                    staticsUserFarmingPool(address), 
                    staticsUserStakingPool(address) 
                ]); 
                let total_price = wallet_result.total_price + 
                                    farming_result.total_price + 
                                        staking_result.total_price; 
                res.json({status: true, result: {
                    total_price, 
                    wallet: wallet_result, 
                    farming: farming_result, 
                    staking: staking_result 
                }})
            } catch(err) { 
                res.json({status: false, err})
            }
            break;
    }
})

router.get('/:user_id/asset', async (req, res) => { 
    const { user_id } = req.params; 
    const { atype } = req.query; 

    const address = await Wallet.findOne({user_id, atype: 'Klaytn'})
                                .then(wallet => wallet.address) 
                                .catch(err => res.json({status: false, err})); 
    try{ 
        let wallet_result = await getKlaytnBalanceWallet(address); 
        wallet_result.sort(function(a, b) {return b.value - a.value})
        if (atype === 'chart' && wallet_result.length > 6) { 
            let top_tokens = wallet_result.slice(0, 5); 
            let value = wallet_result.slice(5).reduce((sum, token) => sum + token.value, 0); 
            let result = top_tokens.concat({token: 'OTHERS', value});
            res.json({status: true, result})
        } else{ 
            res.json({status: true, result: wallet_result})
        }
    } catch(err) { 
        res.json({status: false, err})
    }
})



router.get('/:user_id/farming', async (req, res) => { 
    const { user_id } = req.params; 
    const { defi } = req.query; 
    const wallet = await Wallet.findOne({user_id, atype: 'Klaytn'})
                                .catch(err => res.json({status: false, err})); 

    const { address } = wallet;
    const recent_history = await History.find({address, network: 'Klaytn'})
                                        .sort({upadte_at: -1})
                                        .then(result => result[0]); 

    // addRecentValues(recent_history.farming.KLAYSWAP)
    // res.json({status: true, recent_history}); 
    // return; 


    if (!address) {
        res.json({status: false, err: "not exist wallet address"})
        return ;
    }
    if (!defi) {
        const [klayswap_farming, definix_farming, kai_farming] = await Promise.all([
            getUserKLAYSWAPFarmingPool(address), 
            getUserDEFINIXFarmingPool(address), 
            getUserKAIFarmingPool(address)
        ]); 
        // const add_result = addRecentValues(klayswap_farming, recent_history.farming.KLAYSWAP, 'farming'); 
        // console.log(add_result); 
        // res.json({status: true, add_result}); 
        // return ;

        res.json({status: true, result: {
            KLAYSWAP: klayswap_farming,
            DEFINIX: definix_farming, 
            KAI: kai_farming 
        }})
        return; 
    }

    switch (defi) {
        case 'KLAYSWAP':
            getUserKLAYSWAPFarmingPool(address) 
                .then(result => res.json({status: true, result}))
                .catch(err => res.json({status: false, err}))
            break;

        case 'DEFINIX': 
            getUserDEFINIXFarmingPool(address) 
                .then(result => res.json({status: true, result}))
                .catch(err => res.json({status: false, err}))
            break; 

        case 'KAI': 
            getUserKAIFarmingPool(address) 
                .then(result => res.json({status: true, result}))
                .catch(err => res.json({status: false, err}))
            break; 
        default:
            res.json({status: false, err: "bad params: 'defi'"})
            break;
    }
    return; 
})


router.get('/:user_id/staking', async (req, res) => { 
    const { user_id } = req.params; 

    const address = await Wallet.findOne({user_id, atype: 'Klaytn'})
                                .then(wallet => wallet.address)
                                .catch(err => res.json({status: false, err})); 

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