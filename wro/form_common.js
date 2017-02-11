
jQuery.fn.boxy=function(options){options=options||{};return this.each(function(){var node=this.nodeName.toLowerCase(),self=this;if(node=='a'){jQuery(this).click(function(){var active=Boxy.linkedTo(this),href=this.getAttribute('href'),localOptions=jQuery.extend({actuator:this,title:this.title},options);if(active){active.show();}else if(href.indexOf('#')>=0){var content=jQuery(href.substr(href.indexOf('#'))),newContent=content.clone(true);content.remove();localOptions.unloadOnHide=false;new Boxy(newContent,localOptions);}else{if(!localOptions.cache)localOptions.unloadOnHide=true;Boxy.load(this.href,localOptions);}
return false;});}else if(node=='form'){jQuery(this).bind('submit.boxy',function(){Boxy.confirm(options.message||'Please confirm:',function(){jQuery(self).unbind('submit.boxy').submit();});return false;});}});};function Boxy(element,options){this.boxy=jQuery(Boxy.WRAPPER);jQuery.data(this.boxy[0],'boxy',this);this.visible=false;this.options=jQuery.extend({},Boxy.DEFAULTS,options||{});if(this.options.modal){this.options=jQuery.extend(this.options,{center:true,draggable:true});}
if(this.options.actuator){jQuery.data(this.options.actuator,'active.boxy',this);}
this.setContent(element||"<div></div>");this._setupTitleBar();this.boxy.css('display','none').appendTo(document.body);this.toTop();if(this.options.fixed){if(jQuery.browser.msie&&jQuery.browser.version<7){this.options.fixed=false;}else{this.boxy.addClass('fixed');}}
if(this.options.center&&Boxy._u(this.options.x,this.options.y)){this.center();}else{this.moveTo(Boxy._u(this.options.x)?this.options.x:Boxy.DEFAULT_X,Boxy._u(this.options.y)?this.options.y:Boxy.DEFAULT_Y);}
if(this.options.show)this.show();};Boxy.EF=function(){};jQuery.extend(Boxy,{WRAPPER:"<table cellspacing='0' cellpadding='0' border='0' class='boxy-wrapper'>"+"<tr><td class='top-left'></td><td class='top'></td><td class='top-right'></td></tr>"+"<tr><td class='left'></td><td class='boxy-inner'></td><td class='right'></td></tr>"+"<tr><td class='bottom-left'></td><td class='bottom'></td><td class='bottom-right'></td></tr>"+"</table>",DEFAULTS:{title:null,closeable:true,draggable:true,clone:false,actuator:null,center:true,show:true,modal:false,fixed:true,closeText:'[close]',unloadOnHide:false,clickToFront:false,behaviours:Boxy.EF,afterDrop:Boxy.EF,afterShow:Boxy.EF,afterHide:Boxy.EF,beforeUnload:Boxy.EF},DEFAULT_X:50,DEFAULT_Y:50,zIndex:1337,dragConfigured:false,resizeConfigured:false,dragging:null,load:function(url,options){options=options||{};var ajax={url:url,type:'GET',dataType:'html',cache:false,success:function(html){html=jQuery(html);if(options.filter)html=jQuery(options.filter,html);new Boxy(html,options);}};jQuery.each(['type','cache'],function(){if(this in options){ajax[this]=options[this];delete options[this];}});jQuery.ajax(ajax);},get:function(ele){var p=jQuery(ele).parents('.boxy-wrapper');return p.length?jQuery.data(p[0],'boxy'):null;},linkedTo:function(ele){return jQuery.data(ele,'active.boxy');},alert:function(message,callback,options){return Boxy.ask(message,['OK'],callback,options);},confirm:function(message,after,options){return Boxy.ask(message,['OK','Cancel'],function(response){if(response=='OK')after();},options);},ask:function(question,answers,callback,options){options=jQuery.extend({modal:true,closeable:false},options||{},{show:true,unloadOnHide:true});var body=jQuery('<div></div>').append(jQuery('<div class="question"></div>').html(question));var map={},answerStrings=[];if(answers instanceof Array){for(var i=0;i<answers.length;i++){map[answers[i]]=answers[i];answerStrings.push(answers[i]);}}else{for(var k in answers){map[answers[k]]=k;answerStrings.push(answers[k]);}}
var buttons=jQuery('<form class="answers"></form>');buttons.html(jQuery.map(answerStrings,function(v){return"<input type='button' value='"+v+"' />";}).join(' '));jQuery('input[type=button]',buttons).click(function(){var clicked=this;Boxy.get(this).hide(function(){if(callback)callback(map[clicked.value]);});});body.append(buttons);new Boxy(body,options);},isModalVisible:function(){return jQuery('.boxy-modal-blackout').length>0;},_u:function(){for(var i=0;i<arguments.length;i++)
if(typeof arguments[i]!='undefined')return false;return true;},_handleResize:function(evt){var d=jQuery(document);jQuery('.boxy-modal-blackout').css('display','none').css({width:d.width(),height:d.height()}).css('display','block');},_handleDrag:function(evt){var d;if(d=Boxy.dragging){d[0].boxy.css({left:evt.pageX-d[1],top:evt.pageY-d[2]});}},_nextZ:function(){return Boxy.zIndex++;},_viewport:function(){var d=document.documentElement,b=document.body,w=window;return jQuery.extend(jQuery.browser.msie?{left:b.scrollLeft||d.scrollLeft,top:b.scrollTop||d.scrollTop}:{left:w.pageXOffset,top:w.pageYOffset},!Boxy._u(w.innerWidth)?{width:w.innerWidth,height:w.innerHeight}:(!Boxy._u(d)&&!Boxy._u(d.clientWidth)&&d.clientWidth!=0?{width:d.clientWidth,height:d.clientHeight}:{width:b.clientWidth,height:b.clientHeight}));}});Boxy.prototype={estimateSize:function(){this.boxy.css({visibility:'hidden',display:'block'});var dims=this.getSize();this.boxy.css('display','none').css('visibility','visible');return dims;},getSize:function(){return[this.boxy.width(),this.boxy.height()];},getContentSize:function(){var c=this.getContent();return[c.width(),c.height()];},getPosition:function(){var b=this.boxy[0];return[b.offsetLeft,b.offsetTop];},getCenter:function(){var p=this.getPosition();var s=this.getSize();return[Math.floor(p[0]+s[0]/2),Math.floor(p[1]+s[1]/2)];},getInner:function(){return jQuery('.boxy-inner',this.boxy);},getContent:function(){return jQuery('.boxy-content',this.boxy);},setContent:function(newContent){newContent=jQuery(newContent).css({display:'block'}).addClass('boxy-content');if(this.options.clone)newContent=newContent.clone(true);this.getContent().remove();this.getInner().append(newContent);this._setupDefaultBehaviours(newContent);this.options.behaviours.call(this,newContent);return this;},moveTo:function(x,y){this.moveToX(x).moveToY(y);return this;},moveToX:function(x){if(typeof x=='number')this.boxy.css({left:x});else this.centerX();return this;},moveToY:function(y){if(typeof y=='number')this.boxy.css({top:y});else this.centerY();return this;},centerAt:function(x,y){var s=this[this.visible?'getSize':'estimateSize']();if(typeof x=='number')this.moveToX(x-s[0]/2);if(typeof y=='number')this.moveToY(y-s[1]/2);return this;},centerAtX:function(x){return this.centerAt(x,null);},centerAtY:function(y){return this.centerAt(null,y);},center:function(axis){var v=Boxy._viewport();var o=this.options.fixed?[0,0]:[v.left,v.top];if(!axis||axis=='x')this.centerAt(o[0]+v.width/2,null);if(!axis||axis=='y')this.centerAt(null,o[1]+v.height/2);return this;},centerX:function(){return this.center('x');},centerY:function(){return this.center('y');},resize:function(width,height,after){if(!this.visible)return;var bounds=this._getBoundsForResize(width,height);this.boxy.css({left:bounds[0],top:bounds[1]});this.getContent().css({width:bounds[2],height:bounds[3]});if(after)after(this);return this;},tween:function(width,height,after){if(!this.visible)return;var bounds=this._getBoundsForResize(width,height);var self=this;this.boxy.stop().animate({left:bounds[0],top:bounds[1]});this.getContent().stop().animate({width:bounds[2],height:bounds[3]},function(){if(after)after(self);});return this;},isVisible:function(){return this.visible;},show:function(){if(this.visible)return;if(this.options.modal){var self=this;if(!Boxy.resizeConfigured){Boxy.resizeConfigured=true;jQuery(window).resize(function(){Boxy._handleResize();});}
this.modalBlackout=jQuery('<div class="boxy-modal-blackout"></div>').css({zIndex:Boxy._nextZ(),opacity:0.7,width:jQuery(document).width(),height:jQuery(document).height()}).appendTo(document.body);this.toTop();if(this.options.closeable){jQuery(document.body).bind('keypress.boxy',function(evt){var key=evt.which||evt.keyCode;if(key==27){self.hide();jQuery(document.body).unbind('keypress.boxy');}});}}
this.boxy.stop().css({opacity:1}).show();this.visible=true;this._fire('afterShow');return this;},hide:function(after){if(!this.visible)return;var self=this;if(this.options.modal){jQuery(document.body).unbind('keypress.boxy');this.modalBlackout.animate({opacity:0},function(){jQuery(this).remove();});}
this.boxy.stop().animate({opacity:0},300,function(){self.boxy.css({display:'none'});self.visible=false;self._fire('afterHide');if(after)after(self);if(self.options.unloadOnHide)self.unload();});return this;},toggle:function(){this[this.visible?'hide':'show']();return this;},hideAndUnload:function(after){this.options.unloadOnHide=true;this.hide(after);return this;},unload:function(){this._fire('beforeUnload');this.boxy.remove();if(this.options.actuator){jQuery.data(this.options.actuator,'active.boxy',false);}},toTop:function(){this.boxy.css({zIndex:Boxy._nextZ()});return this;},getTitle:function(){return jQuery('> .title-bar h2',this.getInner()).html();},setTitle:function(t){jQuery('> .title-bar h2',this.getInner()).html(t);return this;},_getBoundsForResize:function(width,height){var csize=this.getContentSize();var delta=[width-csize[0],height-csize[1]];var p=this.getPosition();return[Math.max(p[0]-delta[0]/2,0),Math.max(p[1]-delta[1]/2,0),width,height];},_setupTitleBar:function(){if(this.options.title){var self=this;var tb=jQuery("<div class='title-bar'></div>").html("<h2>"+this.options.title+"</h2>");if(this.options.closeable){tb.append(jQuery("<a href='#' class='close'></a>").html(this.options.closeText));}
if(this.options.draggable){tb[0].onselectstart=function(){return false;}
tb[0].unselectable='on';tb[0].style.MozUserSelect='none';if(!Boxy.dragConfigured){jQuery(document).mousemove(Boxy._handleDrag);Boxy.dragConfigured=true;}
tb.mousedown(function(evt){self.toTop();Boxy.dragging=[self,evt.pageX-self.boxy[0].offsetLeft,evt.pageY-self.boxy[0].offsetTop];jQuery(this).addClass('dragging');}).mouseup(function(){jQuery(this).removeClass('dragging');Boxy.dragging=null;self._fire('afterDrop');});}
this.getInner().prepend(tb);this._setupDefaultBehaviours(tb);}},_setupDefaultBehaviours:function(root){var self=this;if(this.options.clickToFront){root.click(function(){self.toTop();});}
jQuery('.close',root).click(function(){self.hide();return false;}).mousedown(function(evt){evt.stopPropagation();});},_fire:function(event){this.options[event].call(this);}};

