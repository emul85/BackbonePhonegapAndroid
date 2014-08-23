var v_todo_list = Backbone.View.extend({
	initialize:function(option){
		this.options = option || {};
		this.listenTo(this.options.collection, "change", this.render);
	},
	template:Handlebars.compile(
		'<div data-role="header" data-theme="b" data-position="fixed" >'+
			'<a href="#" data-icon="back" class="ui-btn-left back">Back</a>'+
    		'<h1>Semua Kegiatan</h1>'+
    		//'<a href="#todo/{{id_user}}/add" data-icon="plus" class="ui-btn-right">Tambah</a>'+
    	'</div>'+
    	'<div data-role="content">'+
	    	'<ul data-role="listview" class="mulyo" >'+
	    	'{{#each collection.models}}<li><a href="#todo/{{attributes.id_user}}/{{attributes.id}}/lihat" ><h3>{{attributes.judul}}</h3><p>{{attributes.tanggal}}</p></a></li>{{/each}}'+
			'</ul>'+
		'</div>'+
		'<div data-role="footer" data-theme="c" data-iconpos="right" data-position="fixed">'+
			'<div data-role="navbar">'+
				'<ul>'+
					'<li><a href="#todo/{{id_user}}/delete" >Delete</a></li>'+
					'<li><a href="#todo/{{id_user}}/add" >Tambah</a></li>'+
				'</ul>'+
			'</div>'+
		'</div>'
	),
	render:function(){
		$(this.el).html(this.template(this.options));
		return this;
	},
	events:{
		"click a.back":"backHome"
	},
	backHome:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			Backbone.history.navigate("#home/" + window.localStorage.getItem("id_user"), true);
		}
		else{
			window.history.back();
		}
	}
});

var v_todo_list_detail = Backbone.View.extend({
	initialize:function(option){
		this.options = option || {};
		this.listenTo(this.options.model, "change", this.render);
		//this.model.on("change", this.render, this);
	},
	template:Handlebars.compile(
		'<div data-role="header" data-theme="b" data-position="fixed" >'+
			'<a href="#" data-icon="back" class="ui-btn-left back">Back</a>'+
    		'<h1>{{judul}}</h1>'+
    		'<a href="#todo/{{id_user}}/{{id}}/edit" data-icon="check" >Edit</a>' +
    	'</div>'+
    	'<div data-role="content">'+
    		'<p>{{kegiatan}}</p>'+
    		'<p>tanggal = {{tanggal}}</p>'+
		'</div>'
	),
	render:function(){
		$(this.el).html(this.template(this.options.model.attributes));
		return this;
	},
	events:{
		"click a.back":"doBack"
	},
	doBack:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			Backbone.history.navigate("#todo/" + window.localStorage.getItem("id_user") + '/lihat', true);
		}
		else{
			window.history.back();
		}
	}
});

