/* Author: Andrew Wessels Jun, 2012 */
(function($, window, document, undefined){
    var Page = Backbone.Model.extend({
        idAttribute: "nid"
    });
    
    PageList = Backbone.Collection.extend({
        model: Page,
        url: function(){
            if (this.nid)
                return '/json/content/all/'+this.nid;
            else
                return '/json/content/page/';
        },
        test: function() {
            return this.filter(function(page){
                return page.get('nid');
            });
        },
    });
    
    var PageView = Backbone.View.extend({
        //el: $('#app'),
        tagName: 'article',
        //id: 'app',
        template: function(data){
            return  '<h2 class="title">'+data['title']+'</h2>'+
                    '<div class="body">'+data['body']+'</div>';
        },
        initialize: function(){
            
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    
    var Menu = Backbone.Model.extend({
        idAttribute: "nid"
    });
    
    var MenuList = Backbone.Collection.extend({
        model: Menu,
        url: function(){
            return '/json/menu/'+(this.type?this.type:'');
        },
    });
    
    var MenuView = Backbone.View.extend({
        //el: $('#app'),
        tagName: 'menu',
        //id: 'app',
        template: function(data){
            //return '<li><a href="'+data['path']+'" alt="/node/'+data['nid']+'">'+data['title']+'</a></li>';
            return '<li><a href="#node/'+data['nid']+'" alt="/node/'+data['nid']+'">'+data['title']+'</a></li>';
        },
        initialize: function(){
            this.$el.append('<h3>'+this.options['title']+'</h3>');
            this.$ul = $('<ul>').appendTo(this.$el);
            this.menus = new MenuList();
            this.menus.bind('add',	 this.add, this);
            this.menus.bind('reset', this.addAll, this);
            this.menus.type = this.options['type']?this.options['type']:'';
            this.menus.fetch();
        },
        add: function(m){
            //var view = new PageView({model: m});
            //view.render().$el.appendTo(this.$menu);
            var output = this.template(m.toJSON());
            this.$ul.append(output);
        },
        addAll: function(e){ //gets fired after fetch()
            var _this = this; //fixes scoping issue.
            this.$ul.empty();
            e.each(function(d){
                _this.add(d);
            });
            
        },
        render: function(){
            //this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    
    var App = Backbone.View.extend({
        el: $('#app')[0],
        //tagName: 'article',
        //id: 'app',
        
        initialize: function(){
            this.$main = this.$el.find('#main');
            this.$content = this.$main.find('#content');
            this.$menu = this.$main.find('#menu');
            this.$loading = this.$main.find('#loading');
            new MenuView({title:'Pages', type:'page'}).$el.appendTo(this.$menu);
            new MenuView({title:'Articles', type:'article'}).$el.appendTo(this.$menu);
            this.pages = new PageList();
            
            this.pages.bind('add',	 this.addPage, this);
            this.pages.bind('reset', this.addAllPages, this);
            //this.pages.bind('all',	 this.render, this);

            //this.pages.fetch();
            //router.bind("route:getNode", this.selectPage, this);
            //this.selectPage();
            
            //$('<div id="overlay"></div>').appendTo(this.$el);
            //$('<div id="loading">loading</div>').appendTo(this.$main);
        },
        
        selectPage: function(nid){
            this.$content.hide();
            this.$loading.show();
            this.pages.nid = nid;
            var _this = this;
            this.pages.fetch({
                success:function(e){
                    _this.$loading.hide();
                    _this.$content.show('fast');
                }
            });
            
            //log("get node:", nid, _this.pages.url());
        },
        
        //clicked: function(e){
        //    console.log('clicked..');
        //    var names = ['Bob', 'Bill', 'Jill', 'Tom', 'Ace'];
        //    var rand = Math.floor(Math.random()*names.length);
        //    list.add({"id":this.thingid++, "status": Math.round(Math.random()*2), "title":names[rand]+" job"});
        //},
        
        addPage: function(m){
            var view = new PageView({model: m});
            view.render().$el.appendTo(this.$content);
        },
        
        addAllPages: function(e){ //gets fired after fetch()
            var _this = this; //fixes scoping issue.
            this.$content.empty();
            e.each(function(d){
                _this.addPage(d);
            });
        },
        
        render: function(){
            console.log("render");
            //this.pages.fetch();
        }
    });
    
    var app = new App();
    
    var Workspace = Backbone.Router.extend({
        routes: {
            "":                     "getNode",
            "about":                "about",
            "node/:nid":            "getNode",
        },
        //help: function() {
        //    log("Help Fired!");
        //},
        getNode: function(nid) {
            app.selectPage(nid);
            //log('looking at node: ', nid);
        }
    });
    var router = new Workspace;
    Backbone.history.start();
    
    //var pview = new PageView;
    //log(pview);
    
    $(document).ready(function(){
        var $main = $('div#main'),
            $content = $main.children('#content');
        //pview.$el.appendTo($content);
    });
})(jQuery, this, document);