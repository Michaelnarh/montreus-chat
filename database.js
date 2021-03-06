/* montreus-chat
 * server/database.js
 * MongoDB communicator for Montreus Chat.
 */
 
//NPM Modules
var mongoose = require("mongoose");

//Globals
var config = require("./config");
var Schema = mongoose.Schema;

//Startup Routines
mongoose.connect(config.database.address, {server: { poolSize: 5, keepAlive: 1 } },function (error) {
  if (error) {
      console.warn(error);
    }else{
      console.log("Connection to MongoDB established");
    }
});

//MongoDB Globals
var MessageSchema = new Schema({
    result:  {},
    room: String,
    sent: Date
});
var Message = mongoose.model('Message', MessageSchema);
//
var findMessages = function(room) {
    return new Promise(function (resolve, decline){
        Message.find({room: room}).sort({sent: 'ascending'}).exec(function(error, messages) {
            if(!error){
                resolve(messages);
            }else{
                console.error(error.message);
                decline(error);
            }
        });
    });
}

var addNewMessage = function(result, room){
    return new Promise(function (resolve, decline){
        var newMessage = new Message({
            result: result,
            room: room,
            sent: new Date()
        });
        newMessage.save(function(error){
            if(!error){
                resolve();
            }else{
                console.error(error);
                decline(error);
            }
        });
    });
}

//Exporting methods
exports.find = findMessages;
exports.add = addNewMessage;
