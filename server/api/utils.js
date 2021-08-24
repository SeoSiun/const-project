const _ = require('lodash');

function addRecentValues(now, recent, atype='wallet') { 
    if (atype == 'staking') {
        const ret_obj = _.cloneDeep(now); 
        if (recent) ret_obj.prev_price = recent.total_price; 
        return ret_obj; 
    }

    const ret_obj = now.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {}); 
    
    for (let token of Object.keys(ret_obj)) { 

        if (!recent || !recent[token]) continue; 
        let prev_price = 0; 
        switch (atype) {
            case 'wallet':
                prev_price = recent[token].value; 
                break;

            case 'farming': 
                prev_price = recent[token].total_price; 

            default:
                break;
        }
        ret_obj[token].prev_price = prev_price; 

    }
    return ret_obj;
}

module.exports = { addRecentValues }; 