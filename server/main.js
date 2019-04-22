import "../imports/startup/simpl-schema-config.js";
import "../imports/api/users.js";
import "../imports/api/lists.js";
import "../imports/api/allSearchedWords.js";
import "../imports/api/wordsAPI.js";
import "../imports/api/Questions.js";
import "../imports/api/userPoints.js";

import { UserStatus } from "meteor/mizzao:user-status";

import { Games } from "../imports/lib/games.js";
import { gameLogic } from "../imports/lib/gameLogic.js";

import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { WebApp } from "meteor/webapp";


WebApp.addHtmlAttributeHook(() => ({ lang: "en" }));

// Get list of all method names on Lists
const LISTS_METHODS = [
	"user.pointsUpdate",
	"Questions.insert",
	"allSearchedWords.insert",
	"defaultList.insert",
	"defaultList.remove",
	"getData",
	"game.play",
	"questionId.update",
	"clicked.update",
	"clicked.reset",
	"points.update",
	"answer.select",
	"game.updateWinner",
	"answer.reset",
	"game.update"
];

// Only allow 5 list operations per connection per second
if (Meteor.isServer) {
	DDPRateLimiter.addRule(
		{
			name(name) {
				return LISTS_METHODS.includes(name);
			},

			// Rate limit per connection ID
			connectionId() {
				return true;
			}
		},
		5,
		1000
	);
}

// start the game
UserStatus.events.on("connectionLogout", fields => {
	const game = Games.findOne({
		$or: [{ player1: fields.userId }, { player2: fields.userId }]
	});

	if (game != undefined) {
		if (game.gameStatus !== "waiting" && game.gameStatus !== "gameover") {
			if (game.player1 === fields.userId) {
				gameLogic.setGameResult(game._id, game.player2);
				gameLogic.removePlayer(game._id, "player1");
			} else if (game.player2 === fields.userId) {
				gameLogic.setGameResult(game._id, game.player1);
				gameLogic.removePlayer(game._id, "player2");
			}
		} else {
			if (game.player1 === "" || game.player2 === "") {
				gameLogic.removeGame(game._id);
			} else {
				if (game.player1 === fields.userId)
					gameLogic.removePlayer(game._id, "player1");
				else if (game.player2 === fields.userId)
					gameLogic.removePlayer(game._id, "player2");
			}
		}
	}
});
