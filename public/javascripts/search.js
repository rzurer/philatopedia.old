	function createQuery() {
		var query;
		query = {};
		query.collection = $('#collectionsource').val();
		query.tags = [];
		getLocalTags().forEach(function(tag){
			query.tags.push(tag);
		});	
		placeInLocalStorage('collectionOrTagsQuery', query);
		return query;	
	}
	function createEmptyQuery() {
		var query;
		query = {};
		query.collection = null;
		query.tags = [];
		placeInLocalStorage('collectionOrTagsQuery', query);
		return query;	
	}
	function getCollectionCount(collection, callback){
		$.ajax({
			type: 'POST',
			url: '/getCollectionCount',
			data: {
				collection: collection
			},
			success: function (data) {
				if(callback){
					callback(data.collectionCount);
				}
			}
		});		
	}
	function getTagCount(tag, callback){
		$.ajax({
			type: 'POST',
			url: '/getTagCount',
			data: {
				tag: tag
			},
			success: function (data) {
				if(callback){
					callback(data.tagCount);
				}
			}
		});		
	}

	function removeTagFromQuery(tag){	
		var callback = function (tagCount){
			var query;
			if(tagCount === 0){
				query = getFromLocalStorage('collectionOrTagsQuery');
				query.tags.splice(query.tags.indexOf(tag), 1);
				placeInLocalStorage('collectionOrTagsQuery', query);
				displaySearchCriteria();
				console.log("here we are");
			}
		}
		getTagCount(tag, callback);
	}
	function removeCollectionFromQuery(collection){
		var callback = function (collectionCount){
			var query;
			if(collectionCount === 0){
				query = getFromLocalStorage('collectionOrTagsQuery');
				if(query.collection === collection){
					query.collection = '';
				}
				placeInLocalStorage('collectionOrTagsQuery', query);
			}
			displaySearchCriteria();
		}
		getCollectionCount(collection, callback);
	}
	function clearSearch (callback) {
		removeLocalStorageKey('collectionOrTagsQuery');
		filterStampListings(callback);
	}
	function displaySearchCriteria (data){
		var searchcriteriaDisplay, hasCollection, hasTags, tagsDisplay, query, collection, tags;
		query = getFromLocalStorage('collectionOrTagsQuery');
		collection = query.collection;
		tags = query.tags;
		hasCollection = collection && collection.length > 0;
		hasTags = tags && tags.length > 0;
		searchcriteriaDisplay = !hasCollection && !hasTags ? 'All' : '';
		$('#searchcriteria').text('Search Criteria: ' + searchcriteriaDisplay);
		if(hasCollection) {
			$('#collectioncriteria').text('Collection: ');
			$('#collectionvalue').text(collection);
		} else {
			$('#collectioncriteria').text('');
			$('#collectionvalue').text('');
		}
		if(hasTags) {
			tagsDisplay = '';
			tags.forEach(function(element){
				tagsDisplay += element + ', ';
				})
			tagsDisplay = tagsDisplay.substring(0,tagsDisplay.lastIndexOf(',') );
			$('#tagscriteria').text('Tags: ');
			$('#tagsvalue').text(tagsDisplay);
		} else {
			$('#tagscriteria').text('');
			$('#tagsvalue').text('');			
		}
		$('.listings').html(data);
		showHideClearSearch($('#clearsearch'));
	}
	function showHideClearSearch(img) {
		var query, shouldShow;
		query = getFromLocalStorage('collectionOrTagsQuery');
		shouldShow = (query.collection && query.collection.length > 0) || (query.tags && query.tags.length > 0);
		if(shouldShow) {
			$('.searchcriteria').append(img);
			img.show();
			return;
		}
		img.hide();
	}
	function createQueryAndSearch (callback) {
		createQuery();
		filterStampListings(callback);
	}
 	function filterStampListings(callback){
		var query = getFromLocalStorage('collectionOrTagsQuery');
		if(!query) {
			query = createQuery();
		}
		$.ajax({
			type: 'POST',
			url: '/filterStampListings',
			data: {
				collection: query.collection,
				tags: query.tags
			},
			success: function (data) {
				displaySearchCriteria(data);
				if(callback){
					callback();
				}		
			}
		});
	}