FormUtil={getValue:function(fieldId){var value="";var field=FormUtil.getField(fieldId);if($(field).length>0){if($(field).attr("type")=="checkbox"||$(field).attr("type")=="radio"){field=$(field).filter(":checked");}else if($(field).is("select")){field=$(field).find("option:selected");}
value=$(field).val();}
return value;},getValues:function(fieldId){var values=new Array();if(fieldId.indexOf(".")>0){values=FormUtil.getGridCellValues(fieldId);}else{var field=FormUtil.getField(fieldId);if($(field).length>0){if($(field).attr("type")=="checkbox"||$(field).attr("type")=="radio"){field=$(field).filter(":checked");}else if($(field).is("select")){field=$(field).find("option:selected");}
$(field).each(function(){values.push($(this).val());});}}
return values;},getField:function(fieldId){var field=$("[name="+fieldId+"]");if($(field).length==0){field=$("[name$=_"+fieldId+"]");}
field=$(field).filter(':parents(.section-visibility-hidden)');if($(field).length>1){var fieldname;$(field).each(function(){if(fieldname===undefined){fieldname=$(this).attr("name");}
if($(this).attr("name").length<fieldname.length){fieldname=$(this).attr("name");}
field=$("[name="+fieldname+"]");});}
return field;},getGridCells:function(cellFieldId){var fieldId=cellFieldId.split(".")[0];var field=FormUtil.getField(fieldId);cellFieldId=cellFieldId.replace(/\./g,'_');var cells=$(field).find("[name="+cellFieldId+"], [name$=_"+cellFieldId+"]");cells=$(cells).filter(':parents(.grid-row-template)');return cells;},getGridCellValues:function(cellFieldId){var fieldId=cellFieldId.split(".")[0];var field=FormUtil.getField(fieldId);var values=new Array();field.find("tr.grid-row").each(function(){if($(this).find("textarea[id$=_jsonrow]").length>0){var cellId=cellFieldId.split(".")[1];var data=$(this).find("textarea[id$=_jsonrow]").val();var dataObj=$.parseJSON(data);if(dataObj[cellId]!==undefined){values.push(dataObj[cellId]);}}else{var cellId=cellFieldId.replace(/\./g,'_');var cell=$(field).find("[name="+cellId+"], [name$=_"+cellId+"]");if(cell.length>1){values.push(cell.text());}}});return values;},getFieldsAsUrlQueryString:function(fields){var queryString="";if(fields!==undefined){$.each(fields,function(i,v){var values=[];if(v['field']!==""){values=FormUtil.getValues(v['field']).join(";");}
if(values.length===0&&v['defaultValue']!==""){values=v['defaultValue'];}
queryString+=encodeURIComponent(v['param'])+"="+encodeURIComponent(values)+"&";});if(queryString!==""){queryString=queryString.substring(0,queryString.length-1);}}
return queryString;}}
jQuery.expr[':'].parents=function(a,i,m){return jQuery(a).parents(m[3]).length<1;};

