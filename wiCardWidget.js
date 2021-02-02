app.events.subscribe('homeWidgetsReady', function(data, homeWidgets){
	var settings = homeWidgets.getSettings();
	homeWidgets.add('wiCardWidget', 
		function(widget, index, type){
			var imgUrl = '/Content/Images/Icons/WorkTypeIcons/';
			function buildList(data, index, widgetId) {
				$('#' + widgetId).empty();
				var cardsToRender = data.slice(index, index + settings.wiCardWidgetPageSize);
				var dateVal;
				$.each(cardsToRender, function(ix, wi){
					if (type === 'savedSearch') {
						dateVal = kendo.toString(new Date(wi[dateProp].toString()), 'g');
					}
					else {
						dateVal = kendo.toString(new Date(wi[dateProp].toString() + 'Z'), 'g');
					}
					if (wi.Icon) {
						wiIcon = '<img src="' + imgUrl + wi.Icon + '">';
					}
					var wiType = wi.WorkItemType.split('.')[2];
					var wiCard = '<div class="cardBody"><div class="headerRow">' + wiIcon;
					wiCard += '<span class="wiLabel ' + wiType + '">' + wi.Id + ' - ' + wi.Title + '</span></div>';
					wiCard += '<p class="listDate">' + dateProp + ': ' + dateVal + '</p><p class="liBody">';
					$.each(props, function(z, p){
						wiCard += p + ': ' + wi[p.replace(' ','')] + (z == props.length - 1 ? '' : '</p><p>');
					})
					wiCard += '</p></div>';
					$('#' + widgetId).append("<a href='/" + wiType + "/Edit/" + wi.Id + "'><li class='homePageLi'>" + wiCard + "</li></a>");
				});
				
				homeWidgets.util.pageSetup(data, index, widgetId, settings.wiCardWidgetPageSize);
			}

			var url;
			var props;;
			var dateProp;
			var wiIcon = '';
			var widgetId;
			var statusFilter = [];

			
			switch(type) {
				case 'myrequests': {
					url = '/api/V3/WorkItem/GetGridWorkItemsMyRequests?userId=' + session.user.Id + '&showInactiveItems=false';
					props = settings.myRequestsProperties.split(',');
					dateProp = settings.myRequestsDateProp,
					widgetId = 'myRequests'
					statusFilter = settings.myRequestsStatusFilter.split(',');
					break;
				}
				case 'mywork': {
					url = '/api/V3/WorkItem/GetGridWorkItemsByUser?userId=' + session.user.Id + '&isScoped=' +  session.user.Security.IsWorkItemScoped + '&showActivities=false&showInactiveItems=false';
					props = settings.myWorkProperties.split(',');
					dateProp = settings.myWorkDateProp,
					widgetId = 'myWork'
					statusFilter = settings.myWorkStatusFilter.split(',');
					break;
				}
				case 'savedSearch': {
					url = "/search/GetAdHocResults";
					props = settings.savedSearchProperties.split(',');
					dateProp = settings.savedSearchDateProp;
					statusFilter = settings.savedSearchStatusFilter.split(',');
					var searchId = $(widget).text().toLowerCase();
					var widgetId = 'search' + searchId;
				}
			}
			
			$(widget).empty();
			$(widget).append('<ul id="' + widgetId + '" class="cardWidget"></ul>');
			$(widget).append(homeWidgets.util.buildFooter(widgetId));
			
			if (type==="savedSearch") {
				var criteria = homeWidgets.util.getSearchDefinition(searchId);
				if (criteria) {
					$.ajax({
						url: "/search/GetAdHocResults", 
						type: "POST", 
						data: {filterCriteria: criteria, dataTable: "WorkItem"}, 
						dataTpye: 'json', 
						success: function(data){
							if (data.Data.length > 0) {
								var newData;
								if (statusFilter.length === 0) {
									newData = data.Data;
								}
								else {
									newData = data.Data.filter(function(d){return statusFilter.includes(d.Status)});
								}
								if (newData.length > 0) {
									buildList(newData, 0, widgetId, 'savedSearch', dateProp, props);
									homeWidgets.util.pageX(data.Data, widgetId, buildList, null, settings.wiCardWidgetPageSize);
								}
								else {
									$(widget).parent().parent().parent().parent().parent().remove();
								}
							}
							else {
								$(widget).parent().parent().parent().parent().parent().remove();
							}

						}
					});
				}
			}
			else {
				$.get(url, function(data){
					if (data.length > 0) {
						var newData;
						if (statusFilter.length === 0) {
							newData = data;
						}
						else {
							newData = data.filter(function(d){return statusFilter.includes(d.Status)});
						}
						if (newData.length > 0) {
							buildList(newData, 0, widgetId, 'wiCardWidget', dateProp, props);
							homeWidgets.util.pageX(newData, widgetId, buildList, null, settings.wiCardWidgetPageSize);
						}
						else {
							$(widget).parent().parent().parent().parent().parent().remove();
						}
					}
					else {
						$(widget).parent().parent().parent().parent().parent().remove();
					}
				});
			}
		}, 
		{type: function(w) {return $(w).attr('class').replace('wiCardWidget ', '');}}
	);
});
	