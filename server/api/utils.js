
function addRecentValues(now, recent, atype='wallet') { 
    const ret_obj = now.reduce((obj, t) => Object.assign(obj, { [t.token]: t}), {}); // 큰틀에서 배열에서 객체로
    for (let token in ret_obj) { 
        if (!recent[token]) continue; 

        let prev_total_price = 0; 
        switch (atype) {
            case 'wallet':
                prev_total_price = recent[token].value; 
                break;

            case 'farming': 
                prev_total_price = recent[token].total_price; 
            default:
                break;
        }
        ret_obj[token].prev_total_price = prev_total_price; 

    }
    return ret_obj;
}

module.exports = { addRecentValues }; 