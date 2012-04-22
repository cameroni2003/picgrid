function picGridModel(){
	var self = this;

	self.accessToken = '36177776.cd5f9e9.c050b7c08f1e40309ba93039e48f52fb';
	self.myImages = ko.observableArray([]);
	self.friends = ko.observableArray([]);
	self.uniqueFriends = ko.observableArray([]);
	self.selectedFriends = ko.observableArray([]);

	ko.bindingHandlers.friendCheckbox = {
		update: function(el, val)
		{

		}
	}

	$.ajax({
		url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + self.accessToken,
		dataType: 'jsonp',
		success: function(data)
		{
			self.myImages(data.data);
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

			self.selectedFriends(self.uniqueFriends());
		}
	})
}

$(function() {
	grid = new picGridModel()
	ko.applyBindings(grid);
})