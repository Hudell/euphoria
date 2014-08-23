RequireScript("euphoria/classes/BaseClass.js");

function SoundManagerClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.currentSong = null;

	me.playSongFile = function(songFile)
	{
		me.playSong(euphoria.globalDb.loadSong(songFile));
	};

	me.playSong = function(song)
	{
		me.stopSong();
		me.currentSong = song;
		if (euphoria.allowMusic && song)
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
		if (soundEffectFile)
			me.playEffect(euphoria.globalDb.loadSoundEffect(soundEffectFile));
	};

	me.playEffect = function(effect)
	{
		if (euphoria.allowSoundEffects)
			effect.play();
	};
}