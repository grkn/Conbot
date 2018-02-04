
Vue.component('i18n_custom',{

	template : '<select v-model="lang"  v-on:change="changeLanguage">'
	+'<option value="en">{{ $t("message.english") }}</option>'
	+'<option value="tr">{{ $t("message.turkish") }}</option>'
	+'</select>',

	methods : {
		changeLanguage : function(){
			window.localStorage.setItem("lang", this.lang);
			window.location.reload();
		}
	},
	data : function(){
		return {lang : window.localStorage.getItem('lang')};
	}
});



if(!window.localStorage.getItem("lang"))
		window.localStorage.setItem("lang", "tr");

var i18n = new VueI18n({
  locale: window.localStorage.getItem("lang"), // set locale
  messages:messages // set locale messages
});

Vue.component('entity',{
	template : '<div class="col-sm-6 col-md-4">'
					+'<div class="thumbnail">'
					  +'<div class="caption">'
						+'<h3>{{value}} </h3>'
						+'<p><input type="text" v-model="sentence"></p>'
						+'<p><label>{{$t("message.storedSentence")}} : </label><span><select v-model="expression"><option v-for="exp in expressions" >{{ exp }}</option></select></span></p>'
						+'<p><a  class="btn btn-primary" role="button" v-on:click="removeSentece(value)">{{$t("message.remove")}}</a>'
						+'<a class="btn btn-default" role="button" v-on:click="addSentence(value)">{{$t("message.add")}}</a></p>'
					  +'</div>'
					+'</div>'
				  +'</div>',
	props: ['value','index','expressions'],

	methods : {
		addSentence : function(id){
			console.log(id);
			if(this.sentence.trim() != ""){
					this.expressions.push(this.sentence)
					Vue.http.post("/post/intent/expressions",{value : this.value ,expressions:this.expressions}).then(function(resp){

					})
			}
		},
		removeSentece : function(id){
			if(this.expression.trim() != ""){
				var index = this.expressions.indexOf(this.expression);
				this.expressions.splice(index,1);
				Vue.http.delete("/delete/intent/expressions",{value : this.value , expression : this.expression}).then(function(resp){

				});
			}
		}
	},
	data :	function () {
		return {sentence : "",expression : ""}

	}

});

Vue.component('row',{
	template : '<div class="row"> <entity v-for="(entity,index) in array" v-bind:value="entity.value" v-bind:expressions="entity.expressions"  v-bind:index="index" :key="entity.value"></entity></div>',
	props: ['array']

});