(function($){$.fn.extend({cdatepicker:function(o){this.each(function(){var element=$(this);o.onClose=function(selectedDate){$(element).focus();};$(element).datepicker(o);var show=function(element,evt){$(element).datepicker("show");var tabbables=$("#ui-datepicker-div").find(':tabbable');var first=tabbables.filter(':first');var last=tabbables.filter(':last');$("#ui-datepicker-div").off("keydown",":tabbable");$("#ui-datepicker-div").on("keydown",":tabbable",function(e){var keyCode=e.keyCode||e.which;if(keyCode===9){var focusedElement=$(e.target);var isFirstInFocus=(first.get(0)===focusedElement.get(0));var isLastInFocus=(last.get(0)===focusedElement.get(0));var tabbingForward=!e.shiftKey;if(tabbingForward){if(isLastInFocus){first.focus();e.preventDefault();}}else{if(isFirstInFocus){last.focus();e.preventDefault();}}}else if(keyCode==27){$(element).datepicker("hide");$(element).next("a.trigger").focus();}});var focused=false;while($("#ui-datepicker-div").is(":visible")&&!focused){first.focus();focused=true;}
evt.preventDefault();};var a=$("<a>").attr("href","#");$(element).next("img.ui-datepicker-trigger").wrap("<a class=\"trigger\" href=\"#\"></a>");$(element).next("a.trigger").off("keydown").click(function(evt){show(element,evt);}).on("keydown",function(evt){if(evt.keyCode==13){show(element,evt);}});if(o.startDateFieldId!==undefined&&o.startDateFieldId!==""){var startDate=FormUtil.getField(o.startDateFieldId);startDate.live("change",function(){setDateRange(startDate,"minDate",element);});setDateRange(startDate,"minDate",element);}
if(o.endDateFieldId!==undefined&&o.endDateFieldId!==""){var endDate=FormUtil.getField(o.endDateFieldId);endDate.live("change",function(){setDateRange(endDate,"maxDate",element);});setDateRange(endDate,"maxDate",element);}
if(o.currentDateAs!==undefined&&o.currentDateAs!==""){var option=$(element).datepicker("option",o.currentDateAs);if(option===undefined||option===null){$(element).datepicker("option",o.currentDateAs,new Date());}}});}});function setDateRange(element,type,target){var value=$(element).val();if(value!==""){$(target).datepicker("option",type,value);}}})(jQuery);

