var M_User = Backbone.Model.extend({
	defaults:{
		id			:'',
		firstName 	:'',
		email		:'',
		address		:'',
		city 		:'',
		state 		:'',
		postalCode	:'',
		country		:''
	},
	url: function(){
	    if (this.isNew()){
	      return server + "users.php";
	    } else {
	      return server + "users.php?id=" + this.id;
	    }
    }
});

var C_User = Backbone.Collection.extend({
	model:M_User,
	url: server + "users.php"
});