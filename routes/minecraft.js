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
			query.close();
			stat.online = true;
			/*if(stat.plugins){
				var pluginList = stat.plugins.split(': ');
				pluginType = pluginList.shift();
				pluginList = pluginList.shift().split('; ');
				pluginList = pluginList.map(function(plugin){return plugin.split(' ').shift();});
				stat.pluginType = pluginType
				stat.pluginList = pluginList
			}
			console.log(stat);*/
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
		/*creativeStats: function(parallelCallback){
			queryServerStats(25560, parallelCallback);
		},*/
		ftbStats: function(parallelCallback){
			queryServerStats(25562, parallelCallback);
		},
	}, function(parallelError, results){
		res.render('minecraft', {
			title: 'Minecraft',
			servers: {
				survival: {
					name: 'Survival',
					link: 'survival.bakker.pw',
					sub_links: [{
						'name': 'Map',
						'link': 'map',
					}],
					rules: ['Survive'],
					stats: results.survivalStats
				},
				/*creative: {
					name: 'Creative',
					link: 'creative.bakker.pw',
					rules: [
						'No massive TNT explosions',
						'Do not break things that are not yours',
						'Do not use the plugins unless you know what you are doing',
					],
					stats: results.creativeStats
				},*/
				ftb: {
					name: 'FTB Hermitpack',
					link: 'ftb.bakker.pw',
					sub_links: [{
						'name': 'Mods',
						'link': 'https://bakker.pw/chunk/ftb_mods/',
					}, {
						'name': 'Map',
						'link': 'http://chunk.bakker.pw:8123/?worldname=world&mapname=surface&zoom=5',
					}],
					rules: [
						'Try not to crash the server :3',
					],
					stats: results.ftbStats
				},
			}
		});
	});
};