var v_todo_form = Backbone.View.extend({
	initialize:function( option){
		this.options = option || {};
		this.listenTo(this.options.model, "change", this.render);
	},
	template:Handlebars.compile(
		'<div data-role="header" data-theme="b"  data-position="fixed">'+
			'<a href="#" data-icon="back" class="ui-btn-left back" >Cancel</a>' +
    		'<h1>{{title}} {{model.attributes.judul}}</h1>'+
    		'<a href="#" data-icon="check" id="simpanTodo" >Simpan</a>' +
    	'</div>'+
    	'<div data-role="content">'+
	    	'<form  id="formTodo">'+
				'<label for="judul" >Judul</label>'+
				'<input type="text" data-mini="true" name="judul" id="judul" {{#if model.attributes.judul}}value="{{model.attributes.judul}}"{{/if}} placeholder="Nama">'+

				'<label for="kegiatan" >Kegiatan</label>'+
				'<textarea name="kegiatan" id="kegiatan" >{{#if model.attributes.kegiatan}}{{model.attributes.kegiatan}}{{/if}}</textarea>'+

				'<label for="tanggal">Tanggal</label>'+
				'<input type="date" data-mini="true" name="tanggal" id="tanggal" {{#if model.attributes.tanggal}}value="{{model.attributes.tanggal}}"{{/if}} placeholder="tanggal">'+
				
				'<label for="aktif">Status Kegiatan</label>'+
				'<select name="aktif" id="aktif" data-mini="true">'+
					'<option {{#compare model.attributes.aktif "1"}} selected="selected" {{/compare}} value="1">Aktif</option>'+
					'<option {{#compare model.attributes.aktif "0"}} selected="selected" {{/compare}} value="0">Tidak Aktif</option>'+
				'</select>'+

				'<input type="hidden" name="id_user" id="id_user" value="{{model.attributes.id_user}}">'+

			'</form>'+
		'</div>'
	), 
	render:function(){
		$(this.el).html(this.template(this.options));
		return this;
	},
	events:{
		"click a#simpanTodo":"doSimpan",
		"click a.back":"doBack"
	},
	doSimpan:function(){
		event.preventDefault();
		var appku = this;
		$.mobile.showPageLoadingMsg();
		var formValue = {
			'id'		:this.model.id,
			'id_user'	:this.options.model.attributes.id_user,
			'judul'		:$('input#judul').val(),
			'kegiatan'	:$('textarea#kegiatan').val(),
			'tanggal'	:$('input#tanggal').val(),
			'aktif'		:$('select#aktif').val(),
			'aksi'		:this.options.aksi
		};
		$.ajax({
            url:server + 'todo.php/save',
            type:'POST',
            dataType:"json",
            data: formValue,
            success:function (data) {
            	$.mobile.hidePageLoadingMsg();
                if(data.error) {  
                    alert(data.error.text);
                }
                else { 
                	if(appku.options.aksi == 'add'){
                		Backbone.history.navigate("#todo/" + appku.options.model.attributes.id_user + '/lihat', true);
                		// cara diatas tidak bisa update collection sekrang pakai cara kedua

                	}
                	else{
                		Backbone.history.navigate("#todo/" + appku.options.model.attributes.id_user + '/' + appku.model.id + '/lihat', true);
                		/*var todoModel = new M_Todo({'id_user':appku.options.model.attributes.id_user});
						todoModel.url = server + 'todo.php/get/' + appku.options.model.attributes.id_user +'/'+ appku.model.id;
						todoModel.fetch({
						    success: (function (todoModel) {
					    		$.mobile.hidePageLoadingMsg();
					    		var view = new v_todo_list_detail({model:todoModel});
					        	appku.changePage(view);
						    }),
						    error: (function (e) {
						    	$.mobile.hidePageLoadingMsg();
						        alert('error' + e);
						    }),
						    complete: (function (e) {
						        $.mobile.hidePageLoadingMsg();
						    })
						});*/
                	}
                }
            },
            complete:function(){
            	$.mobile.hidePageLoadingMsg();
            }
        });
	},
	doBack:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			Backbone.history.navigate("#todo/" + window.localStorage.getItem("id_user") + '/lihat', true);
		}
		else{
			window.history.back();
		}
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

var v_todo_delete = Backbone.View.extend({
	initialize:function(option){
		this.options = option || {};
	},
	template:Handlebars.compile(
		'<div data-role="header" data-theme="b"  data-position="fixed">'+
			'<a href="#" data-icon="back" class="ui-btn-left back" >Cancel</a>' +
    		'<h1>Pilih untuk delete</h1>'+
    		'<a href="#" data-icon="delete" id="deleteTodo" >Delete</a>' +
    	'</div>'+
    	'<div data-role="content">'+
			'<div data-role="fieldcontain">'+
			    '<fieldset data-role="controlgroup" class="mulyo" >'+
			    '{{#each collection.models}}' +
				   '<input type="checkbox" name="{{attributes.id}}" id="{{attributes.id}}" class="custom" /><label for="{{attributes.id}}">{{attributes.judul}}<br><span class="checkText" >{{attributes.tanggal}}</span></label>'+
				   '{{/each}}'+
			    '</fieldset>'+
			'</div>'+
		'</div>'
	),
	render:function(){
		$(this.el).html(this.template(this.options));
		return this;
	},
	events:{
		"click a#deleteTodo":"doDelete",
		"click a.back":"doBack"
	},
	doDelete:function(){
		event.preventDefault();
		var appku = this;
		var id='-'; var pilih = false;
		for(var i=0; i<this.options.collection.length; i++){
			if($('input#'+this.options.collection.models[i].attributes.id).attr('checked')){
				id += ', ' + this.options.collection.models[i].attributes.id;
				pilih = true;
			}
		}
		if(! pilih){
			alert('Anda belum memilih untuk didelete!');
		}
		else{
		$.mobile.showPageLoadingMsg();
		$.ajax({
            url:server + 'todo.php/delete',
            type:'POST',
            dataType:"json",
            data: {'id':id},
            success:function (data) {
            	$.mobile.hidePageLoadingMsg();
                if(data.error) {  
                    alert(data.error.text);
                }
                else { 
                	Backbone.history.navigate("#todo/" + appku.options.id_user + '/lihat', true);
                }
            },
            complete:function(){
            	$.mobile.hidePageLoadingMsg();
            }
        });
		}
	},
	doBack:function(event){
		event.preventDefault();
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			Backbone.history.navigate("#todo/" + window.localStorage.getItem("id_user") + '/lihat', true);
		}
		else{
			window.history.back();
		}
	}
});