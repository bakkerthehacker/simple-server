var async = require('async');
var request = require('request');
var moment = require('moment');

var serverDomain = 'server.bakker.pw:9980';

var getPlayerList = function(body, callback){
  try{
    var lines = body.split('\n');
    while(lines[lines.length - 1] === ''){
      lines.pop();
    }
    var countText = lines.shift();
    var regex = /^There are (\d+)\/(\d+) players online:$/
    var result = countText.match(regex);
    var playerCount = parseInt(result[1], 10);
    var players = [];
    for(var i = 0; i < playerCount; i++){
      players.push({
        username : lines[i]
      });
    }
    callback(null, players);
  }catch(error){
    callback(null, []);
  }
};

module.exports = function(req, res){
  async.parallel({
    survival: function(survivalCallback){
      request('http://' + serverDomain + '/status/minecraft-survival', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            getPlayerList(body, survivalCallback);
        }else{
          survivalCallback(null, []);
        }
      });
    },
    creative: function(creativeCallback){
      request('http://' + serverDomain + '/status/minecraft-creative', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          getPlayerList(body, creativeCallback);
        }else{
          creativeCallback(null, []);
        }
      });
    },
    updated: function(updatedCallback){
      request('http://' + serverDomain + '/status/minecraft-date', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var text = moment(body).fromNow();
          updatedCallback(null, text);
        }else{
          updatedCallback(null, 'unavailable!');
        }
      });
    }
  },function(error, statusResults){
    res.render('minecraft', {
      title: 'Minecraft',
      link: 'map.bakker.pw',
      status: statusResults
    });
  });
};

