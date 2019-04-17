import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { gameLogic } from "./gameLogic.js";

export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
	Meteor.publish("Games", function gamesPublication() {
		return Games.find();
	});

	Meteor.publish("MyGame", function myGamesPublication() {
		return Games.find({
			$or: [{ player1: this.userId }, { player2: this.userId }]
		});
	});
}

Meteor.methods({
	"game.play"() {
		// remove all ended game with this user
		let endGame = Games.findOne({
			gameStatus: "gameover",
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});
		if (endGame !== undefined) {
			gameLogic.removeGame(endGame._id);
		}

		// find a waiting game
		// If there is no waiting game, start a new game, otherwise join this game
		const game = Games.findOne({ gameStatus: "waiting" });

		if (game === undefined) {
			gameLogic.newGame();
		} else if (
			game !== undefined &&
			game.player1 !== this.userId &&
			game.player2 === ""
		) {
			gameLogic.joinGame(game);
		}
	},

	// update game status --- game over
	// update gameWinner

	"game.update"(userId) {
		// remove all ended game with this user
		let game = Games.findOne({
			gameStatus: "playing",
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});

		if (game !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$set: { gameStatus: "gameover", gameWinner: userId }
				}
			);
		}
	}
});
