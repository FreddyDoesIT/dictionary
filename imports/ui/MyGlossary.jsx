import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { DefaultList } from "../api/lists";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import {
	Container,
	Grid,
	Button,
	Header,
	Icon,
	Modal
} from "semantic-ui-react";
import "../api/lists";
import NavigationBar from "./NavigationBar.jsx";
import { Link } from "react-router-dom";

class MyGlossary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			modalOpen: false
		};
	}

	// remove word from list
	handleClick(event) {
		Meteor.call("defaultList.remove", event.target.id, err => {
			if (err) {
				this.setState({
					error: err.reason
				});

				console.log("Error from meteor.call" + err);
				return;
			}

			console.log("Word removed");

			this.setState({
				error: ""
			});
		});
	}

	// to detect if the user can join a multiplayer challenge game
	handleChallengeClick() {
		this.props.history.push("/challenge");
	}

	// render all words in the default list
	renderWords() {
		return this.props.myWords.map(word => (
			<Grid.Row key={word._id}>
				<Grid.Column width={3} className="glossaryCol" stretched>
					{word.word}
					<p className="savedTimes">Saved: {word.searchTimes}</p>
				</Grid.Column>
				<Grid.Column width={8}>
					<p>
						<span>Defination</span>: {word.content.definition}
					</p>
					<br />
					<p>
						{word.content.example
							? "Example: " + word.content.example
							: undefined}
					</p>
				</Grid.Column>

				<Grid.Column width={2}>
					<Button
						size="mini"
						color="yellow"
						id={word._id}
						onClick={this.handleClick.bind(this)}
					>
						Remove
					</Button>
				</Grid.Column>
			</Grid.Row>
		));
	}

	render() {
		return (
			<Container textAlign="center">
				<header>
					<NavigationBar />
				</header>
				<br />
				<main>
					<Grid centered columns="two" divided className="glossary">
						{this.renderWords()}
					</Grid>
					<br />
					{this.props.myWords.length === 0 ? (
						<div>
							<p>You have not added words to your list.</p>
							<br />
							<br />
							<br />
							<Link to="/">
								<Button>Back to main</Button>
							</Link>
						</div>
					) : (
						<Button.Group>
							<Button
								positive
								onClick={() => this.handleChallengeClick()}
							>
								Challenge Game
							</Button>

							<Button.Or />
							<Link to="/">
								<Button>Back to main</Button>
							</Link>
						</Button.Group>
					)}
				</main>
			</Container>
		);
	}
}

MyGlossary.propTypes = {
	myWords: PropTypes.arrayOf(PropTypes.object).isRequired,
	history: PropTypes.object.isRequired
};

export default withTracker(() => {
	const handle = Meteor.subscribe("defaultList");

	return {
		user: !!Meteor.user(),
		myWords: DefaultList.find(
			{
				userId: Meteor.userId()
			},
			{
				sort: {
					searchTimes: -1
				}
			}
		).fetch(),
		ready: handle.ready()
	};
})(MyGlossary);
