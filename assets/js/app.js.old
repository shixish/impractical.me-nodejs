var App = Em.Application.create({
  title: 'Impractical.me',
  //rootElement: '#main',
});

App.Page = Em.Object.extend({
  title: 'something'
});

App.pageController = Em.ArrayController.create({
	content: [],
	loadPages: function(){
		var self = this;
    self.pushObject(App.Page.create({title:'Home'}));
		//$.getJSON('data/books.json', function(data) {
		//	data.forEach(function(item){
		//		
		//	});
		//});
	}
});

App.MyView = Em.View.extend({
  mouseDown: function() {
    window.alert("hello world!");
  }
});

App.Page = Em.Object.extend({
  title: 'Blank',
  body: '',
});

var page = App.Page.create({
  title: 'Home',
  body: 'some content'
});

App.page = Em.View.create({
  templateName: 'page',
  name: "Bob"
});
//console.log(page);