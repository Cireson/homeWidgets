app.events.subscribe('homeWidgetsReady', function(data,homeWidgets){	
	homeWidgets.add('topArticles', function(widget){
		var type,url;
		type = $(widget).hasClass('featured') ? 'featured' : $(widget).hasClass('viewed') ? 'viewed' : '';
		
		switch (type) {
			case 'featured': {
				url = "/api/V3/Article/GetTopArticlesByPopularity?count=5";
				break;
			}
			case 'viewed': {
				url = "/api/V3/Article/GetTopArticlesByViewCount?count=5";
				break;
			}
			default: {
				url = "/api/V3/Article/GetTopArticlesByPopularity?count=5";
			}
		}
		$(widget).empty();
		$.get(url, function(data){
			$.each(data, function(i,e){
				$(widget).append('<li class="liArticle" id="kb' + e.ArticleId + '"><p class="liTitle">' + e.Title + '</p><p></p><p class="listDate">' + kendo.toString(new Date(e.LastModifiedDate.toString()), "g")  + '</p><p class="liBody">Rating: ' + e.Rating + '/5 </p><p class="listBody">Views: ' + e.ViewCount + '</p></li>');
				$('#kb' + e.ArticleId).click(function(){
					window.open('/KnowledgeBase/View/' + e.ArticleId, '_blank');
				});
			});
		});
	});
});