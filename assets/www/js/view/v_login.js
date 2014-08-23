var v_login = Backbone.View.extend({
	initialize:function(options){
		this.options = options || {};
	},
	template:Handlebars.compile( // jangan pakai ; semikolon dibelakang, karena akan error
		'<div data-role="header" data-theme="b" data-position="fixed">'+
    		'<h1>Login</h1>'+
    	'</div>'+
        '<div data-role="content" >'+
			'<div class="login">' +
	    		'<form method="post" action="#" id="formLogin" enctype="multi-part/form-data">' +
	    			'<p>'+
	    				'<label for="email">Email :</label>'+
	    				'<input data-mini="true" type="text" name="email" id="email" >'+
	    			'</p>'+
	    			'<p>'+
    				'<label for="password">Password :</label>'+
    				'<input data-mini="true" type="password" name="password" id="password" >'+
    				'</p>'+
    			
    				'<input data-mini="true" type="submit" id="tbl_login" name="login" class="button" value="Login" >'+
	    			
	    			//'<br>'+
	    			//'<a href="#api" data-role="button" >Cordova API</a>'+

	    		'</form>'+
	    	'</div>'+
	    '</div>'
	),
	render:function(){
		$(this.el).html(this.template(this.options));
		return this;
	},
	events:{
		"submit form#formLogin":"doLogin"
	},
	doLogin:function(event){
		event.preventDefault();
		var email = $('input#email').val();
		var password = $('input#password').val();
		var formValue = {
			'email':email,
			'password':password
		};
		$.mobile.showPageLoadingMsg();
		$.ajax({
            url:server + 'user.php/login',
            type:'POST',
            dataType:"json",
            data: formValue,
            success:function (data) {
            	$.mobile.hidePageLoadingMsg();
                if(data.error) {  // If there is an error, show the error messages
                    alert(data.error.text).show();
                }
                else { // If not, send them back to the home page
                	//console.log(data.id);
                	window.localStorage.setItem("id_user", data.id);
                	window.localStorage.setItem("email_user", data.email);
                	window.localStorage.setItem("login_user", true);
                    Backbone.history.navigate("#home/" + data.id , true);
                }
            },
            complete:function(){
            	$.mobile.hidePageLoadingMsg();
            }
        });
	}
});