var container = Vue.component('container',{
	template: 	'<div style="position:relative;width:80%;left:10%">'
						+'<div class="header"><div class="page-header">'
							+'<div  style="text-align:center">'
								+'<h1>{{$t("message.header")}}</h1>'
							+'</div>'
							+'<span>'
								+'<router-link :to="{ name: \'home\'}">{{$t("message.home")}}</router-link>'
								+'<router-link :to="{ name: \'answers\'}">{{$t("message.answers")}}</router-link>'
							+'</span>'
							+'<span style="float:right">'
								+'<i18n_custom></i18n_custom>'
							+'</span>'
						+'</div>'
				+'</div>'
				+'<div class="content"><div style="width:20%;display:inline-block">'
				+'<ul v-for="intent in this.original"><li v-for="i in intent"><span v-on:click="showOnlyThisItem(i)">{{i.value}}</span></li></ul></div><div style="width:80%;display:inline-block;vertical-align: top;" ><div ><label>{{$t("message.search")}}</label> <input type="text" v-model="searchText" v-on:keyup="search"/></div><br/><br/>'
				+'<row v-for="entityArray in this.intentList"  v-bind:array="entityArray" ></row></div></div>'
				+'<div class="footer"></div></div>',
	methods : {
		showOnlyThisItem : function(entity){
			this.intentList=[[entity]];
		},
		search : function(){
			if(this.searchText.trim() == ""){
				this.immutableObjectToEntity();
				return;
			}
			this.immutableObjectToEntity();
			for(var i = 0 ; i < this.original.length ;i++){
				for(var j = 0 ; j < this.original[i].length;j++){
					if(this.original[i][j].value.toLocaleUpperCase().indexOf(this.searchText.toLocaleUpperCase()) < 0){
						var k = 0 ;
						for(k=0 ; k < this.intentList.length;k++){
							var z = 0 ;
							var flag = false;
							for(z = 0 ; z < this.intentList[k].length; z++){
								if(this.intentList[k][z].value == this.original[i][j].value){
									flag= true;
									break;
								}
							}
							if(flag){
								this.intentList[k].splice(z,1);
							}
						}
					}
				}
			}
		},
		immutableObjectToOriginal: function(){
			for(var i = 0 ; i < this.intentList.length ;i++){
				var mod3Array = [];
				for(var j = 0 ; j < this.intentList[i].length;j++){
					var obj = {};
					for(var key in this.intentList[i][j]){
						obj[key] = this.intentList[i][j][key];
					}
					mod3Array = mod3Array.concat(obj);
				}

				this.original.push(mod3Array);
			}
		},
		immutableObjectToEntity: function(){
			this.intentList = [];
			for(var i = 0 ; i < this.original.length ;i++){
				var mod3Array = [];
				for(var j = 0 ; j < this.original[i].length;j++){
					var obj = {};
					for(var key in this.original[i][j]){
						obj[key] = this.original[i][j][key];
					}
					mod3Array = mod3Array.concat(obj);
				}

				this.intentList.push(mod3Array);
			}
		},
		mountFunc : function(iList,func){
			Vue.http.get("/get/witai/entities").then(function(resp){
				  var counter = 0;
					var index = -1;
					for(var i= 0; i < resp.data.values.length;i++){
						if(counter % 3 == 0){
							index++;
							iList[index] = [];
						}
						iList[index].push(resp.data.values[i]);
						counter++;
					}
					func();
			});
		}
	},
	mounted : function(){
		this.$nextTick(function () {
			this.mountFunc(this.intentList,this.immutableObjectToOriginal);
	  })

	},
	data :	function () {
		return {intentList :[], original :[],
		searchText : ""}

	}
});



Vue.component('entity_answers',{
	template : '<div class="col-sm-6 col-md-4">'
					+'<div class="thumbnail">'
					  +'<div class="caption">'
						+'<h3>{{value}} </h3>'
						+'<p><input type="text" v-model="sentence.value"></p>'
						+'<p><label>{{$t("message.storedSentence")}} : {{sentence.default}}</span></p>'
						+'<p><a  class="btn btn-primary" role="button" v-on:click="removeSentece(value)">{{$t("message.remove")}}</a>'
						+'<a class="btn btn-default" role="button" v-on:click="addSentence(value)">{{$t("message.add")}}</a></p>'
					  +'</div>'
					+'</div>'
				  +'</div>',
	props: ['value','index','expressions'],

	methods : {
		addSentence : function(id){
			if(this.sentence.value.trim() != ""){
				Vue.http.post("/send/meaningful/sentence",{intent : this.value ,message:this.sentence.value}).then(function(resp){

				})
			}
		},
		removeSentece : function(id){
			if(this.sentence.default.trim() != ""){
				Vue.http.delete("/delete/meaningful/sentence",{intent : this.value ,message:this.sentence.default}).then(function(resp){

				})
			}
		}
	},
	mounted : function(){
		this.$nextTick(function () {
			var sentence = this.sentence
			Vue.http.get("/get/meaningful/sentence",{intent : this.value}).then(function(resp){
					 sentence.default = resp.data;
			})
	  })
	},
	data :	function () {
		return {sentence : {value : "",default : ""},expression : ""}
	}
});


Vue.component('row_answers',{
	template : '<div class="row"> <entity_answers v-for="(entity,index) in array" v-bind:value="entity.value" v-bind:expressions="entity.expressions"  v-bind:index="index" :key="entity.value"></entity_answers></div>',
	props: ['array']


});

