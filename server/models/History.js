const mongoose = require('mongoose'); 

var Schema = mongoose.Schema; 

var HistorySchema = new Schema({ 
    
    address: { 
        type: String,
        required: true, 
    }, 
    network: {
        type: String, 
        required: true
    },
    total_price: {
        type: Number 
    }, 
    wallet_price: { 
        type: Number
    },
    farming_price: { 
        type: Number
    },
    staking_price: { 
        type: Number
    },
    lending_price: { 
        type: Number
    },
    wallet: {
        type: Object 
    }, 
    farming: {
        type: Object 
    }, 
    staking: {
        type: Object 
    }, 
    lending: { 
        type: Object
    },
    update_at: { 
        type: Date, 
        default: Date.now
    }
});

const History = mongoose.model("History", HistorySchema)
module.exports = { History }