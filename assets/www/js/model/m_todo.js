var M_Todo = Backbone.Model.extend({
	defaults:{
		id			:'',
		id_user 	:'',
		judul		:'',
		kegiatan	:'',
		tanggal 	:'',
		aktif 		:'',
	},
	url: server + 'todo.php'
});

var C_Todo = Backbone.Collection.extend({
	model:M_Todo,
	url: server + "todo.php/getall"
});
