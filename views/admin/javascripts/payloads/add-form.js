!function(){var a,b,c,d,e,f={}.hasOwnProperty,g=function(a,b){function c(){this.constructor=a}for(var d in b)f.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};d=function(){function a(){this.options_index=0,this.parsed=[]}return a.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},a.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),children:0,disabled:a.disabled}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},a.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},a.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},a}(),d.select_to_array=function(a){var b,c,e,f,g;for(c=new d,g=a.childNodes,e=0,f=g.length;f>e;e++)b=g[e],c.add_node(b);return c.parsed},b=function(){function a(b,c){this.form_field=b,this.options=null!=c?c:{},a.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers())}return a.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.result_single_selected=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0},a.prototype.set_default_text=function(){return this.default_text=this.form_field.getAttribute("data-placeholder")?this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.options.placeholder_text_multiple||this.options.placeholder_text||a.default_multiple_text:this.options.placeholder_text_single||this.options.placeholder_text||a.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||a.default_no_result_text},a.prototype.mouse_enter=function(){return this.mouse_on_container=!0},a.prototype.mouse_leave=function(){return this.mouse_on_container=!1},a.prototype.input_focus=function(){var a=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return a.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},a.prototype.input_blur=function(){var a=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return a.blur_test()},100))},a.prototype.results_option_build=function(a){var b,c,d,e,f;for(b="",f=this.results_data,d=0,e=f.length;e>d;d++)c=f[d],b+=c.group?this.result_add_group(c):this.result_add_option(c),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(c.text));return b},a.prototype.result_add_option=function(a){var b,c;return a.search_match?this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=""!==a.style.cssText?' style="'+a.style+'"':"",'<li class="'+b.join(" ")+'"'+c+' data-option-array-index="'+a.array_index+'">'+a.search_text+"</li>"):"":""},a.prototype.result_add_group=function(a){return a.search_match||a.group_match?a.active_options>0?'<li class="group-result">'+a.search_text+"</li>":"":""},a.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.result_single_selected=null,this.results_build(),this.results_showing?this.winnow_results():void 0},a.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},a.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()},a.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(this.no_results_clear(),e=0,g=this.get_search_text(),a=g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),d=this.search_contains?"":"^",c=new RegExp(d+a,"i"),j=new RegExp(a,"i"),m=this.results_data,k=0,l=m.length;l>k;k++)b=m[k],b.search_match=!1,f=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(f=this.results_data[b.group_array_index],0===f.active_options&&f.search_match&&(e+=1),f.active_options+=1),(!b.group||this.group_search)&&(b.search_text=b.group?b.label:b.html,b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(e+=1),b.search_match?(g.length&&(h=b.search_text.search(j),i=b.search_text.substr(0,h+g.length)+"</em>"+b.search_text.substr(h+g.length),b.search_text=i.substr(0,h)+"<em>"+i.substr(h)),null!=f&&(f.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>e&&g.length?(this.update_results_content(""),this.no_results(g)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},a.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},a.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},a.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},a.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},a.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},a.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},a.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)?!1:/Android/i.test(window.navigator.userAgent)&&/Mobile/i.test(window.navigator.userAgent)?!1:!0},a.default_multiple_text="Select Some Options",a.default_single_text="Select an Option",a.default_no_result_text="No results match",a}(),a=jQuery,a.fn.extend({chosen:function(d){return b.browser_is_supported()?this.each(function(){var b,e;b=a(this),e=b.data("chosen"),"destroy"===d&&e?e.destroy():e||b.data("chosen",new c(this,d))}):this}}),c=function(b){function c(){return e=c.__super__.constructor.apply(this,arguments)}return g(c,b),c.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},c.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior(),this.form_field_jq.trigger("chosen:ready",{chosen:this})},c.prototype.register_observers=function(){var a=this;return this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},c.prototype.destroy=function(){return a(document).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},c.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},c.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(document).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},c.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},c.prototype.search_results_mousewheel=function(a){var b,c,d;return b=-(null!=(c=a.originalEvent)?c.wheelDelta:void 0)||(null!=(d=a.originialEvent)?d.detail:void 0),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},c.prototype.blur_test=function(){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},c.prototype.close_field=function(){return a(document).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},c.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},c.prototype.test_active_click=function(b){return this.container.is(a(b.target).closest(".chosen-container"))?this.active_field=!0:this.close_field()},c.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=d.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},c.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},c.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},c.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results())},c.prototype.update_results_content=function(a){return this.search_results.html(a)},c.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},c.prototype.set_tab_index=function(){var a;return this.form_field.tabIndex?(a=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=a):void 0},c.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},c.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},c.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},c.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},c.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},c.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+b.html+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},c.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},c.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},c.prototype.results_reset=function(){return this.form_field.options[0].selected=!0,this.selected_option_count=null,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},c.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},c.prototype.result_select=function(a){var b,c,d;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):(this.result_single_selected&&(this.result_single_selected.removeClass("result-selected"),d=this.result_single_selected[0].getAttribute("data-option-array-index"),this.results_data[d].selected=!1),this.result_single_selected=b),b.addClass("result-selected"),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(c.text),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,this.search_field_scale())):void 0},c.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").text(a)},c.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},c.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},c.prototype.get_search_text=function(){return this.search_field.val()===this.default_text?"":a("<div/>").text(a.trim(this.search_field.val())).html()},c.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},c.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c)},c.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},c.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},c.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},c.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},c.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},c.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},c.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},c}(b)}.call(this),!function(a,b){"use strict";function c(a,b){var c,d,e=a.toLowerCase();for(b=[].concat(b),c=0;c<b.length;c+=1)if(d=b[c]){if(d.test&&d.test(a))return!0;if(d.toLowerCase()===e)return!0}}var d=b.prototype.trim,e=b.prototype.trimRight,f=b.prototype.trimLeft,g=function(a){return 1*a||0},h=function(a,b){if(1>b)return"";for(var c="";b>0;)1&b&&(c+=a),b>>=1,a+=a;return c},i=[].slice,j=function(a){return null==a?"\\s":a.source?a.source:"["+o.escapeRegExp(a)+"]"},k={lt:"<",gt:">",quot:'"',amp:"&",apos:"'"},l={};for(var m in k)l[k[m]]=m;l["'"]="#39";var n=function(){function a(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}var c=h,d=function(){return d.cache.hasOwnProperty(arguments[0])||(d.cache[arguments[0]]=d.parse(arguments[0])),d.format.call(null,d.cache[arguments[0]],arguments)};return d.format=function(d,e){var f,g,h,i,j,k,l,m=1,o=d.length,p="",q=[];for(g=0;o>g;g++)if(p=a(d[g]),"string"===p)q.push(d[g]);else if("array"===p){if(i=d[g],i[2])for(f=e[m],h=0;h<i[2].length;h++){if(!f.hasOwnProperty(i[2][h]))throw new Error(n('[_.sprintf] property "%s" does not exist',i[2][h]));f=f[i[2][h]]}else f=i[1]?e[i[1]]:e[m++];if(/[^s]/.test(i[8])&&"number"!=a(f))throw new Error(n("[_.sprintf] expecting number but found %s",a(f)));switch(i[8]){case"b":f=f.toString(2);break;case"c":f=b.fromCharCode(f);break;case"d":f=parseInt(f,10);break;case"e":f=i[7]?f.toExponential(i[7]):f.toExponential();break;case"f":f=i[7]?parseFloat(f).toFixed(i[7]):parseFloat(f);break;case"o":f=f.toString(8);break;case"s":f=(f=b(f))&&i[7]?f.substring(0,i[7]):f;break;case"u":f=Math.abs(f);break;case"x":f=f.toString(16);break;case"X":f=f.toString(16).toUpperCase()}f=/[def]/.test(i[8])&&i[3]&&f>=0?"+"+f:f,k=i[4]?"0"==i[4]?"0":i[4].charAt(1):" ",l=i[6]-b(f).length,j=i[6]?c(k,l):"",q.push(i[5]?f+j:j+f)}return q.join("")},d.cache={},d.parse=function(a){for(var b=a,c=[],d=[],e=0;b;){if(null!==(c=/^[^\x25]+/.exec(b)))d.push(c[0]);else if(null!==(c=/^\x25{2}/.exec(b)))d.push("%");else{if(null===(c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b)))throw new Error("[_.sprintf] huh?");if(c[2]){e|=1;var f=[],g=c[2],h=[];if(null===(h=/^([a-z_][a-z_\d]*)/i.exec(g)))throw new Error("[_.sprintf] huh?");for(f.push(h[1]);""!==(g=g.substring(h[0].length));)if(null!==(h=/^\.([a-z_][a-z_\d]*)/i.exec(g)))f.push(h[1]);else{if(null===(h=/^\[(\d+)\]/.exec(g)))throw new Error("[_.sprintf] huh?");f.push(h[1])}c[2]=f}else e|=2;if(3===e)throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");d.push(c)}b=b.substring(c[0].length)}return d},d}(),o={VERSION:"2.3.0",isBlank:function(a){return null==a&&(a=""),/^\s*$/.test(a)},stripTags:function(a){return null==a?"":b(a).replace(/<\/?[^>]+>/g,"")},capitalize:function(a){return a=null==a?"":b(a),a.charAt(0).toUpperCase()+a.slice(1)},chop:function(a,c){return null==a?[]:(a=b(a),c=~~c,c>0?a.match(new RegExp(".{1,"+c+"}","g")):[a])},clean:function(a){return o.strip(a).replace(/\s+/g," ")},count:function(a,c){if(null==a||null==c)return 0;a=b(a),c=b(c);for(var d=0,e=0,f=c.length;;){if(e=a.indexOf(c,e),-1===e)break;d++,e+=f}return d},chars:function(a){return null==a?[]:b(a).split("")},swapCase:function(a){return null==a?"":b(a).replace(/\S/g,function(a){return a===a.toUpperCase()?a.toLowerCase():a.toUpperCase()})},escapeHTML:function(a){return null==a?"":b(a).replace(/[&<>"']/g,function(a){return"&"+l[a]+";"})},unescapeHTML:function(a){return null==a?"":b(a).replace(/\&([^;]+);/g,function(a,c){var d;return c in k?k[c]:(d=c.match(/^#x([\da-fA-F]+)$/))?b.fromCharCode(parseInt(d[1],16)):(d=c.match(/^#(\d+)$/))?b.fromCharCode(~~d[1]):a})},escapeRegExp:function(a){return null==a?"":b(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},splice:function(a,b,c,d){var e=o.chars(a);return e.splice(~~b,~~c,d),e.join("")},insert:function(a,b,c){return o.splice(a,b,0,c)},include:function(a,c){return""===c?!0:null==a?!1:-1!==b(a).indexOf(c)},join:function(){var a=i.call(arguments),b=a.shift();return null==b&&(b=""),a.join(b)},lines:function(a){return null==a?[]:b(a).split("\n")},reverse:function(a){return o.chars(a).reverse().join("")},startsWith:function(a,c){return""===c?!0:null==a||null==c?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(0,c.length)===c)},endsWith:function(a,c){return""===c?!0:null==a||null==c?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(a.length-c.length)===c)},succ:function(a){return null==a?"":(a=b(a),a.slice(0,-1)+b.fromCharCode(a.charCodeAt(a.length-1)+1))},titleize:function(a){return null==a?"":(a=b(a).toLowerCase(),a.replace(/(?:^|\s|-)\S/g,function(a){return a.toUpperCase()}))},camelize:function(a){return o.trim(a).replace(/[-_\s]+(.)?/g,function(a,b){return b?b.toUpperCase():""})},underscored:function(a){return o.trim(a).replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase()},dasherize:function(a){return o.trim(a).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},classify:function(a){return o.titleize(b(a).replace(/[\W_]/g," ")).replace(/\s/g,"")},humanize:function(a){return o.capitalize(o.underscored(a).replace(/_id$/,"").replace(/_/g," "))},trim:function(a,c){return null==a?"":!c&&d?d.call(a):(c=j(c),b(a).replace(new RegExp("^"+c+"+|"+c+"+$","g"),""))},ltrim:function(a,c){return null==a?"":!c&&f?f.call(a):(c=j(c),b(a).replace(new RegExp("^"+c+"+"),""))},rtrim:function(a,c){return null==a?"":!c&&e?e.call(a):(c=j(c),b(a).replace(new RegExp(c+"+$"),""))},truncate:function(a,c,d){return null==a?"":(a=b(a),d=d||"...",c=~~c,a.length>c?a.slice(0,c)+d:a)},prune:function(a,c,d){if(null==a)return"";if(a=b(a),c=~~c,d=null!=d?b(d):"...",a.length<=c)return a;var e=function(a){return a.toUpperCase()!==a.toLowerCase()?"A":" "},f=a.slice(0,c+1).replace(/.(?=\W*\w*$)/g,e);return f=f.slice(f.length-2).match(/\w\w/)?f.replace(/\s*\S+$/,""):o.rtrim(f.slice(0,f.length-1)),(f+d).length>a.length?a:a.slice(0,f.length)+d},words:function(a,b){return o.isBlank(a)?[]:o.trim(a,b).split(b||/\s+/)},pad:function(a,c,d,e){a=null==a?"":b(a),c=~~c;var f=0;switch(d?d.length>1&&(d=d.charAt(0)):d=" ",e){case"right":return f=c-a.length,a+h(d,f);case"both":return f=c-a.length,h(d,Math.ceil(f/2))+a+h(d,Math.floor(f/2));default:return f=c-a.length,h(d,f)+a}},lpad:function(a,b,c){return o.pad(a,b,c)},rpad:function(a,b,c){return o.pad(a,b,c,"right")},lrpad:function(a,b,c){return o.pad(a,b,c,"both")},sprintf:n,vsprintf:function(a,b){return b.unshift(a),n.apply(null,b)},toNumber:function(a,b){return a?(a=o.trim(a),a.match(/^-?\d+(?:\.\d+)?$/)?g(g(a).toFixed(~~b)):0/0):0},numberFormat:function(a,b,c,d){if(isNaN(a)||null==a)return"";a=a.toFixed(~~b),d="string"==typeof d?d:",";var e=a.split("."),f=e[0],g=e[1]?(c||".")+e[1]:"";return f.replace(/(\d)(?=(?:\d{3})+$)/g,"$1"+d)+g},strRight:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strRightBack:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.lastIndexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strLeft:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(0,d):a},strLeftBack:function(a,b){if(null==a)return"";a+="",b=null!=b?""+b:b;var c=a.lastIndexOf(b);
return~c?a.slice(0,c):a},toSentence:function(a,b,c,d){b=b||", ",c=c||" and ";var e=a.slice(),f=e.pop();return a.length>2&&d&&(c=o.rtrim(b)+c),e.length?e.join(b)+c+f:f},toSentenceSerial:function(){var a=i.call(arguments);return a[3]=!0,o.toSentence.apply(o,a)},slugify:function(a){if(null==a)return"";var c="ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",d="aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",e=new RegExp(j(c),"g");return a=b(a).toLowerCase().replace(e,function(a){var b=c.indexOf(a);return d.charAt(b)||"-"}),o.dasherize(a.replace(/[^\w\s-]/g,""))},surround:function(a,b){return[b,a,b].join("")},quote:function(a,b){return o.surround(a,b||'"')},unquote:function(a,b){return b=b||'"',a[0]===b&&a[a.length-1]===b?a.slice(1,a.length-1):a},exports:function(){var a={};for(var b in this)this.hasOwnProperty(b)&&!b.match(/^(?:include|contains|reverse)$/)&&(a[b]=this[b]);return a},repeat:function(a,c,d){if(null==a)return"";if(c=~~c,null==d)return h(b(a),c);for(var e=[];c>0;e[--c]=a);return e.join(d)},naturalCmp:function(a,c){if(a==c)return 0;if(!a)return-1;if(!c)return 1;for(var d=/(\.\d+)|(\d+)|(\D+)/g,e=b(a).toLowerCase().match(d),f=b(c).toLowerCase().match(d),g=Math.min(e.length,f.length),h=0;g>h;h++){var i=e[h],j=f[h];if(i!==j){var k=parseInt(i,10);if(!isNaN(k)){var l=parseInt(j,10);if(!isNaN(l)&&k-l)return k-l}return j>i?-1:1}}return e.length===f.length?e.length-f.length:c>a?-1:1},levenshtein:function(a,c){if(null==a&&null==c)return 0;if(null==a)return b(c).length;if(null==c)return b(a).length;a=b(a),c=b(c);for(var d,e,f=[],g=0;g<=c.length;g++)for(var h=0;h<=a.length;h++)e=g&&h?a.charAt(h-1)===c.charAt(g-1)?d:Math.min(f[h],f[h-1],d)+1:g+h,d=f[h],f[h]=e;return f.pop()},toBoolean:function(a,b,d){return"number"==typeof a&&(a=""+a),"string"!=typeof a?!!a:(a=o.trim(a),c(a,b||["true","1"])?!0:c(a,d||["false","0"])?!1:void 0)}};o.strip=o.trim,o.lstrip=o.ltrim,o.rstrip=o.rtrim,o.center=o.lrpad,o.rjust=o.lpad,o.ljust=o.rpad,o.contains=o.include,o.q=o.quote,o.toBool=o.toBoolean,"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(module.exports=o),exports._s=o),"function"==typeof define&&define.amd&&define("underscore.string",[],function(){return o}),a._=a._||{},a._.string=a._.str=o}(this,String),jQuery(function(a){a(".chosen").chosen(),CKEDITOR.replace("narrative",{allowedContent:!0,toolbar:[["Maximize","Source"],["Bold","Italic","Underline","RemoveFormat"],["Link","Unlink","Image","Iframe"],["Styles","Format","Font","FontSize"],["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"],["NumberedList","BulletedList"],["Outdent","Indent"],["Blockquote","CreateDiv"]]})}),jQuery(function(a){var b=a('input[name="title"]'),c=a('input[name="slug"]'),d=!1;c.change(function(){d=!0}),b.keyup(function(){d||c.val(_.string.slugify(b.val()))})});