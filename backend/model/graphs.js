const mongoose = require("mongoose");

const GraphsSchema = new mongoose.Schema({
    title: {type:String, required:true},
    diamention:{type: String, enum:['2d', '3d'], required:true},
    type:{type: String, enum:['bar', 'line', 'pie', 'scatter'], required:true},
    data:{type:String,required:true}
},{timestamps:true})

module.exports = mongoose.model('Graphs', GraphsSchema)