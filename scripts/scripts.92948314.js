window.TP={},TP.init=function(a){console.log("Canvas got species from Angular: "+a),this.canvas=document.getElementById("canvas"),this.ctx=canvas.getContext("2d"),this.width=canvas.width,this.height=canvas.height,this.registerHandlers(),this.ctx.globalCompositeOperation="darker",this.ctx.globalAlpha=.9,this.animId=null,this.shapeList=[],this.animate()},TP.registerHandlers=function(){var a=this;this.canvas.onclick=function(b){var c=new TP.Square(b.offsetX,b.offsetY,40,a.ctx);c.render(),a.shapeList.push(c)}},TP.pause=function(){cancelAnimationFrame(this.animId),this.animId=null},TP.play=function(){var a=this;this.animId||(this.animId=requestAnimationFrame(function(){a.animate()}))},TP.animate=function(){var a=this;this.render(),this.animId=requestAnimationFrame(function(){a.animate()})},TP.render=function(){this.ctx.clearRect(0,0,this.width,this.height);for(var a in this.shapeList)this.shapeList[a].animate()},TP.Square=function(a,b,c,d){this.x=a,this.y=b,this.size=c,this.ctx=d,this.color="#"+Math.floor(16777215*Math.random()).toString(16),this.xdirection="left",this.ydirection="up"},TP.Square.prototype.move=function(a,b){this.x=a,this.y=b},TP.Square.prototype.render=function(){this.ctx.beginPath(),this.ctx.rect(this.x,this.y,this.size,this.size),this.ctx.closePath(),this.ctx.fillStyle=this.color,this.ctx.fill()},TP.Square.prototype.animate=function(){var a=this.bounceBack(this.x,this.y,TP.canvas.width,TP.canvas.height);this.move(a.x,a.y),this.render()},TP.Square.prototype.bounceBack=function(a,b,c,d){var e,f;return 0===a&&0===b?(this.ydirection="down",this.xdirection="right",{x:a+1,y:b+1}):a===c&&0===b?(this.ydirection="down",this.xdirection="left",{x:a-1,y:b+1}):0===a&&b===d?(this.ydirection="up",this.xdirection="right",{x:a+1,y:b-1}):a===c&&b===d?(this.ydirection="up",this.xdirection="left",{x:a-1,y:b-1}):0===a?(e=a+1,f="up"===this.ydirection?b+1:b-1,this.xdirection="right",{x:e,y:f}):a===c?(e=a-1,f="up"===this.ydirection?b+1:b-1,this.xdirection="left",{x:e,y:f}):0===b?(f=b+1,e="left"===this.xdirection?a+1:a-1,this.ydirection="bottom",{x:e,y:f}):b===d?(f=b-1,e="left"===this.xdirection?a+1:a-1,this.ydirection="up",{x:e,y:f}):(e="left"===this.xdirection?a-1:a+1,f="up"===this.ydirection?b-1:b+1,{x:e,y:f})},TP.Square.prototype.comeBackTheOtherSide=function(a,b,c,d){var e,f;return e=0>a-1?c:a-1,f=0>b-1?d:b-1,{x:e,y:f}},angular.module("globiProtoApp",["ui.router","ngResource","ngAnimate","ngAria","ngCookies","ngSanitize","ngTouch","ui.bootstrap","leaflet-directive"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("main",{url:"/main?name&interaction",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/main.html",controller:"MainCtrl"}}}).state("map",{url:"/map?sourceTaxon&targetTaxon&interactionType",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/map.html",controller:"MapCtrl"}}}).state("network",{url:"/network?taxon&interaction",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/network.html",controller:"NetworkCtrl"}}}).state("play",{url:"/play",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/play.html",controller:"PlayCtrl"}}}).state("about",{url:"/about",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/about.html",controller:"AboutCtrl"}}}),b.otherwise("/main")}]),angular.module("globiProtoApp").controller("NavCtrl",["$scope",function(a){a.$on("$stateChangeSuccess",function(b,c){a.state=c.name})}]),angular.module("globiProtoApp").controller("MainCtrl",["$scope","closeMatch","images","$rootScope","interactionTypes","taxonInteraction","$state",function(a,b,c,d,e,f,g){var h=function(){a.searchResults=[],f.get({taxon:a.query.name,interaction:a.query.interaction}).$promise.then(function(b){if(b.data.length>0){var e=b.data[0][2];e.forEach(function(b){c.get({taxon:b}).$promise.then(function(b){a.searchResults.push({scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}),d.$emit("taxonEvent",a.searchResults[a.searchResults.length-1]),d.$broadcast("taxonEvent",a.searchResults[a.searchResults.length-1])},function(a){console.dir(a)})})}else console.warn("No interactions found for: "+JSON.stringify(a.query))},function(a){console.dir(a)})},i=function(b){c.get({taxon:b}).$promise.then(function(b){a.taxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.query={name:g.params.name,interaction:g.params.interaction},a.query.name&&(i(a.query.name),a.query.interaction&&h()),a.taxon={},a.interactions=[],a.searchResults=[],e.get().$promise.then(function(b){Object.keys(b).forEach(function(c){c.match(/^\$/)||a.interactions.push({name:c,source:b[c].source,target:b[c].target})})}),a.getResults=function(a){return b.get({taxon:a}).$promise.then(function(a){return a.data.map(function(a){return{scientificName:a[0],commonName:j(a[1])}})})};var j=function(a){var b,c,d="";return a&&(b=a.split(" | "),b.forEach(function(a){a.match(/@en/)&&(c=a.split("@"),d=c[0])})),d};a.taxonSelected=function(b){a.query.name=b.scientificName,a.query.interaction=null,a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})},a.search=function(){g.transitionTo("main",a.query,{location:!0,reload:!0})},a.clear=function(){a.query={},a.taxon={},a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})},a.$on("followEvent",function(b,c){a.query.name=c.imageData.scientificName,a.query.interaction=c.interactionType,a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})}),a.$on("mapEvent",function(a,b){g.transitionTo("map",{sourceTaxon:g.params.name,targetTaxon:b.imageData.scientificName,interactionType:g.params.interaction||"preysOn"},{location:!0,reload:!0})}),a.$on("networkEvent",function(a,b){g.transitionTo("network",{taxon:b.imageData.scientificName,interaction:g.params.interaction||"eats"},{location:!0,reload:!0})})}]),angular.module("globiProtoApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("globiProtoApp").controller("PlayCtrl",function(){var a="Thunnus albacares";TP.init(a)}),angular.module("globiProtoApp").controller("NetworkCtrl",["$scope","$state","taxonInteraction2","graphService",function(a,b,c,d){d.init(),a.query={taxon:b.params.taxon||"Thunnus obesus",interaction:b.params.interaction||"eats"},c.query(a.query,function(b){if(b.length>0){var c={name:b[0].source.name,group:1};a.graph=d.append(b,c)}else console.warn("No interactions found for: "+JSON.stringify(a.query))},function(a){console.dir(a)}),a.$on("nodeClicked",function(b,e){c.query({taxon:e.name,interaction:a.query.interaction},function(b){a.graph=d.append(b,e)},function(a){console.dir(a)})}),a.breadcrumbs=d.getPath()}]),angular.module("globiProtoApp").factory("closeMatch",["$resource","apiUrl",function(a,b){return a(b+"/findCloseMatchesForTaxon/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").value("apiUrl","http://api.globalbioticinteractions.org"),angular.module("globiProtoApp").factory("images",["$resource","apiUrl",function(a,b){return a(b+"/imagesForName/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").directive("miniTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=miniTile"},templateUrl:"views/miniTile.html"}}),angular.module("globiProtoApp").directive("imageTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=imageTile"},templateUrl:"views/imageTile.html",controller:"ImagetileCtrl"}}),angular.module("globiProtoApp").controller("ImagetileCtrl",["$scope","$rootScope",function(a,b){a.follow=function(a,c){var d={imageData:a,interactionType:c};b.$broadcast("followEvent",d)},a.map=function(a){var c={imageData:a};b.$broadcast("mapEvent",c)},a.network=function(a){var c={imageData:a};b.$broadcast("networkEvent",c)}}]),angular.module("globiProtoApp").factory("interactionTypes",["$resource","apiUrl",function(a,b){return a(b+"/interactionTypes")}]),angular.module("globiProtoApp").factory("taxonInteraction",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction"})}]),angular.module("globiProtoApp").factory("taxonInteraction2",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction",type:"json.v2"})}]),angular.module("globiProtoApp").factory("taxonInteractionDetails",["$resource","apiUrl",function(a,b){return a(b+"/interaction",{interactionType:"@interactionType",sourceTaxon:"@sourceTaxon",targetTaxon:"@targetTaxon",includeObservations:"true",type:"json.v2"})}]),angular.module("globiProtoApp").controller("MapCtrl",["$scope","$state","taxonInteractionDetails","images",function(a,b,c,d){var e=function(a){var b={};return a.forEach(function(a){if(a.study&&a.latitude&&a.longitude){var c=a.study.replace(/\s|\-/g,"")+a.latitude.toString().replace("-","#")+"_"+a.longitude.toString().replace("-","#");b[c]?(b[c].itemCount+=1,b[c].message=a.study+", "+b[c].itemCount+" Observations"):b[c]={lat:a.latitude,lng:a.longitude,message:a.study+", 1 Observations",focus:!0,draggable:!1,itemCount:1}}}),b},f=function(a){var b=0,c=0;return Object.keys(a).forEach(function(d){b+=a[d].lat,c+=a[d].lng}),{lat:b/Object.keys(a).length,lng:c/Object.keys(a).length,zoom:2}},g=function(b){console.dir(b),d.get({taxon:b.source_taxon_name}).$promise.then(function(b){a.sourceTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})},h=function(b){d.get({taxon:b.target_taxon_name}).$promise.then(function(b){a.targetTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.center={},c.query({interactionType:b.params.interactionType,sourceTaxon:b.params.sourceTaxon,targetTaxon:b.params.targetTaxon},function(b){g(b[0]),h(b[0]),a.markers=e(b),a.center=f(a.markers)},function(a){console.dir(a)})}]),angular.module("globiProtoApp").directive("networkVis",["graphService",function(a){return{restrict:"E",scope:{val:"="},link:function(b,c){var d,e=960,f=500,g=d3.scale.category10(),h=d3.layout.force().charge(-120).linkDistance(80).size([e,f]),i=h.nodes(),j=h.links(),k=4,l=12,m=function(a,b){var c=d3.geom.quadtree(b);return function(b){var d=2*l+k,e=b.x-d,f=b.x+d,g=b.y-d,h=b.y+d;c.visit(function(c,i,j,k,l){if(c.point&&c.point!==b){var m=b.x-c.point.x,n=b.y-c.point.y,o=Math.sqrt(m*m+n*n);d>o&&(o=(o-d)/o*a,b.x-=m*=o,b.y-=n*=o,c.point.x+=m,c.point.y+=n)}return i>f||e>k||j>h||g>l})}},n=d3.select(c[0]).append("svg").attr("width",e).attr("height",f),o=function(){var a=n.selectAll(".link").data(j);a.enter().insert("line").attr("class","link").style("stroke-width","2"),a.exit().remove();var c=n.selectAll(".node").data(i),d=c.enter().append("g").attr("class","node").call(h.drag);d.append("circle").attr("r",10).style("fill",function(a){return g(a.group)}).on("click",function(a){a.circleColor=d3.select(this).attr("style").split("fill: ")[1],b.$emit("nodeClicked",a)}),d.append("text").attr("dx",11).attr("dy",".45em").text(function(a){return a.name}).style("stroke",function(a){return g(a.group)}),c.exit().remove(),h.on("tick",function(){a.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),c.attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("circle").attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("text").attr("x",function(a){return a.x}).attr("y",function(a){return a.y}),c.each(m(.5,i))}),h.start()};b.$watch("val",function(b){b&&(d=angular.copy(b),i.push.apply(i,d.nodes),j.push.apply(j,d.links),o(),d3.selectAll("text").style("stroke",function(b){return a.isNodeInPath(b.name)||a.isNodeTargetOfPathTip(b.name)?g(b.group):"#b3b1b1"}))})}}}]),angular.module("globiProtoApp").factory("graphService",function(){var a=10,b={nodes:[],links:[],path:[]},c=function(a,b){for(var c=null,d=0;d<b.length;d++)a===b[d].name&&(c=d);return c},d=function(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d];a.source===e.source&&a.target===e.target&&(c=d)}return c},e=function(){return b.path.length>0?b.path[b.path.length-1]:null};return{init:function(){b={nodes:[],links:[],path:[]}},append:function(f,g){var h,i,j,k,l={nodes:[],links:[]},m=Math.min(a,f.length);k=e(),k||b.path.push(g),k&&k.group!==g.group&&b.path.push(g),k&&k.group===g.group&&(b.path.pop(),b.path.push(g)),null===c(g.name,b.nodes)&&(b.nodes.push(g),l.nodes.push(g)),j=c(g.name,b.nodes);for(var n=0;m>n;n++)i=f[n],null===c(i.target.name,b.nodes)&&(h={name:i.target.name,group:g.group+1},b.nodes.push(h),l.nodes.push(h));for(var o=0;m>o;o++){i=f[o];var p={source:j,target:c(i.target.name,b.nodes),value:1};d(p,b.links)||(b.links.push(p),l.links.push(p))}return l},getPath:function(){return b.path},isNodeInPath:function(a){return null!==c(a,b.path)?!0:!1},isNodeTargetOfPathTip:function(a){var d,e,f=c(a,b.nodes);if(b.path.length>0&&null!==c){d=b.path[b.path.length-1],e=c(d.name,b.nodes);for(var g=0;g<b.links.length;g++){var h=b.links[g];if(h.source===e&&h.target===f)return!0}}return!1}}});