var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var UserSchema=new Schema({
	username: String,
	password:String,
	userid:String,
	isAdmin:Boolean,
	bhour:Number,
    bmin:Number,
    emin:Number,
	ehour:Number
	});
    
var MessageSchema=new Schema({
	date:String,
	come:String,
	to:String,
    message:String
	});    

exports.User=mongoose.model('User',UserSchema);
exports.Message=mongoose.model('Message',MessageSchema);