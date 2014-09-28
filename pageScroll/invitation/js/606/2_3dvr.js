$(function() {
	$('div[id^=container]').each(function(i,e){
		panaCreate($(e).attr('id'),i);
	});
	
	function panaCreate(id,i) {
		var mana = $('#'+id).attr('data-mana');
		eval("pano"+i+" = new pano2vrPlayer(id)");
		eval("pano"+i+".readConfigUrl($('#'+id).attr('data-file'))");
		if (mana == 0) {
			eval("reSize"+i+" = setInterval(\"panaReSizeing('"+id+"', "+i+")\",50)");
		}
	}
	
});
function panaReSizeing(id,i) {
	if ($('#'+id).find('div').height() == 0) {
		eval("pano"+i+".setViewerSize(document.documentElement.clientWidth,document.documentElement.clientHeight)");
	} else {
		clearInterval(eval("reSize"+i));
	}
}
