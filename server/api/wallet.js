var express = require('express');
var router = express.Router();

const { Wallet } = require('../models/Wallet'); 
const { getKlaytnBalanceWallet } = require('./smart_contract/Klaytn/wallet'); 
const { identifyPool, depositOnlyKLAY, getEarnedReward } = require('./smart_contract/Klaytn/farming'); 


router.get('/:user_id', (req, res) => { 

    Wallet.find({user_id: req.params.user_id}, (err, wallets) => { 
        if (err) return res.json({status: false, err})
        else { return res.json({status: true, wallets}) }
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

router.post('/balanceAll', (req, res) => { 
    const { user_id } = req.body; 
    Wallet.find({user_id}, (err, wallets) => { 

        // wallets.forEach(wallet => {
        //     const {address, atype} = wallet; 

        //     switch (atype) {
        //         case "KLAY":
        //             KlaytnBalanceWallet(address)
        //             .then((result => { 
        //                 res.json({status: true, result})
        //             }))
        //             break;
        //         default:
        //             res.json({status: false, 'msg': 'unexpected error'})
        //             break;
        //     }
        // });
        res.json({status: true, result: wallets})
    })
})

router.post('/balance', (req, res) => { 
    const { address, atype } = req.body; 
    console.log(req.body)

    switch (atype) {
        case "Klaytn":
            getKlaytnBalanceWallet(address, to_krw=true)
            .then((wallet_balance => { 
                res.json({status: true, result: wallet_balance})
            }))
            break;
        
        default:
            res.json({status: false, 'msg': 'wrong atype variable'})
            break;
    }
})


// router.post('/farming', (req, res) => { 
//     const { user_id } = req.body; 
//     Wallet.findOne({user_id}, (err, wallet) => { 
//         const { address } = wallet; 
//         identifyPool(address)
//             .then(result => console.log(result)) 
//         res.json({status: true})
//     })
// })

module.exports = router;