function picGridModel(){
	var self = this;

	self.accessToken = window.location.hash.replace('#access_token=', '');
	self.myImages = ko.observableArray([]);
	self.friends = ko.observableArray([]);
	self.uniqueFriends = ko.observableArray([]);
	self.selectedFriends = ko.observableArray([]);

	self.selectedFriends.subscribe(function(e){
		var filterIds = self.selectedFriends().map(function(friend) {
			return '.' + friend;
		});
		$('#pics').isotope({ filter: filterIds.join(',') });
	});



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
				caption += "<br/>blah"

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
			$('#pics').isotope('reLayout')
			//self.selectedFriends(self.uniqueFriends().map(function(friend)  { return friend.id}));
		}
	})
}

$(function() {
	$('#pics').isotope({
		resizeable: true
	});
	grid = new picGridModel()
	ko.applyBindings(grid);

	
	$('input').live('click', function(e){
		var filterIds = grid.selectedFriends().map(function(friend) {
			return '.' + friend;
		});
		$('#pics').isotope({ filter: filterIds.join(',') });
	});

	$('#friends li').live('click', function(e){
		

		var checkbox = $(this).find('input');
		var isChecked = checkbox.prop('checked');
		checkboxData = ko.dataFor(checkbox[0]);
		if(isChecked)
		{
			//debugger
			$(this).removeClass('highlight');

			ko.contextFor(checkbox[0]).$parent.selectedFriends.remove(checkboxData.id);
			
		}
		else
		{
						//debugger;

			$(this).addClass('highlight');

			var newArray = grid.selectedFriends();
			newArray.push(checkboxData.id);
			grid.selectedFriends(newArray);
			checkbox.prop('checked', true);
		}

	});
	
})