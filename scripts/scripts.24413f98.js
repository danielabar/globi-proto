window.TP={},TP.init=function(a){console.log("Canvas got species from Angular: "+a),this.canvas=document.getElementById("canvas"),this.ctx=canvas.getContext("2d"),this.width=canvas.width,this.height=canvas.height,this.registerHandlers(),this.ctx.globalCompositeOperation="darker",this.ctx.globalAlpha=.9,this.animId=null,this.shapeList=[],this.animate()},TP.registerHandlers=function(){var a=this;this.canvas.onclick=function(b){var c=new TP.Square(b.offsetX,b.offsetY,40,a.ctx);c.render(),a.shapeList.push(c)}},TP.pause=function(){cancelAnimationFrame(this.animId),this.animId=null},TP.play=function(){var a=this;this.animId||(this.animId=requestAnimationFrame(function(){a.animate()}))},TP.animate=function(){var a=this;this.render(),this.animId=requestAnimationFrame(function(){a.animate()})},TP.render=function(){this.ctx.clearRect(0,0,this.width,this.height);for(var a in this.shapeList)this.shapeList[a].animate()},TP.Square=function(a,b,c,d){this.x=a,this.y=b,this.size=c,this.ctx=d,this.color="#"+Math.floor(16777215*Math.random()).toString(16),this.xdirection="left",this.ydirection="up"},TP.Square.prototype.move=function(a,b){this.x=a,this.y=b},TP.Square.prototype.render=function(){this.ctx.beginPath(),this.ctx.rect(this.x,this.y,this.size,this.size),this.ctx.closePath(),this.ctx.fillStyle=this.color,this.ctx.fill()},TP.Square.prototype.animate=function(){var a=this.bounceBack(this.x,this.y,TP.canvas.width,TP.canvas.height);this.move(a.x,a.y),this.render()},TP.Square.prototype.bounceBack=function(a,b,c,d){var e,f;return 0===a&&0===b?(this.ydirection="down",this.xdirection="right",{x:a+1,y:b+1}):a===c&&0===b?(this.ydirection="down",this.xdirection="left",{x:a-1,y:b+1}):0===a&&b===d?(this.ydirection="up",this.xdirection="right",{x:a+1,y:b-1}):a===c&&b===d?(this.ydirection="up",this.xdirection="left",{x:a-1,y:b-1}):0===a?(e=a+1,f="up"===this.ydirection?b+1:b-1,this.xdirection="right",{x:e,y:f}):a===c?(e=a-1,f="up"===this.ydirection?b+1:b-1,this.xdirection="left",{x:e,y:f}):0===b?(f=b+1,e="left"===this.xdirection?a+1:a-1,this.ydirection="bottom",{x:e,y:f}):b===d?(f=b-1,e="left"===this.xdirection?a+1:a-1,this.ydirection="up",{x:e,y:f}):(e="left"===this.xdirection?a-1:a+1,f="up"===this.ydirection?b-1:b+1,{x:e,y:f})},TP.Square.prototype.comeBackTheOtherSide=function(a,b,c,d){var e,f;return e=0>a-1?c:a-1,f=0>b-1?d:b-1,{x:e,y:f}},angular.module("globiProtoApp",["ui.router","ngResource","ngProgress","ngAnimate","ngAria","ngCookies","ngSanitize","ngTouch","ui.bootstrap","leaflet-directive"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){a.state("main",{url:"/main?name&interaction",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/main.html",controller:"MainCtrl"}}}).state("map",{url:"/map?sourceTaxon&targetTaxon&interactionType",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/map.html",controller:"MapCtrl"}}}).state("network",{url:"/network?taxon&interaction",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/network.html",controller:"NetworkCtrl"}}}).state("play",{url:"/play",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/play.html",controller:"PlayCtrl"}}}).state("about",{url:"/about",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/about.html",controller:"AboutCtrl"}}}),b.otherwise("/main"),c.interceptors.push(["$q","$rootScope",function(a,b){return{request:function(a){return b.$emit("start request"),a},requestError:function(c){return b.$emit("end request"),a.reject(c)},response:function(a){return b.$emit("end request"),a},responseError:function(c){return b.$emit("end request"),a.reject(c)}}}])}]),angular.module("globiProtoApp").run(["$rootScope","ngProgress",function(a,b){a.$on("end request",function(){b.complete()}),a.$on("start request",function(){b.reset(),b.start()})}]),angular.module("globiProtoApp").controller("NavCtrl",["$scope",function(a){a.$on("$stateChangeSuccess",function(b,c){a.state=c.name})}]),angular.module("globiProtoApp").controller("MainCtrl",["$scope","closeMatch","images","$rootScope","interactionTypes","taxonInteraction2","$state","interactionService","maxApiResults",function(a,b,c,d,e,f,g,h,i){var j=function(){a.searchResults=[],f.query({taxon:a.query.name,interaction:a.query.interaction}).$promise.then(function(b){if(b.length>0)for(var e=h.removeDuplicateTargets(b),f=Math.min(b.length,i),g=0;f>g;g++){var j=e[g];c.get({taxon:j.target.name}).$promise.then(function(b){a.searchResults.push({scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}),d.$emit("taxonEvent",a.searchResults[a.searchResults.length-1]),d.$broadcast("taxonEvent",a.searchResults[a.searchResults.length-1])},function(a){console.dir(a)})}else console.warn("No interactions found for: "+JSON.stringify(a.query))},function(a){console.dir(a)})},k=function(b){c.get({taxon:b}).$promise.then(function(b){a.taxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.query={name:g.params.name,interaction:g.params.interaction},a.query.name&&(k(a.query.name),a.query.interaction&&j()),a.taxon={},a.interactions=[],a.searchResults=[],e.get().$promise.then(function(b){Object.keys(b).forEach(function(c){c.match(/^\$/)||a.interactions.push({name:c,source:b[c].source,target:b[c].target})})}),a.getResults=function(a){return b.get({taxon:a}).$promise.then(function(a){return a.data.map(function(a){return{scientificName:a[0],commonName:l(a[1])}})})};var l=function(a){var b,c,d="";return a&&(b=a.split(" | "),b.forEach(function(a){a.match(/@en/)&&(c=a.split("@"),d=c[0])})),d};a.taxonSelected=function(b){a.query.name=b.scientificName,a.query.interaction=null,a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})},a.search=function(){g.transitionTo("main",a.query,{location:!0,reload:!0})},a.clear=function(){a.query={},a.taxon={},a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})},a.$on("followEvent",function(b,c){a.query.name=c.imageData.scientificName,a.query.interaction=c.interactionType,a.searchResults=[],g.transitionTo("main",a.query,{location:!0,reload:!0})}),a.$on("mapEvent",function(a,b){g.transitionTo("map",{sourceTaxon:g.params.name,targetTaxon:b.imageData.scientificName,interactionType:g.params.interaction||"preysOn"},{location:!0,reload:!0})}),a.$on("networkEvent",function(a,b){g.transitionTo("network",{taxon:b.imageData.scientificName,interaction:g.params.interaction||"eats"},{location:!0,reload:!0})})}]),angular.module("globiProtoApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("globiProtoApp").controller("PlayCtrl",function(){var a="Thunnus albacares";TP.init(a)}),angular.module("globiProtoApp").controller("NetworkCtrl",["$scope","$state","taxonInteraction2","graphService",function(a,b,c,d){d.init(),a.query={taxon:b.params.taxon||"Thunnus obesus",interaction:b.params.interaction||"eats"},c.query(a.query,function(b){if(b.length>0){var c={name:a.query.taxon,group:1},e=d.append(b,c);a.graph=e,a.columnGraph=e}else console.warn("No interactions found for: "+JSON.stringify(a.query))},function(a){console.dir(a)}),a.$on("nodeClicked",function(b,e){c.query({taxon:e.name,interaction:a.query.interaction},function(b){var c=d.append(b,e);a.graph=c,a.columnGraph=c},function(a){console.dir(a)})}),a.breadcrumbs=d.getPath()}]),angular.module("globiProtoApp").factory("closeMatch",["$resource","apiUrl",function(a,b){return a(b+"/findCloseMatchesForTaxon/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").value("apiUrl","http://api.globalbioticinteractions.org"),angular.module("globiProtoApp").factory("images",["$resource","apiUrl",function(a,b){return a(b+"/imagesForName/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").directive("miniTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=miniTile"},templateUrl:"views/miniTile.html"}}),angular.module("globiProtoApp").directive("imageTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=imageTile"},templateUrl:"views/imageTile.html",controller:"ImagetileCtrl"}}),angular.module("globiProtoApp").controller("ImagetileCtrl",["$scope","$rootScope",function(a,b){a.follow=function(a,c){var d={imageData:a,interactionType:c};b.$broadcast("followEvent",d)},a.map=function(a){var c={imageData:a};b.$broadcast("mapEvent",c)},a.network=function(a){var c={imageData:a};b.$broadcast("networkEvent",c)}}]),angular.module("globiProtoApp").factory("interactionTypes",["$resource","apiUrl",function(a,b){return a(b+"/interactionTypes")}]),angular.module("globiProtoApp").factory("taxonInteraction",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction"})}]),angular.module("globiProtoApp").factory("taxonInteraction2",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction",type:"json.v2"})}]),angular.module("globiProtoApp").factory("taxonInteractionDetails",["$resource","apiUrl",function(a,b){return a(b+"/interaction",{interactionType:"@interactionType",sourceTaxon:"@sourceTaxon",targetTaxon:"@targetTaxon",includeObservations:"true",fields:"study_title,study_url,latitude,longitude,source_taxon_name,target_taxon_name",type:"json.v2"})}]),angular.module("globiProtoApp").controller("MapCtrl",["$scope","$state","taxonInteractionDetails","images",function(a,b,c,d){var e=function(a){var b={};return a.forEach(function(a){if(a.study_title&&a.latitude&&a.longitude){var c=a.study_title.replace(/\s|\-/g,"")+a.latitude.toString().replace("-","#")+"_"+a.longitude.toString().replace("-","#");b[c]?(b[c].itemCount+=1,b[c].message=b[c].itemCount+' Observations, <a href="'+a.study_url+'">'+a.study_title+"</a>"):b[c]={lat:a.latitude,lng:a.longitude,message:'1 Observation, <a href="'+a.study_url+'">'+a.study_title+"</a>",focus:!0,draggable:!1,itemCount:1}}}),b},f=function(a){var b=0,c=0;return Object.keys(a).forEach(function(d){b+=a[d].lat,c+=a[d].lng}),{lat:b/Object.keys(a).length,lng:c/Object.keys(a).length,zoom:2}},g=function(b){d.get({taxon:b.source_taxon_name}).$promise.then(function(b){a.sourceTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})},h=function(b){d.get({taxon:b.target_taxon_name}).$promise.then(function(b){a.targetTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.center={},c.query({interactionType:b.params.interactionType,sourceTaxon:b.params.sourceTaxon,targetTaxon:b.params.targetTaxon},function(b){g(b[0]),h(b[0]),a.markers=e(b),a.center=f(a.markers)},function(a){console.dir(a)})}]),angular.module("globiProtoApp").directive("networkVis",["graphService",function(a){return{restrict:"E",scope:{val:"="},link:function(b,c){var d,e=960,f=500,g=d3.scale.category10(),h=d3.layout.force().charge(-120).linkDistance(80).size([e,f]),i=h.nodes(),j=h.links(),k=4,l=12,m=function(a,b){var c=d3.geom.quadtree(b);return function(b){var d=2*l+k,e=b.x-d,f=b.x+d,g=b.y-d,h=b.y+d;c.visit(function(c,i,j,k,l){if(c.point&&c.point!==b){var m=b.x-c.point.x,n=b.y-c.point.y,o=Math.sqrt(m*m+n*n);d>o&&(o=(o-d)/o*a,b.x-=m*=o,b.y-=n*=o,c.point.x+=m,c.point.y+=n)}return i>f||e>k||j>h||g>l})}},n=d3.select(c[0]).append("svg").attr("width",e).attr("height",f),o=function(){var a=n.selectAll(".link").data(j);a.enter().insert("line").attr("class","link").style("stroke-width","2"),a.exit().remove();var c=n.selectAll(".node").data(i),d=c.enter().append("g").attr("class","node").call(h.drag);d.append("circle").attr("r",10).style("fill",function(a){return g(a.group)}).on("click",function(a){a.circleColor=d3.select(this).attr("style").split("fill: ")[1],b.$emit("nodeClicked",a)}),d.append("text").attr("dx",11).attr("dy",".45em").text(function(a){return a.name}).style("stroke",function(a){return g(a.group)}),c.exit().remove(),h.on("tick",function(){a.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),c.attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("circle").attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("text").attr("x",function(a){return a.x}).attr("y",function(a){return a.y}),c.each(m(.5,i))}),h.start()};b.$watch("val",function(b){b&&(d=angular.copy(b),i.push.apply(i,d.nodes),j.push.apply(j,d.links),o(),d3.selectAll("text").style("stroke",function(b){return a.isNodeInPath(b.name)||a.isNodeTargetOfPathTip(b.name)?g(b.group):"#b3b1b1"}))})}}}]),angular.module("globiProtoApp").factory("graphService",["maxApiResults","columnGraphValues",function(a,b){var c={nodes:[],links:[],path:[]},d=b.width/b.maxLevel,e=function(a,b){for(var c=null,d=0;d<b.length;d++)a===b[d].name&&(c=d);return c},f=function(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d];a.source===e.source&&a.target===e.target&&(c=d)}return c},g=function(){return c.path.length>0?c.path[c.path.length-1]:null},h=function(a){var b=0;return c.nodes.forEach(function(c){c.group===a&&(b+=1)}),b},i=function(a){for(var b=c.nodes.filter(function(b){return b.group===a.group}),d=0;d<b.length;d++)if(b[d].name===a.name)return d;return 0},j=function(a){return a.group*d},k=function(a){var c=h(a.group),d=b.height/(c+1),e=i(a);return(e+1)*d},l=function(a){a.xPos=j(a),a.yPos=k(a)};return{init:function(){c={nodes:[],links:[],path:[]}},append:function(b,d){var h,i,j,k,m={nodes:[],links:[]},n=Math.min(a,b.length);k=g(),k||c.path.push(d),k&&k.group!==d.group&&c.path.push(d),k&&k.group===d.group&&(c.path.pop(),c.path.push(d)),null===e(d.name,c.nodes)&&(c.nodes.push(d),m.nodes.push(d)),j=e(d.name,c.nodes);for(var o=0;n>o;o++)i=b[o],null===e(i.target.name,c.nodes)&&(h={name:i.target.name,group:d.group+1},c.nodes.push(h),m.nodes.push(h));m.nodes.forEach(function(a){l(a)});for(var p=0;n>p;p++){i=b[p];var q={source:j,target:e(i.target.name,c.nodes),value:1};f(q,c.links)||(c.links.push(q),m.links.push(q))}return m.links.forEach(function(a){var b=c.nodes[a.target],d=e(b.name,m.nodes);null===d&&(a.linkBack=!0)}),m.links.forEach(function(a){var b=c.nodes[a.source],d=c.nodes[a.target];d.initialXPos=b.xPos,d.initialYPos=b.yPos}),m},getPath:function(){return c.path},isNodeInPath:function(a){return null!==e(a,c.path)?!0:!1},isNodeTargetOfPathTip:function(a){var b,d,f=e(a,c.nodes);if(c.path.length>0&&null!==e){b=c.path[c.path.length-1],d=e(b.name,c.nodes);for(var g=0;g<c.links.length;g++){var h=c.links[g];if(h.source===d&&h.target===f)return!0}}return!1}}}]),angular.module("globiProtoApp").value("maxApiResults",20),angular.module("globiProtoApp").factory("interactionService",function(){return{removeDuplicateTargets:function(a){var b=[],c={};return a.forEach(function(a){c[a.target.name]=a}),Object.keys(c).forEach(function(a){b.push(c[a])}),b}}}),angular.module("globiProtoApp").directive("columnNetworkVis",["columnGraphValues","graphService",function(a,b){return{restrict:"E",scope:{val:"="},link:function(c,d){var e=d3.scale.category10(),f=d3.select(d[0]).append("svg").attr("width",a.width).attr("height",a.height);f.append("svg:defs").selectAll("marker").data(["arrow"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",10).attr("refY",0).attr("markerWidth",10).attr("markerHeight",10).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,0");var g=[],h=[],i=function(){var a=f.selectAll(".node").data(g),b=a.enter().append("g").attr("class","node"),d=b.append("circle").attr("cx",function(a){return a.initialXPos}).attr("cy",function(a){return a.initialYPos}).attr("r",1).style("fill",function(a){return e(a.group)}).on("click",function(a){a.circleColor=d3.select(this).attr("style").split("fill: ")[1],c.$emit("nodeClicked",a)});d.transition().delay(function(a,b){return 10*b}).duration(300).ease("linear").attr("r",10).attr("cx",function(a){return a.xPos}).attr("cy",function(a){return a.yPos}),b.append("text").attr("dx",function(a){return a.xPos+10}).attr("dy",function(a){return a.yPos+5}).text(function(a){return a.name}).style("stroke",function(a){return e(a.group)}),a.exit().remove();var i=f.selectAll(".link").data(h),j=i.enter().insert("line").attr("class",function(a){return a.linkBack?"linkback":"link"}).attr("marker-end","url(#arrow)").attr("x1",function(a){return g[a.source].xPos}).attr("y1",function(a){return g[a.source].yPos}).attr("x2",function(a){return g[a.source].xPos}).attr("y2",function(a){return g[a.source].yPos}).style("stroke-width","2");j.transition().delay(function(a,b){return 10*b}).duration(300).ease("linear").attr("x2",function(a){return g[a.target].xPos}).attr("y2",function(a){return g[a.target].yPos}),i.exit().remove()};c.$watch("val",function(a){a&&(g.push.apply(g,a.nodes),h.push.apply(h,a.links),i(),d3.selectAll("text").style("stroke",function(a){return b.isNodeInPath(a.name)||b.isNodeTargetOfPathTip(a.name)?e(a.group):"#b3b1b1"}).style("font-size",function(a){return b.isNodeInPath(a.name)||b.isNodeTargetOfPathTip(a.name)?void 0:"10px"}))})}}}]),angular.module("globiProtoApp").value("columnGraphValues",{width:960,height:500,maxLevel:10});