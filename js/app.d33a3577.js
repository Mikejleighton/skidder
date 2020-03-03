(function(e){function t(t){for(var a,i,s=t[0],l=t[1],u=t[2],p=0,d=[];p<s.length;p++)i=s[p],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&d.push(n[i][0]),n[i]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);c&&c(t);while(d.length)d.shift()();return o.push.apply(o,u||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],a=!0,s=1;s<r.length;s++){var l=r[s];0!==n[l]&&(a=!1)}a&&(o.splice(t--,1),e=i(i.s=r[0]))}return e}var a={},n={app:0},o=[];function i(t){if(a[t])return a[t].exports;var r=a[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=a,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(r,a,function(t){return e[t]}.bind(null,a));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/lumberjack/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var c=l;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var a=r("2b0e"),n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("Main")},o=[],i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app",{attrs:{id:"inspire"}},[r("v-app-bar",{attrs:{app:"",color:"black",dark:""}},[r("v-img",{staticStyle:{"max-width":"25px","margin-right":"10px"},attrs:{src:"icon.png"}}),r("v-toolbar-title",[e._v("Lumber Jack")])],1),r("v-content",[r("log-viewer")],1),r("v-footer",{attrs:{color:"black",app:""}},[r("span",{staticClass:"white--text",staticStyle:{float:"left"}},[e._v("© 2020")]),r("v-spacer"),r("span",{staticClass:"white--text",staticStyle:{float:"right"}},[e._v(e._s(e.version))])],1)],1)},s=[],l=(r("96cf"),r("1da1")),u=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticStyle:{height:"100%","background-color":"#1E1E1E"},on:{drop:function(t){return t.preventDefault(),e.loadTextFromFile(t)},dragover:function(e){e.preventDefault()}}},[e.$vuetify.breakpoint.xsOnly?r("v-data-table",{key:e.componentKey,staticClass:"elevation-0",attrs:{id:"small",headers:e.headers,items:e.logs,"disable-pagination":"","no-data-text":"No data available. Drag a log file over to view.","hide-default-footer":"",dark:""}}):e._e(),e.$vuetify.breakpoint.xsOnly?e._e():r("v-data-table",{key:e.componentKey,staticClass:"elevation-0",attrs:{id:"large",headers:e.headers,items:e.logs,"disable-pagination":"","no-data-text":"No data available. Drag a log file over to view.","hide-default-footer":"",dark:""},scopedSlots:e._u([{key:"item",fn:function(t){return[r("tr",{attrs:{loading:""}},e._l(e.headers,(function(a){return r("td",{key:a.id},["Chip"!==a.dataType?r("div",[e._v(" "+e._s(t.item[a.value])+" ")]):e._e(),"Chip"===a.dataType?r("div",[r("v-chip",{staticClass:"ma-2",attrs:{color:t.item.color,outlined:""}},[e._v(" "+e._s(t.item[a.value])+" ")])],1):e._e()])})),0)]}}],null,!1,2302028505)})],1)},c=[],p=(r("b0c0"),r("bc3a")),d=r.n(p),f=(r("ac1f"),r("466d"),r("5319"),r("1276"),r("d4ec")),v=r("bee2"),h=function(){function e(){Object(f["a"])(this,e),this.logData=void 0}return Object(v["a"])(e,[{key:"getDataByType",value:function(e,t){var r=e.split("("),a=r[0];if("Date"===a){var n=new Date(0);return n.setUTCSeconds(t),n.toISOString()}return t}},{key:"parseHeader",value:function(e){for(var t=e.split(","),r=[],a=0;a<t.length;a++){var n=t[a].split(":")[0],o=1==t[a].split(":").length?"":t[a].split(":")[1],i=o.split("("),s=i[0],l=[];if(i.length>1)for(var u=i[1].replace(")",""),c=u.split("|"),p=0;p<c.length;p++){for(var d=c[p],f=d.split("-"),v={},h=0;h<f.length;h++)v[h+""]=f[h];l.push(v)}r.push({id:a,text:n,value:n.toLowerCase(),dataType:s,extra:l})}return r}},{key:"postProcess",value:function(e){for(var t=e.headers,r=e.items,a=0;a<t.length;a++)if("Chip"===t[a].dataType)for(var n=0;n<r.length;n++)for(var o=r[n],i=0;i<t[a].extra.length;i++){var s=t[a].extra[i];o[t[a].value]===s["0"]&&(o.color=s["1"])}return e}},{key:"parseData",value:function(e){for(var t=e.match(/[^\r\n]+/g),r=this.parseHeader(t[0]),a=[],n=1;n<t.length;n++){for(var o=t[n].split(","),i={},s=0;s<r.length;s++)i[r[s].value]=this.getDataByType(r[s].dataType,o[s]),i.id=n;a.push(i)}return this.postProcess({items:a,headers:r})}}]),e}(),g=new h,b={data:function(){return{headers:[],logs:[],rawData:void 0}},created:function(){this.loadLogData()},methods:{loadTextFromFile:function(e){var t=e.dataTransfer.files[0],r=new FileReader,a=this;r.onload=function(e){a.rawData=e.target.result,a.loadLogData()},r.readAsText(t)},filter:function(e,t){for(var r={},a=0;a<e.length;a++)r[e[a].id]=e[a];for(var n=[],o=0;o<t.length;o++)n.push(r[t[o].id]);return n},getDataFromUrl:function(e){return Object(l["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(void 0!==e){t.next=2;break}return t.abrupt("return",void 0);case 2:return r=void 0,t.prev=3,t.next=6,d()({url:e,method:"GET"});case 6:r=t.sent,t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](3),console.error(t.t0);case 12:return t.abrupt("return",r);case 13:case"end":return t.stop()}}),t,null,[[3,9]])})))()},loadLogData:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getDataFromUrl(e.url);case 2:if(r=t.sent,void 0!==r){t.next=7;break}if(void 0!==e.rawData){t.next=6;break}return t.abrupt("return");case 6:r={data:e.rawData};case 7:a=g.parseData(r.data),e.headers=a.headers,e.logs=a.items;case 10:case"end":return t.stop()}}),t)})))()},forceRerender:function(){this.componentKey+=1}},computed:{componentKey:function(){return"xs"===this.$vuetify.breakpoint.name?1:0}},props:["url"]},m=b,y=r("2877"),x=r("6544"),w=r.n(x),k=r("cc20"),_=r("8fea"),O=Object(y["a"])(m,u,c,!1,null,null,null),D=O.exports;w()(O,{VChip:k["a"],VDataTable:_["a"]});var T={data:function(){return{version:""}},methods:{setVersion:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=void 0,t.prev=1,t.next=4,d()({url:"/version",method:"GET"});case 4:r=t.sent,t.next=11;break;case 7:return t.prev=7,t.t0=t["catch"](1),console.error(t.t0),t.abrupt("return");case 11:e.version=r.data;case 12:case"end":return t.stop()}}),t,null,[[1,7]])})))()}},created:function(){this.setVersion()},props:{source:String},components:{LogViewer:D}},j=T,S=r("7496"),C=r("40dc"),V=r("a75b"),P=r("553a"),E=r("adda"),F=r("2fa4"),R=r("2a7f"),$=Object(y["a"])(j,i,s,!1,null,null,null),L=$.exports;w()($,{VApp:S["a"],VAppBar:C["a"],VContent:V["a"],VFooter:P["a"],VImg:E["a"],VSpacer:F["a"],VToolbarTitle:R["a"]});var M={message:"App",components:{Main:L},data:function(){return{}}},A=M,K=Object(y["a"])(A,n,o,!1,null,null,null),B=K.exports,J=r("f309");a["a"].use(J["a"]);var U=new J["a"]({});a["a"].config.productionTip=!1,new a["a"]({vuetify:U,render:function(e){return e(B)}}).$mount("#app")}});
//# sourceMappingURL=app.d33a3577.js.map