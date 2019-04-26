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
					<p>
						<span> Points</span> : <span>{this.props.points}</span>
						<span> Opponent</span> :{" "}
						<span>{this.props.opponent}</span>
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
	game: PropTypes.object,
	points: PropTypes.number,
	opponent: PropTypes.string
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
		let game = Games.findOne({
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		});

		if (game !== undefined) {
			if (game.gameStatus === "waiting") {
				return "Waiting for an opponent...";
			} else if (game.gameStatus === "playing") {
				return "Game playing...";
			} else if (game.gameStatus === "gameover") {
				if (game.gameWinner === "tie") {
					return "Tie";
				} else if (game.gameWinner === Meteor.userId()) {
					return "You win!";
				} else if (game.gameWinner !== Meteor.userId()) {
					return "You lost!";
				}
			}
		} else {
			return "Click play to start!";
		}
	} else {
		return "Click play to start!";
	}
}

function pointsTracker(game) {
	if (game !== undefined) {
		if (Meteor.userId() == game.p1_profile.userId) {
			return game.p1_profile.points;
		} else if (Meteor.userId() == game.p2_profile.userId) {
			return game.p2_profile.points;
		}
	}
}

function getOpponentName() {
	if (Session.get("inGame")) {
		let myGame = Games.findOne({ gameStatus: "playing" });

		console.log(myGame);

		if (myGame !== undefined) {
			if (myGame.gameStatus === "waiting") {
				return "";
			} else {
				console.log("game playing ");

				let res = "";

				console.log("player1 is : ");
				console.log(myGame.player1);
				console.log("player2 is : ");
				console.log(myGame.player2);

				if (myGame.player1 === Meteor.userId()) {
					res = Meteor.users.findOne({ _id: myGame.player2 })
						.username;
					console.log("myGame.player1 === Meteor.userId()");
					console.log(res);
				} else {
					res = Meteor.users.findOne({ _id: myGame.player1 })
						.username;

					console.log("myGame.player2 === Meteor.userId()");
					console.log(res);
				}

				console.log("res is : ");
				console.log(res);
				return res;
			}
		}
	} else {
		return " ";
	}
}

export default withTracker(() => {
	Meteor.subscribe("Games").ready();
	Meteor.subscribe("defaultList");
	Meteor.subscribe("userData").ready();

	let game = Games.findOne({
		$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
	});

	return {
		game: game,
		status: setStatus(),
		gameStarted: gameStarted(),
		myWords: DefaultList.find({
			userId: Meteor.userId()
		}).fetch(),
		points: pointsTracker(game),
		opponent: getOpponentName()
	};
})(ChallengePage2);
