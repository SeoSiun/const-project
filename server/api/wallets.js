var express = require('express');
var router = express.Router();

const { Wallet } = require('../models/Wallet'); 
const { checkAddress, getKlaytnBalanceWallet } = require('./smart_contract/Klaytn/wallet'); 
const { identifyPool, depositOnlyKLAY, getEarnedReward } = require('./smart_contract/Klaytn/farming'); 


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


router.get('/:user_id/farming', (req, res) => { 
    const { user_id } = req.params; 
    Wallet.findOne({user_id}, (err, wallet) => { 
        const { address } = wallet; 
        identifyPool(address)
            .then(result => res.json({status: true, result})) 
            .catch(err => console.log(err)); 
    }).catch(err => console.log(err)); 
})

module.exports = router;