window.TP={},TP.init=function(a){console.log("Canvas got species from Angular: "+a),this.canvas=document.getElementById("canvas"),this.ctx=canvas.getContext("2d"),this.width=canvas.width,this.height=canvas.height,this.registerHandlers(),this.ctx.globalCompositeOperation="darker",this.ctx.globalAlpha=.9,this.animId=null,this.shapeList=[],this.animate()},TP.registerHandlers=function(){var a=this;this.canvas.onclick=function(b){var c=new TP.Square(b.offsetX,b.offsetY,40,a.ctx);c.render(),a.shapeList.push(c)}},TP.pause=function(){cancelAnimationFrame(this.animId),this.animId=null},TP.play=function(){var a=this;this.animId||(this.animId=requestAnimationFrame(function(){a.animate()}))},TP.animate=function(){var a=this;this.render(),this.animId=requestAnimationFrame(function(){a.animate()})},TP.render=function(){this.ctx.clearRect(0,0,this.width,this.height);for(var a in this.shapeList)this.shapeList[a].animate()},TP.Square=function(a,b,c,d){this.x=a,this.y=b,this.size=c,this.ctx=d,this.color="#"+Math.floor(16777215*Math.random()).toString(16),this.xdirection="left",this.ydirection="up"},TP.Square.prototype.move=function(a,b){this.x=a,this.y=b},TP.Square.prototype.render=function(){this.ctx.beginPath(),this.ctx.rect(this.x,this.y,this.size,this.size),this.ctx.closePath(),this.ctx.fillStyle=this.color,this.ctx.fill()},TP.Square.prototype.animate=function(){var a=this.bounceBack(this.x,this.y,TP.canvas.width,TP.canvas.height);this.move(a.x,a.y),this.render()},TP.Square.prototype.bounceBack=function(a,b,c,d){var e,f;return 0===a&&0===b?(this.ydirection="down",this.xdirection="right",{x:a+1,y:b+1}):a===c&&0===b?(this.ydirection="down",this.xdirection="left",{x:a-1,y:b+1}):0===a&&b===d?(this.ydirection="up",this.xdirection="right",{x:a+1,y:b-1}):a===c&&b===d?(this.ydirection="up",this.xdirection="left",{x:a-1,y:b-1}):0===a?(e=a+1,f="up"===this.ydirection?b+1:b-1,this.xdirection="right",{x:e,y:f}):a===c?(e=a-1,f="up"===this.ydirection?b+1:b-1,this.xdirection="left",{x:e,y:f}):0===b?(f=b+1,e="left"===this.xdirection?a+1:a-1,this.ydirection="bottom",{x:e,y:f}):b===d?(f=b-1,e="left"===this.xdirection?a+1:a-1,this.ydirection="up",{x:e,y:f}):(e="left"===this.xdirection?a-1:a+1,f="up"===this.ydirection?b-1:b+1,{x:e,y:f})},TP.Square.prototype.comeBackTheOtherSide=function(a,b,c,d){var e,f;return e=0>a-1?c:a-1,f=0>b-1?d:b-1,{x:e,y:f}},angular.module("globiProtoApp",["ui.router","ngResource","ngProgress","ngAnimate","toaster","ngAria","ngCookies","ngSanitize","ngTouch","ui.bootstrap","leaflet-directive"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){a.state("main",{url:"/main?name&interaction",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/main.html",controller:"MainCtrl"}}}).state("network",{url:"/network?taxon&interaction",views:{nav:{templateUrl:"views/navNetwork.html",controller:"NavNetworkCtrl"},content:{templateUrl:"views/network.html",controller:"NetworkCtrl"}}}).state("about",{url:"/about",views:{nav:{templateUrl:"views/nav.html",controller:"NavCtrl"},content:{templateUrl:"views/about.html",controller:"AboutCtrl"}}}),b.otherwise("/main"),c.interceptors.push(["$q","$rootScope",function(a,b){return{request:function(a){return b.$emit("start request"),a},requestError:function(c){return b.$emit("end request"),a.reject(c)},response:function(a){return b.$emit("end request"),a},responseError:function(c){return b.$emit("end request"),a.reject(c)}}}])}]),angular.module("globiProtoApp").run(["$rootScope","ngProgress",function(a,b){a.$on("end request",function(){b.complete()}),a.$on("start request",function(){b.reset(),b.start()})}]),angular.module("globiProtoApp").controller("NavCtrl",["$scope",function(a){a.$on("$stateChangeSuccess",function(b,c){a.state=c.name})}]),angular.module("globiProtoApp").controller("MainCtrl",["$scope","closeMatch","images","$rootScope","toaster","interactionTypes","taxonInteraction2","$state","interactionService","maxApiResults",function(a,b,c,d,e,f,g,h,i,j){var k=function(){a.searchResults=[],g.query({taxon:a.query.name,interaction:a.query.interaction}).$promise.then(function(b){if(b.length>0)for(var f=i.removeDuplicateTargets(b),g=Math.min(b.length,j),h=0;g>h;h++){var k=f[h];c.get({taxon:k.target.name}).$promise.then(function(b){a.searchResults.push({scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}),d.$emit("taxonEvent",a.searchResults[a.searchResults.length-1]),d.$broadcast("taxonEvent",a.searchResults[a.searchResults.length-1])},function(a){console.dir(a)})}else e.pop("note","Sorry","No interactions found for: "+a.query.name+" "+a.query.interaction)},function(a){console.dir(a)})},l=function(b){c.get({taxon:b}).$promise.then(function(b){a.taxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.query={name:h.params.name,interaction:h.params.interaction},a.query.name&&(l(a.query.name),a.query.interaction&&k()),a.taxon={},a.interactions=[],a.searchResults=[],f.get().$promise.then(function(b){Object.keys(b).forEach(function(c){c.match(/^\$/)||a.interactions.push({name:c,source:b[c].source,target:b[c].target})})}),a.getResults=function(a){return b.get({taxon:a}).$promise.then(function(a){return a.data.map(function(a){return{scientificName:a[0],commonName:m(a[1])}})})};var m=function(a){var b,c,d="";return a&&(b=a.split(" | "),b.forEach(function(a){a.match(/@en/)&&(c=a.split("@"),d=c[0])})),d};a.taxonSelected=function(b){a.query.name=b.scientificName,a.query.interaction=null,a.searchResults=[],h.transitionTo("main",a.query,{location:!0,reload:!0})},a.search=function(){h.transitionTo("main",a.query,{location:!0,reload:!0})},a.clear=function(){a.query={},a.taxon={},a.searchResults=[],h.transitionTo("main",a.query,{location:!0,reload:!0})},a.$on("followEvent",function(b,c){a.query.name=c.imageData.scientificName,a.query.interaction=c.interactionType,a.searchResults=[],h.transitionTo("main",a.query,{location:!0,reload:!0})}),a.$on("mapEvent",function(a,b){h.transitionTo("map",{sourceTaxon:h.params.name,targetTaxon:b.imageData.scientificName,interactionType:h.params.interaction||"preysOn"},{location:!0,reload:!0})}),a.$on("networkEvent",function(a,b){h.transitionTo("network",{taxon:b.imageData.scientificName,interaction:h.params.interaction||"eats"},{location:!0,reload:!0})})}]),angular.module("globiProtoApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("globiProtoApp").controller("PlayCtrl",function(){var a="Thunnus albacares";TP.init(a)}),angular.module("globiProtoApp").controller("NetworkCtrl",["$scope","$state","taxonInteractionFields","images","graphService","interactionHelper","toaster","$window",function(a,b,c,d,e,f,g,h){e.init(),a.interactionDetails={show:!1},a.query={sourceTaxon:b.params.taxon||"Thunnus obesus",interactionType:b.params.interaction||"eats"},a.$on("followEvent",function(a,c){b.transitionTo("network",{taxon:c.imageData.scientificName,interaction:c.interactionType},{location:!0,reload:!0})}),c.query(a.query,function(b){if(b.length>0){var c={name:a.query.sourceTaxon,group:1},d=e.append(b,c);d.action="add",a.graph=d,a.columnGraph=d}else g.pop("note","Sorry","No interactions found for: "+a.query.sourceTaxon+" "+a.query.interactionType)},function(a){console.dir(a)}),a.$on("nodeClicked",function(b,d){var f;e.getCurrentGroupNumber()>=d.group&&(f=e.rewind(d),f.action="remove",a.columnGraph=f),c.query({sourceTaxon:d.name,interactionType:a.query.interactionType},function(b){b.length>0?(f=e.append(b,d),f.action="add",a.graph=f,a.columnGraph=f):g.pop("note","Sorry","No interactions found for: "+d.name+" "+a.query.interactionType)},function(a){console.dir(a)})}),a.breadcrumbs=e.getPath(),d.get({taxon:a.query.sourceTaxon}).$promise.then(function(b){a.subjectTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(a){console.dir(a)}),a.$on("linkClicked",function(b,c){a.interactionDetails={};var d=e.getLinkNodes(c);f.getSourceTargetDetails(d.sourceName,d.targetName,a.query.interactionType).then(function(b){a.interactionDetails=b,a.interactionDetails.show=!0})}),a.$on("legendClicked",function(a,b){b.wiki&&h.open(b.wiki,"_blank")})}]),angular.module("globiProtoApp").factory("closeMatch",["$resource","apiUrl",function(a,b){return a(b+"/findCloseMatchesForTaxon/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").value("apiUrl","http://api.globalbioticinteractions.org"),angular.module("globiProtoApp").factory("images",["$resource","apiUrl",function(a,b){return a(b+"/imagesForName/:taxon",{taxon:"@taxon"})}]),angular.module("globiProtoApp").directive("miniTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=miniTile"},templateUrl:"views/miniTile.html"}}),angular.module("globiProtoApp").directive("imageTile",function(){return{restrict:"A",replace:!0,scope:{imageData:"=imageTile"},templateUrl:"views/imageTile.html",controller:"ImagetileCtrl",link:function(a,b){a.$on("flipCard",function(){b.hasClass("back-side")?(b.removeClass("back-side"),b.addClass("front-side")):(b.removeClass("front-side"),b.addClass("back-side"))})}}}),angular.module("globiProtoApp").controller("ImagetileCtrl",["$scope","$rootScope",function(a,b){a.follow=function(a,c){var d={imageData:a,interactionType:c};b.$broadcast("followEvent",d)},a.map=function(a){var c={imageData:a};b.$broadcast("mapEvent",c)},a.network=function(a){var c={imageData:a};b.$broadcast("networkEvent",c)},a.flip=function(b){a.$emit("flipCard",b)}}]),angular.module("globiProtoApp").factory("interactionTypes",["$resource","apiUrl",function(a,b){return a(b+"/interactionTypes")}]),angular.module("globiProtoApp").factory("taxonInteraction",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction"})}]),angular.module("globiProtoApp").factory("taxonInteraction2",["$resource","apiUrl",function(a,b){return a(b+"/taxon/:taxon/:interaction",{taxon:"@taxon",interaction:"@interaction",type:"json.v2"})}]),angular.module("globiProtoApp").factory("taxonInteractionDetails",["$resource","apiUrl",function(a,b){return a(b+"/interaction",{interactionType:"@interactionType",sourceTaxon:"@sourceTaxon",targetTaxon:"@targetTaxon",includeObservations:"true",fields:"study_title,study_url,latitude,longitude,source_taxon_name,target_taxon_name",type:"json.v2"})}]),angular.module("globiProtoApp").factory("taxonInteractionFields",["$resource","apiUrl",function(a,b){return a(b+"/interaction",{interactionType:"@interactionType",sourceTaxon:"@sourceTaxon",fields:"source_taxon_name,source_taxon_path,interaction_type,target_taxon_name,target_taxon_path",type:"json.v2"})}]),angular.module("globiProtoApp").controller("MapCtrl",["$scope","$state","taxonInteractionDetails","images","toaster",function(a,b,c,d,e){a.query={sourceTaxon:b.params.sourceTaxon||"Sphyrnidae",interactionType:b.params.interactionType||"eats",targetTaxon:b.params.targetTaxon||"Actinopterygii"};var f=function(a){var b={};return a.forEach(function(a){if(a.study_title&&a.latitude&&a.longitude){var c=a.study_title.replace(/\s|\-/g,"")+a.latitude.toString().replace("-","#")+"_"+a.longitude.toString().replace("-","#");b[c]?(b[c].itemCount+=1,b[c].message=b[c].itemCount+' Observations, <a href="'+a.study_url+'">'+a.study_title+"</a>"):b[c]={lat:a.latitude,lng:a.longitude,message:'1 Observation, <a href="'+a.study_url+'">'+a.study_title+"</a>",focus:!0,draggable:!1,itemCount:1}}}),b},g=function(a){var b=0,c=0;return Object.keys(a).forEach(function(d){b+=a[d].lat,c+=a[d].lng}),{lat:b/Object.keys(a).length,lng:c/Object.keys(a).length,zoom:2}},h=function(b){d.get({taxon:b.source_taxon_name}).$promise.then(function(b){a.sourceTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})},i=function(b){d.get({taxon:b.target_taxon_name}).$promise.then(function(b){a.targetTaxon={scientificName:b.scientificName,commonName:b.commonName,thumbnailURL:b.thumbnailURL,imageURL:b.imageURL,infoURL:b.infoURL}},function(b){console.dir(b),a.taxon={}})};a.center={},c.query(a.query,function(b){h(b[0]),i(b[0]),a.markers=f(b),angular.equals({},a.markers)?e.pop("note","Sorry","No geographic information found for: "+a.query.sourceTaxon+" "+a.query.interactionType+" "+a.query.targetTaxon):a.center=g(a.markers)},function(a){console.dir(a)})}]),angular.module("globiProtoApp").directive("networkVis",["graphService",function(a){return{restrict:"E",scope:{val:"="},link:function(b,c){var d,e=960,f=500,g=d3.scale.category10(),h=d3.layout.force().charge(-120).linkDistance(80).size([e,f]),i=h.nodes(),j=h.links(),k=4,l=12,m=function(a,b){var c=d3.geom.quadtree(b);return function(b){var d=2*l+k,e=b.x-d,f=b.x+d,g=b.y-d,h=b.y+d;c.visit(function(c,i,j,k,l){if(c.point&&c.point!==b){var m=b.x-c.point.x,n=b.y-c.point.y,o=Math.sqrt(m*m+n*n);d>o&&(o=(o-d)/o*a,b.x-=m*=o,b.y-=n*=o,c.point.x+=m,c.point.y+=n)}return i>f||e>k||j>h||g>l})}},n=d3.select(c[0]).append("svg").attr("width",e).attr("height",f),o=function(){var a=n.selectAll(".link").data(j);a.enter().insert("line").attr("class","link").style("stroke-width","2"),a.exit().remove();var c=n.selectAll(".node").data(i),d=c.enter().append("g").attr("class","node").call(h.drag);d.append("circle").attr("r",10).style("fill",function(a){return g(a.group)}).on("click",function(a){a.circleColor=d3.select(this).attr("style").split("fill: ")[1],b.$emit("nodeClicked",a)}),d.append("text").attr("dx",11).attr("dy",".45em").text(function(a){return a.name}).style("stroke",function(a){return g(a.group)}),c.exit().remove(),h.on("tick",function(){a.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),c.attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("circle").attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y}),d3.selectAll("text").attr("x",function(a){return a.x}).attr("y",function(a){return a.y}),c.each(m(.5,i))}),h.start()};b.$watch("val",function(b){b&&(d=angular.copy(b),i.push.apply(i,d.nodes),j.push.apply(j,d.links),o(),d3.selectAll("text").style("stroke",function(b){return a.isNodeInPath(b.name)||a.isNodeTargetOfPathTip(b.name)?g(b.group):"#b3b1b1"}))})}}}]),angular.module("globiProtoApp").factory("graphService",["columnGraphValues","kingdomService",function(a,b){var c={nodes:[],links:[],path:[]},d=function(b){return b/(a.maxLevel+1)},e=function(a,b){for(var c=null,d=0;d<b.length;d++)a===b[d].name&&(c=d);return c},f=function(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d];a.source===e.source&&a.target===e.target&&(c=d)}return c},g=function(){return c.path.length>0?c.path[c.path.length-1]:null},h=function(a){var b=0;return c.nodes.forEach(function(c){c.group===a&&(b+=1)}),b},i=function(a){for(var b=c.nodes.filter(function(b){return b.group===a.group}),d=0;d<b.length;d++)if(b[d].name===a.name)return d;return 0},j=function(a,b){for(var c=0;c<b.length;c++){var d=b[c];if(a===d.source_taxon_name)return d.source_taxon_path}},k=function(a,b){return a.group*d(b)},l=function(a,b){var c=h(a.group),d=b/(c+1),e=i(a);return(e+1)*d},m=function(a,b,c){a.xPos=k(a,b),a.yPos=l(a,c)},n=function(a){var b=g();b?(a.group===b.group+1&&c.path.push(a),a.group===b.group&&(c.path.pop(),c.path.push(a)),a.group<b.group&&c.path.splice(a.group,b.group-a.group)):c.path.push(a)};return{init:function(){c={nodes:[],links:[],path:[]}},append:function(d,g){var h,i,k,l={nodes:[],links:[]},m=Math.min(a.maxNodesPerSource,d.length);g.circleColor||(g.circleColor="#1f77b4"),n(g),null===e(g.name,c.nodes)&&(g.kingdom=b.extractKingdom(j(g.name,d)),c.nodes.push(g),l.nodes.push(g)),k=e(g.name,c.nodes);for(var o=0;m>o;o++)i=d[o],null===e(i.target_taxon_name,c.nodes)&&(h={name:i.target_taxon_name,group:g.group+1,kingdom:b.extractKingdom(i.target_taxon_path)},c.nodes.push(h),l.nodes.push(h));for(var p=0;m>p;p++){i=d[p];var q={source:k,target:e(i.target_taxon_name,c.nodes),value:1};f(q,c.links)||(c.links.push(q),l.links.push(q))}return l.links.forEach(function(a){var b=c.nodes[a.target],d=e(b.name,l.nodes);null===d&&(a.linkBack=!0)}),l},getPath:function(){return c.path},isNodeInPath:function(a){return null!==e(a,c.path)?!0:!1},isNodeTargetOfPathTip:function(a){var b,d,f=e(a,c.nodes);if(c.path.length>0&&null!==e){b=c.path[c.path.length-1],d=e(b.name,c.nodes);for(var g=0;g<c.links.length;g++){var h=c.links[g];if(h.source===d&&h.target===f)return!0}}return!1},getCurrentGroupNumber:function(){return c.path[c.path.length-1].group},rewind:function(a){var b={nodes:[],links:[]},d=[],e=[],f={},g=[];n(a);for(var h=0;h<c.nodes.length;h++)c.nodes[h].group>a.group&&(d.push(h),c.nodes[h].originalIndex=h,b.nodes.push(c.nodes[h])),c.nodes[h].group===a.group&&e.push(h);b.nodes.forEach(function(a){for(var b=0;b<c.links.length;b++)(c.links[b].source===a.originalIndex||c.links[b].target===a.originalIndex)&&(f[b]=c.links[b])}),e.forEach(function(a){for(var b=0;b<c.links.length;b++)c.links[b].source===a&&(f[b]=c.links[b])}),g=Object.keys(f),g.sort(function(a,b){return b-a}),b.linkIndexesToRemove=g;for(var i=0;i<g.length;i++)b.links.push(c.links[i]),c.links.splice(g[i],1);d.sort(function(a,b){return b-a}),b.nodeIndexesToRemove=d;for(var j=0;j<d.length;j++)c.nodes.splice(d[j],1);return b},calculateNodePositions:function(a,b,d,e){a.forEach(function(a){m(a,d,e)}),b.forEach(function(a){c.nodes[a.target].initialXPos=c.nodes[a.source].xPos,c.nodes[a.target].initialYPos=c.nodes[a.source].yPos})},getLinkNodes:function(a){return{sourceName:c.nodes[a.source].name,targetName:c.nodes[a.target].name}}}}]),angular.module("globiProtoApp").value("maxApiResults",100),angular.module("globiProtoApp").factory("interactionService",function(){return{removeDuplicateTargets:function(a){var b=[],c={};return a.forEach(function(a){c[a.target.name]=a}),Object.keys(c).forEach(function(a){b.push(c[a])}),b}}}),angular.module("globiProtoApp").directive("columnNetworkVis",["columnGraphValues","graphService","kingdomService","d3Extension","legendHelper",function(a,b,c,d,e){return{restrict:"E",scope:{val:"="},link:function(f,g){var h=g.parent().width(),i=a.height,j=d3.scale.ordinal().domain([1,2,3,4,5,6]).range(["rgb(31, 119, 180)","rgb(255, 127, 14)","rgb(44, 160, 44)","rgb(214, 39, 40)","rgb(148, 103, 189)","rgb(140, 86, 75)"]),k=200,l=d3.select(g[0]).append("svg").attr("width",h).attr("height",a.height);l.append("svg:defs").selectAll("marker").data(["arrow"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",10).attr("refY",0).attr("markerWidth",8).attr("markerHeight",8).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,0");var m=[],n=[];e.kingdom(l,f),e.level(l),e.interaction(l);var o=function(){var a=l.selectAll(".node").data(m),b=a.enter().append("g").attr("class","node"),e=b.append("path").attr("transform",function(a){return c.shapeInfo(a.kingdom).rotate?"translate("+a.initialXPos+","+a.initialYPos+") rotate("+c.shapeInfo(a.kingdom).rotate+")":"translate("+a.initialXPos+","+a.initialYPos+")"}).attr("d",function(a){return d.getSymbol(c.shapeInfo(a.kingdom).shape,k)}).style("fill",function(a){return c.shapeInfo(a.kingdom).empty?"transparent":j(a.group)}).attr("stroke",function(a){return j(a.group)}).on("click",function(a){a.circleColor=d3.select(this).attr("stroke"),f.$emit("nodeClicked",a)});e.transition().delay(function(a,b){return 10*b}).duration(300).ease("linear").attr("transform",function(a){return c.shapeInfo(a.kingdom).rotate?"translate("+a.xPos+","+a.yPos+") rotate("+c.shapeInfo(a.kingdom).rotate+")":"translate("+a.xPos+","+a.yPos+")"}),b.append("text").attr("class","node-label").attr("dx",function(a){return a.xPos+10}).attr("dy",function(a){return a.yPos+5}).text(function(a){return a.name}).style({"letter-spacing":2,fill:function(a){return j(a.group)}}),a.exit().remove();var g=l.selectAll(".link").data(n),h=g.enter().insert("line").on("mouseover",function(){d3.select(this).style({"stroke-width":"4px",stroke:"#2ED3DE"})}).on("mouseout",function(){d3.select(this).style({"stroke-width":"2px",stroke:"#999"})}).on("click",function(a){f.$emit("linkClicked",a)}).attr("class",function(a){return a.linkBack?"link linkback":"link"}).attr("marker-end","url(#arrow)").attr("x1",function(a){return m[a.source].xPos}).attr("y1",function(a){return m[a.source].yPos}).attr("x2",function(a){return m[a.source].xPos}).attr("y2",function(a){return m[a.source].yPos}).style("stroke-width","2").style("stroke-dasharray",function(a){return a.linkBack?"3, 3":"0, 0"});h.transition().delay(function(a,b){return 10*b}).duration(300).ease("linear").attr("x2",function(a){return m[a.target].xPos}).attr("y2",function(a){return m[a.target].yPos}),g.exit().remove()};f.$watch("val",function(a){if(a){if("add"===a.action&&(m.push.apply(m,a.nodes),n.push.apply(n,a.links),b.calculateNodePositions(a.nodes,a.links,h,i),o()),"remove"===a.action){for(var c=0;c<a.nodeIndexesToRemove.length;c++)m.splice(a.nodeIndexesToRemove[c],1);for(var d=0;d<a.linkIndexesToRemove.length;d++)n.splice(a.linkIndexesToRemove[d],1);o()}d3.selectAll("text.node-label").style("stroke",function(a){return b.isNodeInPath(a.name)||b.isNodeTargetOfPathTip(a.name)?j(a.group):"#b3b1b1"}).style("font-size",function(a){return b.isNodeInPath(a.name)||b.isNodeTargetOfPathTip(a.name)?void 0:"10px"})}})}}}]),angular.module("globiProtoApp").value("columnGraphValues",{height:600,maxLevel:6,maxNodesPerSource:15}),angular.module("globiProtoApp").factory("kingdomService",function(){var a="Null",b={Null:{shape:"circle",empty:!0},Animalia:{shape:"circle",wiki:"http://en.wikipedia.org/wiki/Animal"},Bacteria:{shape:"star",wiki:"http://en.wikipedia.org/wiki/Bacterial_taxonomy"},Chromista:{shape:"triangle-down",wiki:"http://en.wikipedia.org/wiki/Chromista"},Fungi:{shape:"square",wiki:"http://en.wikipedia.org/wiki/Fungus"},Metazoa:{shape:"triangle-up",wiki:"http://en.wikipedia.org/wiki/Animal"},Plantae:{shape:"diamond",wiki:"http://en.wikipedia.org/wiki/Plant"},Protista:{shape:"triangle-up",rotate:"-90",wiki:"http://en.wikipedia.org/wiki/Protist"},Protozoa:{shape:"triangle-up",rotate:"90",wiki:"http://en.wikipedia.org/wiki/Protozoa"},Viridiplantae:{shape:"cross",rotate:"45"},Viruses:{shape:"cross",wiki:"http://en.wikipedia.org/wiki/Virus"}};return{extractKingdom:function(b){if(b){var c=b.split("|");return c[0].trim()}return a},shapeInfo:function(c){var d=b[c];return d||b[a]},legend:function(){return Object.keys(b).map(function(a){return{kingdom:a,shape:b[a].shape,rotate:b[a].rotate,empty:b[a].empty,wiki:b[a].wiki}})}}}),angular.module("globiProtoApp").factory("d3Extension",function(){var a=d3.map({star:function(a){return a=Math.sqrt(a),"M"+-a/2+","+-a/2+"l"+a+","+a+"m0,"+-a+"l"+-a+","+a},smiley:function(a){a=Math.sqrt(a);var b=a/5,c=a/8;return"M"+(-a/2+b)+","+-a/2+" m"+-c+",0 a"+c+","+c+" 0 1,0"+2*c+",0 a"+c+","+c+" 0 1,0"+-(2*c)+",0M"+(a/2-b)+","+-a/2+" m"+-c+",0 a"+c+","+c+" 0 1,0"+2*c+",0 a"+c+","+c+" 0 1,0"+-(2*c)+",0M"+-a/2+","+(a/2-2*b)+"q"+a/2+","+2*b+" "+a+",0"}});return d3.svg.customSymbol=function(){function b(b,e){return a.get(c.call(this,b,e))(d.call(this,b,e))}var c,d=64;return b.type=function(a){return arguments.length?(c=d3.functor(a),b):c},b.size=function(a){return arguments.length?(d=d3.functor(a),b):d},b},{getSymbol:function(a,b){return b=b||64,-1!==d3.svg.symbolTypes.indexOf(a)?d3.svg.symbol().type(a).size(b)():d3.svg.customSymbol().type(a).size(b)()}}}),angular.module("globiProtoApp").factory("interactionHelper",["images","taxonInteractionDetails","$q",function(a,b,c){var d=function(b){var d=c.defer(),e=a.get({taxon:b},function(){d.resolve(e)});return d.promise},e=function(a){return{scientificName:a.scientificName,commonName:a.commonName,thumbnailURL:a.thumbnailURL,imageURL:a.imageURL,infoURL:a.infoURL}},f=function(a,d,e){var f=c.defer(),g=b.query({sourceTaxon:a,targetTaxon:d,interactionType:e},function(){f.resolve(g)});return f.promise},g=function(a){var b={};return a.forEach(function(a){b[a.study_title]=a.study_url}),Object.keys(b).map(function(a){return{studyTitle:a,studyUrl:b[a]}})},h=function(a){var b={};return a.forEach(function(a){if(a.study_title&&a.latitude&&a.longitude){var c=a.study_title.replace(/\s|\-/g,"")+a.latitude.toString().replace("-","#")+"_"+a.longitude.toString().replace("-","#");b[c]?(b[c].itemCount+=1,b[c].message=b[c].itemCount+' Observations, <a target="_blank" href="'+a.study_url+'">'+a.study_title+"</a>"):b[c]={lat:a.latitude,lng:a.longitude,message:'1 Observation, <a target="_blank" href="'+a.study_url+'">'+a.study_title+"</a>",focus:!0,draggable:!1,itemCount:1}}}),b},i=function(a){var b=0,c=0;return Object.keys(a).forEach(function(d){b+=a[d].lat,c+=a[d].lng}),{lat:b/Object.keys(a).length,lng:c/Object.keys(a).length,zoom:3}};return{getSourceTargetDetails:function(a,b,j){var k,l=c.defer();return c.all([d(a),d(b),f(a,b,j)]).then(function(a){k={sourceTaxonData:e(a[0]),targetTaxonData:e(a[1]),studies:g(a[2]),mapMarkers:h(a[2])},k.mapCenter=i(k.mapMarkers),l.resolve(k)}),l.promise}}}]),angular.module("globiProtoApp").factory("legendHelper",["kingdomService","d3Extension",function(a,b){return{kingdom:function(c,d){var e=100,f="#000",g=c.selectAll(".legend").data(a.legend()).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(0,"+20*(b+1)+")"});g.append("path").attr("transform",function(b){return a.shapeInfo(b.kingdom).rotate?"translate(30,10) rotate("+a.shapeInfo(b.kingdom).rotate+")":"translate(30,10)"}).attr("d",function(c){return b.getSymbol(a.shapeInfo(c.kingdom).shape,e)}).attr("stroke",f).style("fill",function(b){return a.shapeInfo(b.kingdom).empty?"transparent":f}),g.append("text").attr("class","legend-text").on("mouseover",function(){d3.select(this).style("fill","#1588ec")}).on("mouseout",function(){d3.select(this).style("fill",f)}).on("click",function(a){d.$emit("legendClicked",a)}).attr("x",60).attr("y",9).attr("dy",".35em").style("text-anchor","start").style("fill",f).text(function(a){return a.kingdom})},level:function(a){var b=d3.scale.category10(),c=["1st level","2nd level","3rd level","4th level","5th level","6th level"],d=a.selectAll(".legendLevel").data(c).enter().append("g").attr("class","legend-level").attr("transform",function(a,b){return"translate(0,"+21*(b+17)+")"});d.append("rect").attr("x",20).attr("width",18).attr("height",18).style("fill",function(a,c){return b(c)}),d.append("text").attr("x",60).attr("y",8).attr("dy",".35em").style("text-anchor","start").text(function(a){return a})},interaction:function(a){var b=[{description:"Forward link",linkBack:!1},{description:"Back link",linkBack:!0}],c=a.selectAll(".interactionLegend").data(b).enter().append("g").attr("class","interaction-legend").attr("transform",function(a,b){return"translate(0,"+25*(b+21)+")"});c.append("line").attr("class","link-legend").attr("marker-end","url(#arrow)").attr("x1",function(a){return a.linkBack?65:20}).attr("x2",function(a){return a.linkBack?20:65}).style("stroke-width","2").style("stroke-dasharray",function(a){return a.linkBack?"3, 3":"0, 0"}),c.append("text").attr("x",75).attr("y",0).attr("dy",".35em").style("text-anchor","start").text(function(a){return a.description})}}}]),angular.module("globiProtoApp").controller("NavNetworkCtrl",["$scope","$state",function(a,b){a.currentTaxon=b.params.taxon,a.$on("$stateChangeSuccess",function(b,c){a.state=c.name}),a.explore=function(a){a.preventDefault(),b.transitionTo("main",{name:b.params.taxon,interaction:b.params.interaction},{location:!0,reload:!0})}}]);