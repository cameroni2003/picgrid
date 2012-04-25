function picGridModel(){
	var self = this;

	self.accessToken = window.location.hash.replace('#access_token=', '');
	self.myImages = ko.observableArray([]);
	self.friends = ko.observableArray([]);
	self.uniqueFriends = ko.observableArray([]);
	self.selectedFriends = ko.observableArray([]);



	$.ajax({
		url: 'https://api.instagram.com/v1/users/self/feed',
		type: 'GET',
		data: { access_token: self.accessToken, count: 50 },
		dataType: 'jsonp',
		success: function(data)
		{
			self.myImages(data.data);
			var newItems = '';
			$.each(self.myImages(), function(i, val)
			{
				var caption = val.user.full_name;
				if(val.caption != null)
					caption += ': ' + val.caption.text;

				newItems += '<li class="' + val.user.id + '"><a title="' + caption + '" href="' + val.images.standard_resolution.url + '"><img src="' + val.images.thumbnail.url + '"/></a></li>';
			});
			
			$('#pics').isotope('insert', $(newItems));

			$.each(data.data, function(i, image)
			{
				//self.myImages().push(image);
				self.friends().push(image.user);
				
			});

			var idArray = new Array();
			self.uniqueFriends(ko.utils.arrayFilter(self.friends(), function(friend)
			{
				if($.inArray(friend.id, idArray) == -1)
				{
					idArray.push(friend.id);
					return true;
				}
				return false;
			}));

			//self.selectedFriends(self.uniqueFriends().map(function(friend)  { return friend.id}));
		}
	})
}

$(function() {
	$('#pics').isotope();
	grid = new picGridModel()
	ko.applyBindings(grid);

	$('input').live('click', function(e){
		var filterIds = grid.selectedFriends().map(function(friend) {
			return '.' + friend;
		});
		$('#pics').isotope({ filter: filterIds.join(',') });
	});

	
	
})