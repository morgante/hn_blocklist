(function() {
	chrome.storage.sync.get("hn_banned", function(value) {
		var users = value.hn_banned || {};

		function banUser(username) {
			users[username] = {
				username: username,
				blocked: true,
				timestamp: Date.now()
			};
			chrome.storage.sync.set({"hn_banned": users});
		}

		function unbanUser(username) {
			delete users[username];
			chrome.storage.sync.set({"hn_banned": users});
		}

		function handleItem(item) {
			var username = item.querySelector("a").text;

			var actor = document.createElement('a');
			actor.href = "#";

			if (users[username] !== undefined) {
				item.querySelector(".comment").innerHTML = "[blocked]";

				actor.innerHTML = "unblock";
				actor.onclick = function() {
					unbanUser(username);
					return false;
				};
			} else {
				actor.innerHTML = "block";
				actor.onclick = function() {
					banUser(username);
					return false;
				};
			}

			item.querySelector(".comhead").appendChild(actor);
		}

		var comments = document.querySelectorAll(".default");

		console.log('comments', comments, users);

		for (var i = 0; i < comments.length; ++i) {
			handleItem(comments[i]);
		}

	});

})();

