RequireScript("euphoria/classes/BaseClass.js");

function SoundManagerClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.currentSong = null;

	me.playSongFile = function(songFile)
	{
		me.playSong(mainGame.globalDb.loadSong(songFile));
	};

	me.playSong = function(song)
	{
		if (me.currentSong !== null)
			me.stopSong();

		me.currentSong = song;
		if (mainGame.allowMusic)
			song.play(true);
	};

	me.pauseSong = function()
	{
		if (me.currentSong)
			me.currentSong.stop();
	};

	me.resumeSong = function()
	{
		if (me.currentSong)
			me.currentSong.play(true);
	};

	me.stopSong = function()
	{
		if (me.currentSong)
			me.currentSong.stop();
		me.currentSong = null;
	};

	me.playEffectFile = function(soundEffectFile)
	{
		me.playEffect(mainGame.globalDb.loadSoundEffect(soundEffectFile));
	};

	me.playEffect = function(effect)
	{
		if (mainGame.allowSoundEffects)
			effect.play();
	};
}