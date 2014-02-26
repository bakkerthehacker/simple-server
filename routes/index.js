var async = require('async');
var request = require('request');
var moment = require('moment');

var serverDomain = 'server.bakker.pw:9980';

module.exports = function(req, res){
  async.parallel({
    disk: function(diskCallback){
      request('http://' + serverDomain + '/status/disk', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var diskUsage = JSON.parse(body);
          var symbol = 'GB';
          var size = 1000 * 1000;
          diskUsage.used /= size;
          diskUsage.available /= size;
          var percent = Math.round((diskUsage.used / (diskUsage.used + diskUsage.available)) * 100);
          var text = percent + '% ( ' + Math.round(diskUsage.used) + symbol + ' / ' + Math.round(diskUsage.used + diskUsage.available) + symbol + ' )';
          diskCallback(null, text);
        }else{
          diskCallback(null, 'unavailable!');
        }
      });
    },
    online: function(onlineCallback){
      request('http://' + serverDomain + '/', function (error, response, body) {
        onlineCallback(null, !error && response.statusCode == 200);
      });
    },
    updated: function(updatedCallback){
      request('http://' + serverDomain + '/status/date', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var text = moment(body).fromNow();
          updatedCallback(null, text);
        }else{
          updatedCallback(null, 'unavailable!');
        }
      });
    }
  },function(error, statusResults){
    res.render('home',{
      title: 'Home',
      status: statusResults
    });
  });
};
