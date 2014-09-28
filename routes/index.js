var async = require('async');
var request = require('request');
var moment = require('moment');
var child_process = require('child_process');


module.exports = function(req, res){
	async.parallel({
		chunkDisk: function(parallelCallback){
			child_process.spawn('df', ['/', '--output=used,avail']).stdout.on('data', function(data){
				var diskData = data.toString().split('\n')[1].split(' ');
				var used = parseInt(diskData[0], 10);
				var avail = parseInt(diskData[1], 10);
				var total = used + avail;
				var sizeSuffixes = ['KB', 'MB', 'GB', 'TB'];
				var suffixIndex = 0;
				while(total > 1024){
					used /= 1024;
					avail /= 1024;
					total /= 1024;
					suffixIndex++;
				}
				var suffix = sizeSuffixes[suffixIndex];
				var diskString = Math.round((used / total) * 100) + '% (' + Math.round(used) + suffix + ' / ' + Math.round(total) + suffix + ')';
				parallelCallback(null, diskString);
			});
		}
	}, function(parallelError, results){
		res.render('home',{
			title: 'Home',
			status: {
				chunk: {
					name: 'Chunk',
					online: true,
					disk: results.chunkDisk,
					updated: 'now'
				}
			}
		});
	});
};
