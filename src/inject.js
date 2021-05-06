(function() {
	function init() {
		chrome.storage.local.get("hn_banned", function(value) {
			var users = value.hn_banned || [];

			function banUser(username) {
				users.push(username);
				chrome.storage.local.set({"hn_banned": users});
			}

			function unbanUser(username) {
				var i = users.indexOf(username);
				if (i !== -1) users.splice(i, 1);
				chrome.storage.local.set({"hn_banned": users});
			}

			function listener(changes, namespace) {
				chrome.storage.onChanged.removeListener(listener);
				init();
			}

			chrome.storage.onChanged.addListener(listener);

			function handleItem(item) {
				var username = item.querySelector("a").text;
				var contents = item.querySelector(".comment span");

				var seperator = item.querySelector(".hn_bl_seperator");

				if (seperator !== null) {
					seperator.remove();
					seperator = null;
				}

				seperator = document.createElement("span");
				seperator.innerHTML = " | ";
				seperator.className = "hn_bl_seperator";

				var actor = document.createElement('a');
				actor.href = "#";

				item.querySelector(".comhead").appendChild(seperator);
				seperator.appendChild(actor);

				var blockedMessage = item.querySelector(".blocked");

				if (blockedMessage !== null) {
					blockedMessage.remove();
				}

				if (users.includes(username)) {
					contents.style.display = "none";

					actor.innerHTML = "unblock";
					actor.onclick = function() {
						unbanUser(username);
						return false;
					};

					var banned = document.createElement('span');
					banned.innerHTML = "[blocked]";
					banned.className = "blocked";

					item.querySelector(".comment").appendChild(banned);
				} else {
					contents.style.display = "block";

					actor.innerHTML = "block";
					actor.onclick = function() {
						banUser(username);
						return false;
					};
				}
			}

			var comments = document.querySelectorAll(".default");

			for (var i = 0; i < comments.length; ++i) {
				handleItem(comments[i]);
			}
		});
	}

	init();
})();
