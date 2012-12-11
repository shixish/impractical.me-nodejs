requirejs.config({
  baseUrl: 'js/libs',
  paths: {
      //jquery: 'libs/jquery-1.7.1.min',
      //ember: 'libs/ember',
      text: 'plugins/text'
  },
  shim: {
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'Backbone'
    },
    'ember':{
      deps: ['jquery', 'handlebars'],
      exports: 'Ember',
    }
  }
});

// Load our app
define('App', [
    'jquery',
    'ember', 
    //'app/models/api',
    ], function($, Em) {
        //return window.App = Em.Application.create({
        //    // Application version
        //    VERSION: '0.1-omfg',
        //    // Application root element
        //    rootElement: '#content',
        //    // Controllers namespace
        //    Controllers: {},
        //    // Views namespace
        //    Views: {},
        //    // App viewport
        //    viewport: Em.ContainerView.create({
        //        switchTo: function(view) {
        //            this.get('childViews').popObject();
        //            this.get('childViews').pushObject(view);
        //        }
        //    }),
        //    init: function() {
        //        this._super();
        //        this.get('viewport').appendTo(this.get('rootElement'));
        //        // Api instance
        //        this.set('API', Api.create());
        //        require(['app/controllers/login'], function(LoginCtrl){
        //            LoginCtrl.activate();
        //        });
        //    }
        //});
    return window.App = Em.Application.create({
      title: 'Impractical.me',
      VERSION: "0.0.1",
      //rootElement: '#main',
      
      Page: Em.Object.extend({
        title: 'something',
        body: '',
      }),
    
      pageControlle: Em.ArrayController.create({
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
      }),
    
      MyView: Em.View.extend({
        template: Handlebars.compile('<button class="btn btn-primary" href="#">Say Hello</button>fixed it.'),
        mouseDown: function() {
          window.alert("hello world!");
        }
      }),
      
      //page: App.Page.create({
      //  title: 'Home',
      //  body: 'some content'
      //}),
      //
      //page: Em.View.create({
      //  templateName: 'page',
      //  name: "Bob"
      //}),
    });
  }
);

require(['App'], function(App){
  //console.log('App', App);
});

require(["jquery"], function($) {
  //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
  $(function() {
    
  });
});

//require(["jquery", "backbone", "handlebars", "bootstrap"], function($, Backbone) {
//  //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
//  console.log('backbone', Backbone);
//  $(function() {
//    //alert('test');
//      //$('body').alpha().beta();
//  });
//});
