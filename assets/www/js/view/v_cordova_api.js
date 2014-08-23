var v_cordova_api = Backbone.View.extend({
	initialize:function(options){
		this.options = options || {};
	},
	template:Handlebars.compile( // jangan pakai ; semikolon dibelakang, karena akan error
		'<div data-role="header" data-theme="b" data-position="fixed">'+
    		'<a href="#" data-icon="back" class="ui-btn-left back">Back</a>'+
    		'<h1>Contact</h1>'+
    	'</div>'+
        '<div data-role="content">'+
        	'<div>{{koneksi}}</div>'+
        	'<div><a href="#" id="goyang" data-role="button" >Vibrate</a></div>'+
        	'<div><a href="#" id="photo" data-role="button" >Photo</a></div>'+
        	'<div><img style="display:none;width:120px;height:120px;" id="cameraImage" src="" /></div>'+
	    '</div>'
	),
	render:function(){
		var states = {};
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
    	}
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        	this.options.koneksi =  'Connection type = ' + states[navigator.network.connection.type];
        }
        else{
        	this.options.koneksi = 'tidak ada koneksi';
        }
		$(this.el).html(this.template(this.options));
		return this;
	},
	events:{
		"click a.back":"doBack",
		"click a#goyang":"doGoyang",
		"click a#photo":"doPhoto"
	},
	doBack:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			Backbone.history.navigate("#home/" + window.localStorage.getItem("id_user"), true);
		}
		else{
			window.history.back();
		}
	},
	doGoyang:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			navigator.notification.vibrate(1000);
		}
	},
	doPhoto:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			navigator.camera.getPicture(onCapturePhotoSuccess, onfail, { destinationType: Camera.DestinationType.DATA_URL, quality: 50 });
		}
	}
});