(function($){$.fn.extend({dynamicOptions:function(o){var target=this;if($(target)){$('[name='+o.controlField+']').addClass("control-field");var showHideChange=function(){showHideOption(target,o);};var ajaxChange=function(){ajaxOptions(target,o);};if(o.nonce===''){$('body').off("change",'[name='+o.controlField+']',showHideChange);$('body').on("change",'[name='+o.controlField+']',showHideChange);showHideOption(target,o);}else{$('body').off("change",'[name='+o.controlField+']',ajaxChange);$('body').on("change",'[name='+o.controlField+']',ajaxChange);ajaxOptions(target,o);}}
return target;}});function getValues(name){var el=$('[name='+name+']').filter("input[type=hidden]:not([disabled=true]), :enabled, [disabled=false]");var values=new Array();if($(el).is("select")){el=$(el).find("option:selected");}else if($(el).is("input[type=checkbox], input[type=radio]")){el=$(el).filter(":checked");}
$(el).each(function(){values.push($(this).val());});return values;}
function ajaxOptions(target,o){var controlValues=getValues(o.controlField);var values=getValues(o.paramName);var cv=controlValues.join(";");$.getJSON(o.contextPath+"/web/json/app/"+o.appId+"/"+o.appVersion+"/form/options",{_dv:cv,_n:o.nonce,_bd:o.binderData},function(data){if(o.type==="selectbox"){var options="";for(var i=0,len=data.length;i<len;i++){var selected="";if($.inArray(UI.escapeHTML(data[i].value),values)!==-1){selected="selected=\"selected\"";}
options+="<option "+selected+" value=\""+UI.escapeHTML(data[i].value)+"\">"+UI.escapeHTML(data[i].label)+"</option>"}
$(target).html(options);}else{var options="";for(var i=0,len=data.length;i<len;i++){var checked="";if($.inArray(UI.escapeHTML(data[i].value),values)!==-1){checked="checked=\"checked\"";}
options+="<label><input "+checked+" id=\""+o.paramName+"\" name=\""+o.paramName+"\" type=\""+o.type+"\" value=\""+UI.escapeHTML(data[i].value)+"\" />"+UI.escapeHTML(data[i].label)+"</label>";}
$(target).html(options);if(o.readonly==="true"){$(target).find("input").click(function(){return false;});}}
if(!$(target).is(".section-visibility-disabled")){$('[name='+o.paramName+']:not(.section-visibility-disabled)').trigger("change");}});}
function showHideOption(target,o){var controlValues=getValues(o.controlField);var values=getValues(o.paramName);if($(target).is("select")){if($(target).closest(".form-cell, .subform-cell").find('select.dynamic_option_container').length==0){$(target).after('<div class="ui-screen-hidden"><select class="dynamic_option_container" style="display:none;">'+$(target).html()+'</select></div>');}
$(target).html($(target).closest(".form-cell, .subform-cell").find('select.dynamic_option_container').html());$(target).find("option").each(function(){var option=$(this);if($(option).attr("grouping")!=""&&$.inArray($(option).attr("grouping"),controlValues)==-1){$(option).remove();}else{if($.inArray($(option).attr("value"),values)!==-1){$(option).attr("selected","selected");}}});}else{$(target).find("input").each(function(){var option=$(this);var label=$(option).parent();if($(option).attr("grouping")==""||$.inArray($(option).attr("grouping"),controlValues)>-1){$(label).show();}else{if($(option).is(":checked")){$(option).removeAttr("checked");}
$(label).hide();}});}
if(!$(target).is(".section-visibility-disabled")){$('[name='+o.paramName+']:not(.section-visibility-disabled)').trigger("change");}}})(jQuery);

