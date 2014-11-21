module.exports = function(req, res){
	res.render('torrent', { title: 'Torrent', link: {server:'transmission',files:'torrent_files'} });
};
