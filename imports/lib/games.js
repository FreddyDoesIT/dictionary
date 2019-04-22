import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { gameLogic } from "./gameLogic.js";
import { check } from "meteor/check";

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

	"questionId.update"(gameId) {
		check(gameId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$inc: { questionId: 1, counter: 1 }
				}
			);
		}
	},

	"clicked.update"(gameId) {
		check(gameId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$inc: { clicked: 1 }
				}
			);
		}
	},

	"clicked.reset"(gameId) {
		check(gameId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$set: { clicked: 0 }
				}
			);
		}
	},

	"points.update"(gameId, userId) {
		check(gameId, String);
		check(userId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			if (userId == game.p1_profile.userId) {
				Games.update(
					{
						_id: game._id
					},
					{
						$inc: { "p1_profile.points": 10 }
					}
				);
			} else if (userId == game.p2_profile.userId) {
				Games.update(
					{
						_id: game._id
					},
					{
						$inc: { "p2_profile.points": 10 }
					}
				);
			}
		}
	},

	"answer.select"(gameId, userId, answer) {
		check(gameId, String);
		check(userId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			if (userId == game.p1_profile.userId) {
				Games.update(
					{
						_id: game._id
					},
					{
						$set: { "p1_profile.answer": answer }
					}
				);
			} else if (userId == game.p2_profile.userId) {
				Games.update(
					{
						_id: game._id
					},
					{
						$set: { "p2_profile.answer": answer }
					}
				);
			}
		}
	},

	"game.updateWinner"(gameId) {
		check(gameId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			if (game.p1_profile.points > game.p2_profile.points) {
				Games.update(
					{
						_id: game._id
					},
					{
						$set: {
							gameWinner: game.p1_profile.userId
						}
					}
				);
			} else if (game.p1_profile.points < game.p2_profile.points) {
				Games.update(
					{
						_id: game._id
					},
					{
						$set: {
							gameWinner: game.p2_profile.userId
						}
					}
				);
			} else {
				Games.update(
					{
						_id: game._id
					},
					{
						$set: {
							gameWinner: "tie"
						}
					}
				);
			}
		}
	},

	"answer.reset"(gameId) {
		check(gameId, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne({
			_id: gameId
		});

		if (game !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$set: { "p1_profile.answer": "", "p2_profile.answer": "" }
				}
			);
		}
	},

	// update game status --- game over
	// update gameWinner
	"game.update"(userId) {
		check(userId, String);
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
					$set: { gameStatus: "gameover" }
				}
			);
		}
	}
});