var VisibilityMonitor=function(targetEl,controlEl,controlValue,isRegex){this.target=targetEl;this.control=controlEl;this.controlValue=controlValue;this.isRegex=isRegex;}
VisibilityMonitor.prototype.target=null;VisibilityMonitor.prototype.control=null;VisibilityMonitor.prototype.controlValue=null;VisibilityMonitor.prototype.isRegex=null;VisibilityMonitor.prototype.init=function(){var thisObject=this;var targetEl=$(this.target);var controlEl=$("[name="+this.control+"]");var controlVal=this.controlValue;var isRegex=this.isRegex;$(controlEl).addClass("control-field");thisObject.handleChange(targetEl,controlEl,controlVal,isRegex);var changeEvent=function(){thisObject.handleChange(targetEl,controlEl,controlVal,isRegex);};$('body').off("change","[name="+this.control+"]",changeEvent);$('body').on("change","[name="+this.control+"]",changeEvent);}
VisibilityMonitor.prototype.handleChange=function(targetEl,controlEl,controlVal,isRegex){var thisObject=this;var match=thisObject.checkValue(thisObject,controlEl,controlVal,isRegex);if(match){targetEl.css("display","block");targetEl.removeClass("section-visibility-hidden");thisObject.enableInputField(targetEl);}else{targetEl.css("display","none");targetEl.addClass("section-visibility-hidden");thisObject.disableInputField(targetEl);}}
VisibilityMonitor.prototype.checkValue=function(thisObject,controlEl,controlValue,isRegex){controlEl=$(controlEl).filter("input[type=hidden]:not([disabled=true]), :enabled, [disabled=false]");controlEl=$(controlEl).filter(":not(.section-visibility-disabled)");var match=false;if($(controlEl).length>0){if($(controlEl).attr("type")=="checkbox"||$(controlEl).attr("type")=="radio"){controlEl=$(controlEl).filter(":checked");}else if($(controlEl).is("select")){controlEl=$(controlEl).find("option:selected");}
if($(controlEl).length>0){$(controlEl).each(function(){match=thisObject.isMatch($(this).val(),controlValue,isRegex);if(match){return false;}});}else{match=thisObject.isMatch("",controlValue,isRegex);}}
return match;}
VisibilityMonitor.prototype.isMatch=function(value,controlValue,isRegex){if(isRegex!=undefined&&"true"==isRegex){try{var regex=new RegExp(controlValue);return regex.exec(value)==value;}catch(err){return false;}}else{return value==controlValue;}}
VisibilityMonitor.prototype.disableInputField=function(targetEl){var thisObject=this;var names=new Array();$(targetEl).find('input, select, textarea, .form-element').each(function(){if($(this).is("input[type=hidden]:not([disabled=true]), :enabled, [disabled=false]")){$(this).addClass("section-visibility-disabled").attr("disabled",true);var mobileSelector=".ui-input-text, .ui-checkbox, .ui-radio, .ui-select";if($(this).is(mobileSelector)||$(this).parent().is(mobileSelector)||$(this).parent().parent().is(mobileSelector)){if($(this).is("[type='checkbox'], [type='radio']")){$(this).checkboxradio("disable");}else if($(this).is("select")){$(this).selectmenu("disable");}else{$(this).textinput("disable");}}}
if($(this).is("[name].control-field")){var n=$(this).attr("name");if($.inArray(n,names)<0&&n!=""){names.push(n);}}});thisObject.triggerChange(targetEl,names);}
VisibilityMonitor.prototype.enableInputField=function(targetEl){var thisObject=this;var names=new Array();$(targetEl).find('input, select, textarea, .form-element').each(function(){if($(this).is(".section-visibility-disabled")){$(this).removeClass("section-visibility-disabled").removeAttr("disabled");var mobileSelector=".ui-input-text, .ui-checkbox, .ui-radio, .ui-select";if($(this).is(mobileSelector)||$(this).parent().is(mobileSelector)||$(this).parent().parent().is(mobileSelector)){if($(this).is("[type='checkbox'], [type='radio']")){$(this).checkboxradio("enable");}else if($(this).is("select")){$(this).selectmenu("enable");}else{$(this).textinput("enable");}}}
if($(this).is("[name].control-field")){var n=$(this).attr("name");if($.inArray(n,names)<0&&n!=""){names.push(n);}}});thisObject.triggerChange(targetEl,names);$(window).trigger("resize");}
VisibilityMonitor.prototype.triggerChange=function(targetEl,names){$.each(names,function(i){var temp=false;var newObject=$("[name="+names[i]+"]");if(newObject.length===0){newObject=$('<input name="'+names[i]+'" class="control-field" style="display:none;" />');$(targetEl).append(newObject);temp=true;}
$("[name="+names[i]+"]").trigger("change");if(temp){$(newObject).remove();}});};
