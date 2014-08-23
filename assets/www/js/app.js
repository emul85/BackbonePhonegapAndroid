var AppRouter = Backbone.Router.extend({
	routes:{
		"":"login",
		"home/:id_user" : "home",
		"todo/:id_user/:aksi":"todo",
		"todo/:id_user/:id/:aksi":"todoDetail",
		"api":"api",
		"logout":"logout"
	},
	initialize:function(){
		this.login = false; this.id_user = 0;
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			if(window.localStorage.getItem("login_user")){
				this.login = true;
				this.id_user = window.localStorage.getItem("id_user");
			}
		}
		else {
			this.id_user =1;
		}
		/*$('.back').live('click', function(event) {
            window.history.back();
            return false;
        });*/
        this.firstPage = true;
	},
	login:function(){
		if(this.login){
			var view = new v_home({id_user:this.id_user});
			view.initialize();
		}
		else{
			var view = new v_login();
			view.initialize();
		}
		this.changePage(view);
		if(this.login){ Backbone.history.navigate("#home/" + this.id_user, true);}
	},
	logout:function(){
		this.login = false;
		window.localStorage.setItem("id_user", '');
    	window.localStorage.setItem("email_user", '');
    	window.localStorage.setItem("login_user", false);
		Backbone.history.navigate("#", true);
	},
	home:function(id_user){
		var view = new v_home();
		view.initialize({id_user:id_user});
		this.firstPage = true;
		this.changePage(view);
	},
	todo:function(id_user, aksi){
		$.mobile.showPageLoadingMsg();
		if(aksi=='add'){
			this.todoAdd(id_user);
		}
		else {
			var appku = this;
			var dataTodo = new C_Todo();
			dataTodo.url = server + 'todo.php/getall/' + id_user;
			dataTodo.fetch({
				success:function(dataTodoNew){
					$.mobile.hidePageLoadingMsg();
					var view = new v_todo_list({collection:dataTodoNew, id_user:id_user});
					if(aksi=='delete') {
						view = new v_todo_delete({collection:dataTodoNew, id_user:id_user});
					}
					appku.changePage(view);
				},
				error:function(e){
					$.mobile.hidePageLoadingMsg();
				},
				complete:function(e){
					$.mobile.hidePageLoadingMsg();
				}
			});
		}
	},
	todoAdd:function(id_user){
		var todoModel = new M_Todo({'id_user':id_user});
		var view = new v_todo_form({model:todoModel,title:'Tambah Kegiatan', aksi:'add'});
    	this.changePage(view);
	},
	todoDetail:function(id_user, id, aksi){
		$.mobile.showPageLoadingMsg();
		var appku = this;
		var todoModel = new M_Todo({'id_user':id_user});
		todoModel.url = server + 'todo.php/get/' + id_user +'/'+id;
		todoModel.fetch({
		   /* data: {id_user: id_user},*/
		    success: (function (todoModel) {
		    	if(aksi == 'lihat'){ 
		    		$.mobile.hidePageLoadingMsg();
		    		var view = new v_todo_list_detail({model:todoModel});
		        	appku.changePage(view);
		    	}
		    	else if(aksi == 'edit'){ 
		    		$.mobile.hidePageLoadingMsg();
		    		var view = new v_todo_form({model:todoModel, title:'Edit Kegiatan :: ', aksi:'edit'});
		        	appku.changePage(view);
		    	}
		    }),
		    error: (function (e) {
		    	$.mobile.hidePageLoadingMsg();
		        alert('error' + e);
		    }),
		    complete: (function (e) {
		        $.mobile.hidePageLoadingMsg();
		    })
		});
	},
	api:function(){
		var view = new v_cordova_api();
		view.initialize();
		this.changePage(view);
	},
	changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }
});


function onDeviceReady(){
	//$('body').html('').promise().done(function(){
		$('.app').remove();
		var app = new AppRouter();
		Backbone.history.start();
	//});
}
function checkNetwork(){
	var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    //alert('Connection type = ' + states[navigator.network.connection.type]);
	onDeviceReady();
}
$(document).ready(function () {
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	  	document.addEventListener("deviceready", checkNetwork, false);
	} else {
	  	onDeviceReady(); // desktop
	}
});