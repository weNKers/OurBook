(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{156:function(t,e,n){},168:function(t,e,n){"use strict";n(156)},174:function(t,e,n){"use strict";n.r(e);var o={watch:{$route(t,e){t.path!==e.path&&this.refresh()}},mounted(){this.refresh()},methods:{refresh(){this.clipboard()},clipboard(){const t=({title:t,author:e,link:n})=>["","","标题：我们眼中的大学 | "+t,"链接："+n,"来源："+e,"著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。"];document.querySelector(".content").oncopy=e=>{if(!window.getSelection)return;var n=window.getSelection();const o={title:this.$page.title,author:"我们眼中的大学",link:location.href};if(!(n.toString().length<42)){if(n.rangeCount)for(var i=document.createElement("div"),r=0,l=n.rangeCount;r<l;++r)i.appendChild(n.getRangeAt(r).cloneContents());if("object"==typeof e.clipboardData)return e.clipboardData.setData("text/html",i.innerHTML+t(o).join("<br>")),i.remove(),e.clipboardData.setData("text/plain",n.toString()+t(o).join("\n")),void e.preventDefault();document.body.append('<div id="symFixCopy" style="position: fixed; left: -9999px;">'+n.toString()+t(o).join("<br>")+"</div>"),window.getSelection().selectAllChildren(document.querySelectorAll("#symFixCopy")[0]),setTimeout((function(){document.querySelector("#symFixCopy").remove()}),200)}}}}},i=(n(168),n(7)),r=Object(i.a)(o,(function(){return(0,this._self._c)("div",{staticClass:"share"})}),[],!1,null,null,null);e.default=r.exports}}]);