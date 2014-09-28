var async = require('async');
var request = require('request');
var moment = require('moment');

var serverDomain = 'server.bakker.pw:9980';

module.exports = function(req, res){
	async.parallel({
//		survivalPlayers: function(parallelCallback){
//			child_process.spawn('sudo', ['-u minecraft', 'msm survival connected']).stdout.on('data', function(data){
//				var playerString = data.toString();
//				parallelCallback(null, diskString);
//			});
//		}
		survivalPlayers: function(parallelCallback){
			setImmediate(function(){
				parallelCallback(null, []);
			});
		},
		creativePlayers: function(parallelCallback){
			setImmediate(function(){
				parallelCallback(null, []);
			});
		},
	}, function(parallelError, results){
		res.render('minecraft', {
			title: 'Minecraft',
			link: 'map.bakker.pw',
			status: {
				survival: {
					name: 'Survival',
					link: 'survival.bakker.pw',
					rules: ['Survive'],
					players: results.survivalPlayers
				},
				creative: {
					name: 'Creative',
					link: 'creative.bakker.pw',
					rules: [
						'No massive TNT explosions',
						'Do not break things that are not yours',
						'Do not use the plugins unless you know what you are doing',
					],
					players: results.creativePlayers
				}
			}
		});
	});
};

