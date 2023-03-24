var sait=location.hostname; // на каком сайте находится скрипт
var userLang = 'en';

if(sait == 'www.iaai.com' || sait == 'www.copart.com' || sait == 'iaai.com' || sait == 'copart.com') 
{

	if(sait == 'www.copart.com' || sait == 'copart.com') {
		var d = new Date();
		$("<script>", {
		    type: "text/javascript",
		    src: "https://autohelperbot.com/js/copart_extension.js?v="+ d.getDate() + d.getMonth() + d.getHours()
		}).appendTo("head");
	}

	if(sait == 'www.iaai.com' || sait == 'iaai.com') {
		var d = new Date();
		$("<script>", {
		    type: "text/javascript",
		    src: "https://autohelperbot.com/js/iaai_extension.js?v="+ d.getDate() + d.getMonth() + d.getHours()
		}).appendTo("head");
	}
}
if(sait == 'bidfax.info') {
	var d = new Date();
	$("<script>", {
		type: "text/javascript",
		src: "https://autohelperbot.com/js/bidfax_extension.js?v="+ d.getDate() + d.getMonth() + d.getHours()
	}).appendTo("head");
}
if(sait == 'autoastat.com') {
	var d = new Date();
	$("<script>", {
		type: "text/javascript",
		src: "https://autohelperbot.com/js/autoastat_extension.js?v="+ d.getDate() + d.getMonth() + d.getHours()
	}).appendTo("head");
}
if(sait == 'auto.ria.com') {
	var d = new Date();
	$("<script>", {
		type: "text/javascript",
		src: "https://autohelperbot.com/js/auto_ria_extension.js?v="+ d.getDate() + d.getMonth() + d.getHours()
	}).appendTo("head");
}