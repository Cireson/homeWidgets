(function(){
	var localSettings = {
		goodMorningText: 'Good morning ',
		goodAfternoonText: 'Good afternoon ',
		goodEveningText: 'Good evening ',
		wiCardWidgetPageSize: 5,
		homeCatPageSize: 5,
		myWorkStatusFilter: 'Active,In Progress,Submitted',
		myRequestsStatusFilter: 'Active,In Progress,Failed',
		savedSearchStatusFilter: 'Active,In Progress,Submitted',
		myWorkProperties: 'Status,AffectedUser',
		myRequestsProperties: 'Status',
		savedSearchProperties: 'Status,AffectedUser',
		myRequestsDateProp: 'Created',
		myWorkDateProp: 'LastModified',
		savedSearchDateProp: 'Created'
	};

	var homeWidgets = {
		"util": {
			"pageX": function(data, widgetId, callback, additionalParameter, pageValue) {
				var pager = $('#' + widgetId).next();
				var pageLeft = pager.find('.pageLeft');
				var pageRight = pager.find('.pageRight');
				pageLeft.off('click');
				pageLeft.click(function(){
					if (!($(this).hasClass('disabled'))) {
						var pageStart = parseInt(pager.find('.pageStart').text());
						if (pageStart - pageValue > 0) {
							if (additionalParameter) {
								callback(data, pageStart - (pageValue + 1), widgetId, additionalParameter);
							}
							else {
								callback(data, pageStart - (pageValue + 1), widgetId);
							}
						}
						else {
							if (additionalParameter) {
								callback(data, 0, widgetId, additionalParameter);
							}
							else {
								callback(data, 0, widgetId);
							}
						}
					}
				});
				
				pageRight.off('click');
				pageRight.click(function(){
					if (!($(this).hasClass('disabled'))) {
						var pageEnd = parseInt(pager.find('.pageEnd').text());
						var pagerValue = parseInt($('#' + widgetId + '_pager').text());
						if (pageEnd + 1 <= pagerValue) {
							if (additionalParameter) {
								callback(data,pageEnd,widgetId,additionalParameter);
							}
							else {
								callback(data,pageEnd,widgetId);
							}
						}
					}
				});
			},
			"pageSetup": function(data, index, widgetId, pageSize){
				$('#' + widgetId + '_pager').text(data.length.toString());
				var pager = $('#' + widgetId).next();
				pager.find('.pageStart').text((index + 1).toString());
				if (index + pageSize < data.length) {
					pager.find('.pageEnd').text((index + pageSize).toString());
					pager.find('.pageRight').removeClass('disabled');
				}
				else {
					pager.find('.pageEnd').text(data.length.toString());
					pager.find('.pageRight').addClass('disabled');
				}
				if (index == 0) {
					pager.find('.pageLeft').addClass('disabled');
				}
				else {
					pager.find('.pageLeft').removeClass('disabled');
				}
			},
			"getSearchDefinition": function(id){
				var search = JSON.parse(sessionStorage['viewPanels.all']).filter(function(e) {return e.Id == id})[0];
				if (search) {
					var def = search.Definition.content.query;
					return JSON.stringify(def);
				}
			},
			"buildFooter": function(id){
				var footer = '<div class="widgetFooter"><div class="pagingArea"><i class="fa fa-angle-double-left pageLeft"></i><span class="pageStart"></span> - <span class="pageEnd"></span> of <span id="' + id + '_pager"></span><i class="fa fa-angle-double-right pageRight"></i></div></div>';
				return footer;
			}
		},
		"widgets": [
			{
				name: 'welcomeMessage',
				callback: function(widget){
					var hour = new Date().getHours();
					var message = hour < 12 ? localSettings.goodMorningText : hour > 17 ? localSettings.goodEveningText : localSettings.goodAfternoonText;
					var header = $(widget).parent().parent().parent().parent().prev();
					header.text(message + session.user.FirstName + '!')
						.append('<i class="fa fa-times" id="closeWelcome"></i>');
					$('#closeWelcome').click(function() {
						var closer = $(this).parent().parent();
						closer.hide()
							.next().addClass('afterClose');
					});
				}
			}
		],
		"add": function(name, callback, additionalParams) {
			var widget = {
				name: name,
				callback: callback
			}
			if (additionalParams) {
				widget.additionalParams = additionalParams;
			}
			homeWidgets.widgets.push(widget);
			return this;
		},
		"getSettings": function(){
			return localSettings;
		}
	}

	var build = function(){
		homeWidgets.widgets.forEach(function(widget) {
			$('.' + widget.name).each(function(i,e){
				if (widget.additionalParams) {
					var parameters = [e,i];
					if (_.isString(widget.additionalParams)) {
						parameters.push(widget.additionalParams);
					}
					else {
						for (var param in widget.additionalParams){
							var thisParam = widget.additionalParams[param];
							var val;
							if (_.isFunction(thisParam)) {
								val = thisParam(e,i);
							}
							else {
								val = thisParam;
							}
							parameters.push(val);
						}
					}
					widget.callback(...parameters);
				}
				else {
					widget.callback(e,i);
				}
			})
		});		
	};

	$(document).ready(function() {
		$('<link/>', {
			typageEnd: 'text/css',
			rel: 'stylesheet',
			href: '/CustomSpace/homeWidgets/style.css',
		}).appendTo('head');
		
		var widgetsToLoad = ["homeCat", "homeSearch", "link-replace", "requests", "topArticles", "wiCardWidget"];
		widgetsToLoad.forEach(function(widget){
			loadScript("/CustomSpace/homeWidgets/" + widget + ".js", [""]);
		});
		
		var mainPageNode = document.getElementById('main_wrapper');
		var observer = new MutationObserver(function(mutations) {
			if ($('.dashboard').length > 0) {
				$('.margin-t20').prev().hide();
				app.events.publish('homeWidgetsReady', homeWidgets);
				build();
				app.events.subscribe('sessionStorageReady', function(){
					build();
				});
				observer.disconnect();
			}
			else {
				return;
			}
		});
		var observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };
		observer.observe(mainPageNode, observerConfig);

	});
}());