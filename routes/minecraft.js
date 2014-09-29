var async = require('async');
var Query = require('mcquery');

var serverDomain = 'server.bakker.pw:9980';

function queryServerStats(port, callback) {
	
	var query = new Query('localhost', port);

	query.connect(function(connectError){
		if(connectError){
			//return callback(connectError)
			return callback(null, {'online':false});
		}
		query.full_stat(function(statError, stat){
		//query.basic_stat(function(statError, stat){
			if(statError){
				//return callback(statError)
				return callback(null, {'online':false});
			}
			//console.log(stat)
			query.close();
			stat.online = true;
			setImmediate(function(){
				callback(null, stat);
			});
		});
	});
}

module.exports = function(req, res){
	async.parallel({
		survivalStats: function(parallelCallback){
			queryServerStats(25561, parallelCallback);
		},
		creativeStats: function(parallelCallback){
			queryServerStats(25560, parallelCallback);
		},
	}, function(parallelError, results){
		res.render('minecraft', {
			title: 'Minecraft',
			link: 'map.bakker.pw',
			servers: {
				survival: {
					name: 'Survival',
					link: 'survival.bakker.pw',
					rules: ['Survive'],
					stats: results.survivalStats
				},
				creative: {
					name: 'Creative',
					link: 'creative.bakker.pw',
					rules: [
						'No massive TNT explosions',
						'Do not break things that are not yours',
						'Do not use the plugins unless you know what you are doing',
					],
					stats: results.creativeStats
				}
			}
		});
	});
};

