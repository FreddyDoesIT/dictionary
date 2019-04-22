import { Meteor } from "meteor/meteor";
import { Games } from "./games.js";
import { Questions } from "../api/Questions.js";

class GameLogic {
	getRandomArrayElements(arr, num) {
		var temp_array = new Array();
		for (var index in arr) {
			temp_array.push(arr[index]);
		}
		var return_array = new Array();
		for (var i = 0; i < num; i++) {
			if (temp_array.length > 0) {
				var arrIndex = Math.floor(Math.random() * temp_array.length);
				return_array[i] = temp_array[arrIndex];
				temp_array.splice(arrIndex, 1);
			} else {
				break;
			}
		}
		return return_array;
	}

	// start a new game
	newGame() {
		const game = Games.findOne({
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});

		let questions = Questions.find({}).fetch();

		let randomQuestions = this.getRandomArrayElements(questions, 10);

		if (game === undefined) {
			Games.insert({
				player1: Meteor.userId(),
				player2: "",
				gameStatus: "waiting",
				questionId: 1,
				counter: 0,
				gameWinner: "",
				p1_profile: {
					userId: Meteor.userId(),
					answer: "",
					points: 0
				},
				p2_profile: {
					userId: "",
					answer: "",
					points: 0
				},
				clicked: 0,
				quiz: randomQuestions
			});
		}
	}

	// join a existing game
	joinGame(game) {
		if (game.player2 === "" && Meteor.userId() !== undefined) {
			Games.update(
				{ _id: game._id },
				{
					$set: {
						player2: Meteor.userId(),
						gameStatus: "playing",
						p2_profile: {
							userId: Meteor.userId(),
							points: 0
						}
					}
				}
			);
		}
	}

	// set game result
	setGameResult(gameId, result) {
		Games.update(
			{ _id: gameId },
			{
				$set: {
					gameStatus: "gameover",
					gameWinner: result
				}
			}
		);
	}

	// remove a specified game form Games
	removeGame(gameId) {
		Games.remove({ _id: gameId });
	}

	removePlayer(gameId, player) {
		Games.update({ _id: gameId }, { $set: { [player]: "" } });
	}
}

export const gameLogic = new GameLogic();
