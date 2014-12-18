var async = require('async');
var Query = require('mcquery');

function queryServerStats(port, callback) {
	
	var query = new Query('localhost', port, {timeout: 100});

	query.connect(function(connectError){
		if(connectError){
			return callback(null, {'online':false});
		}
		query.full_stat(function(statError, stat){
			if(statError){
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
		testStats: function(parallelCallback){
			queryServerStats(25559, parallelCallback);
		},
	}, function(parallelError, results){
		res.render('minecraft', {
			title: 'Minecraft',
			link: 'map',
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
				},
				test: {
					name: 'Test',
					link: 'test.bakker.pw',
					rules: [
					],
					stats: results.testStats
				}
			}
		});
	});
};

