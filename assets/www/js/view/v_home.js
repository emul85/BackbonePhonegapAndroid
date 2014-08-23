var v_home = Backbone.View.extend({
	initialize:function(options){
		this.options = options || {};
	},
	template:Handlebars.compile( // jangan pakai ; semikolon dibelakang, karena akan error
		'<div data-role="header" data-theme="b" data-position="fixed">'+
    		'<h1>Welcome</h1>'+
    	'</div>'+
        '<div data-role="content">'+
        	'<div class="content-secondary">'+
				//'<div data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="d">'+
					//'<h3>Menu</h3>'+
					'<ul data-role="listview" data-theme="c" data-inset="true" data-dividertheme="d">'+
						'<li><a href="#todo/{{id_user}}/lihat">Semua Kegiatan</a></li>'+
						'<li><a href="#api">Cordova API</a></li>'+
						'<li data-icon="lock"><a href="#logout">Logout</a></li>'+
					'</ul>'+
				//'</div>'+ // end collapsible
			'</div>'+
	    '</div>'
	),
	render:function(){
		$(this.el).html(this.template(this.options));
		return this;
	}
});