var answersContainer = Vue.component("answers",{
	template: 	'<div style="position:relative;width:80%;left:10%">'
						+'<div class="header"><div class="page-header">'
							+'<div  style="text-align:center">'
								+'<h1>{{$t("message.header")}}</h1>'
							+'</div>'
							+'<span>'
								+'<router-link :to="{ name: \'home\'}">{{$t("message.home")}}</router-link>'
								+'<router-link :to="{ name: \'answers\'}">{{$t("message.answers")}}</router-link>'
							+'</span>'
							+'<span style="float:right">'
								+'<i18n_custom></i18n_custom>'
							+'</span>'
						+'</div>'
				+'</div>'
				+'<div class="content"><div style="width:20%;display:inline-block">'
				+'<ul v-for="intent in this.original"><li v-for="i in intent"><span v-on:click="showOnlyThisItem(i)">{{i.value}}</span></li></ul></div><div style="width:80%;display:inline-block;vertical-align: top;" ><div ><label>{{$t("message.search")}}</label> <input type="text" v-model="searchText" v-on:keyup="search"/></div><br/><br/>'
				+'<row_answers v-for="entityArray in this.intentList"  v-bind:array="entityArray" ></row_answers></div></div>'
				+'<div class="footer"></div></div>',
	methods : {
		showOnlyThisItem : function(entity){
			this.intentList=[[entity]];
		},
		search : function(){
			if(this.searchText.trim() == ""){
				this.immutableObjectToEntity();
				return;
			}
			this.immutableObjectToEntity();
			for(var i = 0 ; i < this.original.length ;i++){
				for(var j = 0 ; j < this.original[i].length;j++){
					if(this.original[i][j].value.toLocaleUpperCase().indexOf(this.searchText.toLocaleUpperCase()) < 0){
						var k = 0 ;
						for(k=0 ; k < this.intentList.length;k++){
							var z = 0 ;
							var flag = false;
							for(z = 0 ; z < this.intentList[k].length; z++){
								if(this.intentList[k][z].value == this.original[i][j].value){
									flag= true;
									break;
								}
							}
							if(flag){
								this.intentList[k].splice(z,1);
							}
						}
					}
				}
			}
		},
		immutableObjectToOriginal: function(){
			for(var i = 0 ; i < this.intentList.length ;i++){
				var mod3Array = [];
				for(var j = 0 ; j < this.intentList[i].length;j++){
					var obj = {};
					for(var key in this.intentList[i][j]){
						obj[key] = this.intentList[i][j][key];
					}
					mod3Array = mod3Array.concat(obj);
				}

				this.original.push(mod3Array);
			}
		},
		immutableObjectToEntity: function(){
			this.intentList = [];
			for(var i = 0 ; i < this.original.length ;i++){
				var mod3Array = [];
				for(var j = 0 ; j < this.original[i].length;j++){
					var obj = {};
					for(var key in this.original[i][j]){
						obj[key] = this.original[i][j][key];
					}
					mod3Array = mod3Array.concat(obj);
				}

				this.intentList.push(mod3Array);
			}
		},
		mountFunc : function(iList,func){
			Vue.http.get("/get/witai/entities").then(function(resp){
				  var counter = 0;
					var index = -1;
					for(var i= 0; i < resp.data.values.length;i++){
						if(counter % 3 == 0){
							index++;
							iList[index] = [];
						}
						iList[index].push(resp.data.values[i]);
						counter++;
					}
					func();
			});
		}
	},
	mounted : function(){
		this.$nextTick(function () {
			this.mountFunc(this.intentList,this.immutableObjectToOriginal);
	  })

	},
	data :	function () {
		return {intentList :[], original :[],
		searchText : ""}

	}

})
var vrouter = new VueRouter({
	routes: [
	{name: 'home', path: '/', component: container },
	{name: 'answers', path: '/answers', component: answersContainer }
	]
});

var vue = new Vue({
  el: '#app',
  data: {
  },
  methods :{
  }
  ,
	mounted: function () {
	  this.$nextTick(function () {

	  })
	}
  ,
  methods : {},
  router : vrouter,
  i18n : i18n

});
