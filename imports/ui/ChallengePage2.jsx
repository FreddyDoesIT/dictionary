import React from "react";
import PropTypes from "prop-types";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";

import NavigationBar from "./NavigationBar.jsx";
import ChallengeQuiz from "./ChallengeQuiz.jsx";

import { Games } from "../lib/games.js";
import { DefaultList } from "../api/lists";

import { Container, Button } from "semantic-ui-react";

class ChallengePage2 extends React.Component {
	handleClick() {
		Session.set("inGame", true);
		Meteor.call("game.play");
		Meteor.subscribe("MyGame");
	}

	render() {
		return (
			<Container>
				<NavigationBar />
				<div className="gameStatus">
					<Button positive onClick={this.handleClick.bind(this)}>
						Play!
					</Button>
					<br />
					<p>
						<span>Game Status</span> :{" "}
						<span>{this.props.status}</span>
					</p>
				</div>

				<hr />

				{this.props.status == "Game playing..." ? (
					<ChallengeQuiz game={this.props.game} />
				) : (
					<div />
				)}
			</Container>
		);
	}
}

ChallengePage2.propTypes = {
	status: PropTypes.string,
	gameStarted: PropTypes.bool,
	myWords: PropTypes.arrayOf(PropTypes.object).isRequired,
	history: PropTypes.object.isRequired,
	game: PropTypes.object
};

function gameStarted() {
	if (Session.get("inGame")) {
		let myGame = Games.findOne({
			gameStatus: "playing",
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});

		if (myGame !== undefined) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function setStatus() {
	if (Session.get("inGame")) {
		let newGame = Games.findOne({
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});

		if (newGame !== undefined) {
			if (newGame.gameStatus === "waiting") {
				return "Waiting for an opponent...";
			} else if (newGame.gameStatus === "playing") {
				return "Game playing...";
			} else if (newGame.gameStatus === "gameover") {
				if (newGame.gameWinner === Meteor.userId()) {
					return "You win!";
					// return points!
				} else if (newGame.gameWinner !== Meteor.userId()) {
					return "You lost!";
					//return points1
				} else if (newGame.gameWinner === "tie") {
					return "Tie";
				}
			}
		} else {
			return "Click play to start!";
		}
	} else {
		return "Click play to start!";
	}
}

function getGameId() {
	let game = Games.findOne({
		$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
	});

	console.log(game);

	return game;
}

export default withTracker(() => {
	Meteor.subscribe("Games").ready();
	Meteor.subscribe("defaultList");

	return {
		game: getGameId(),
		status: setStatus(),
		gameStarted: gameStarted(),
		myWords: DefaultList.find({
			userId: Meteor.userId()
		}).fetch()
	};
})(ChallengePage2);
