const { Token } = require('../../../models/Token');

const { 
    callContract, decodeParameterSimple, 
    getCurrentPool, 
    caverGetBalance, isAddress 
} = require('./functions');

const fetch = require('node-fetch');

async function getKLAYCurrency() { 
    let url_bithumb = `https://api.bithumb.com/public/ticker/KLAY_KRW`
    let klay_price_krw = await fetch(url_bithumb,{method: 'GET', headers: {Accept: 'application/json'}})
                                .then(res => res.json())
                                .then(res => res.data.closing_price)
                                .catch(err => console.error('error:' + err));
  return klay_price_krw; 
}

async function calcTokenPriceB(address, tokenA_price, diff_decimal, to_fixed=2) { 
    let [tokenA_decimal, tokenB_decimal] = await getCurrentPool(address);
    let tokenAB_ratio = tokenA_decimal / tokenB_decimal; 
    let tokenB_price = tokenA_price * tokenAB_ratio; 
    tokenB_price *= Math.pow(10, diff_decimal); 
    return Number(tokenB_price.toFixed(to_fixed)); 
}

async function getKlaytnTokenPrice(){

    let tokens = await Token.find({network: 'Klaytn'})
    let tokens_obj = tokens.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {}); 
    let price_obj = {}; 

    let klay_price = await getKLAYCurrency(); 
    klay_price = Number(klay_price); 
    price_obj.KLAY = klay_price;

    for (let token of tokens) { // KLAY-?? LP
        const { atype, address, token:token_name } = token; 
        if (atype === 'SINGLE' || !token_name.includes('KLAY')) continue; 

        let [ tokenA, tokenB ] = token_name.split('_'); 
        if (!tokens_obj.hasOwnProperty(tokenB)) continue; 
        let diff_decimal = tokens_obj[tokenB].decimal - tokens_obj[tokenA].decimal; 
        let tokenB_price = await calcTokenPriceB(address, klay_price, diff_decimal); 
        price_obj[tokenB] = tokenB_price; 
    }

    for (let token of tokens) { // ??-?? LP
        const { atype, address, token:token_name } = token; 
        if (atype === 'SINGLE' || token_name.includes('KLAY')) continue; 
        let [ tokenA, tokenB ] = token_name.split('_'); 
        if (price_obj.hasOwnProperty(tokenA) && price_obj.hasOwnProperty(tokenB)) continue; 
        if (!price_obj.hasOwnProperty(tokenA) && !price_obj.hasOwnProperty(tokenB)) continue;
        
        let target_token = price_obj.hasOwnProperty(tokenA) ? tokenB : tokenA; 
        let cmp_token = target_token === tokenA ? tokenB : tokenA; 

        let diff_decimal = tokens_obj[target_token].decimal - tokens_obj[cmp_token].decimal; 
        let target_token_price = await calcTokenPriceB(address, price_obj[cmp_token], diff_decimal); 
        price_obj[target_token] = target_token_price;
    }
    return price_obj;
};

async function getKlaytnBalanceWallet(USER_ADDRESS){

    const USER_DATA = [ { type: 'address', value: USER_ADDRESS } ];
    let KLAY_amount = await caverGetBalance(USER_ADDRESS);
    KLAY_amount = Math.floor(KLAY_amount/1e12) / 1e6;
    if (KLAY_amount < 1e-6) KLAY_amount = 0; 

    let tokens = await Token.find({atype: 'SINGLE', network: 'Klaytn'}) 
    
    let { price: klay_price } = tokens.filter(t => t.token === 'KLAY')[0];
    let KLAY_balance = {
        token: 'KLAY', 
        amount: KLAY_amount, 
        token_price: klay_price,
        value: KLAY_amount * klay_price
    }

    const arrayPromises = tokens.map(async function(token) { 
        const { token: token_name, address, price, decimal } = token; 
        if (token_name === 'KLAY') return {value: 0}; 
        let token_amount = await callContract(address, 'balanceOf', USER_DATA)
                                    .then(res => res.result)
                                    .then(res => decodeParameterSimple(res) / Math.pow(10, Number(decimal))); 
        
        if(token_amount < 1e-6) token_amount = 0; 
        return {
            token: token_name, 
            amount: token_amount, 
            token_price: price,
            value: token_amount * price
        } 
        
    }); 

    let total_balance = await Promise.all(arrayPromises); 
    total_balance.push(KLAY_balance);
    total_balance = total_balance.filter(token => token.value > 0); 
    return total_balance
};

async function checkAddress(address) { 
    return await isAddress(address); 
}

async function staticsUserWallet(USER_ADDRESS) { 
    const wallet_result = await getKlaytnBalanceWallet(USER_ADDRESS); 
    let total_price = 0; 
    wallet_result.forEach(token => { 
        total_price += token.value; 
    })
    return {total_price}; 
    
}

module.exports = { checkAddress, getKlaytnTokenPrice, getKlaytnBalanceWallet, staticsUserWallet }; 
