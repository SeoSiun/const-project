var express = require('express');
var router = express.Router();

const { Wallet } = require('../models/Wallet'); 
const { checkAddress, getKlaytnBalanceWallet } = require('./smart_contract/Klaytn/wallet'); 
const { getUserFarmingPool, staticsUserFarmingPool } = require('./smart_contract/Klaytn/farming'); 
const { getUserStakedKSP, getUserVotingPool, staticsUserStakingPool } = require('./smart_contract/Klaytn/staking'); 


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

router.get('/:user_id/asset', (req, res) => { 
    const { user_id } = req.params; 

    Wallet.findOne({user_id, atype: 'Klaytn'}, (err, wallet) => { 
        
        if (err) return res.json({status: false, err })
        if (!wallet) return res.json({status: false, msg: "doesn't exist wallet"})
        const { address } = wallet; 
        getKlaytnBalanceWallet(address)
            .then(result => res.json({status: true, result}))
            .catch(err => console.log(err))
    })
})


router.get('/:user_id/farming', async (req, res) => { 
    const { user_id } = req.params; 
    const address = await Wallet.findOne({user_id})
                                .then(wallet => wallet.address) 
                                .catch(err => res.json({status: false, err})); 
    await getUserFarmingPool(address) 
                    .then(result => res.json({status: true, result}))
                    .catch(err => res.json({status: false, err}))
})

router.get('/:user_id/farming/statics', async (req, res) => { 
    const { user_id } = req.params; 
    const address = await Wallet.findOne({user_id})
                                .then(wallet => wallet.address) 
                                .catch(err => res.json({status: false, err})); 
    staticsUserFarmingPool(address)
        .then(result => res.json({status: true, result}))
        .catch(err => res.json({status: false, err}))
    
})

router.get('/:user_id/staking', async (req, res) => { 
    const { user_id } = req.params; 

    const address = await Wallet.findOne({user_id})
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

router.get('/:user_id/staking/statics', async (req, res) => { 
    const { user_id } = req.params; 

    const address = await Wallet.findOne({user_id})
                                .then(wallet => wallet.address)
                                .catch(err => res.json({status: false, err})); 
    staticsUserStakingPool(address)
        .then(result => res.json({status: true, result}))
        .catch(err => res.json({status: false, err}))

})


module.exports = router;