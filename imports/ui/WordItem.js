import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Button, Message, Popup, Card } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { DefaultList } from "../api/lists";

class WordItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			justSaved: false
		};
	}

	// add word to list / searchedWord / Questions
	handleAddClick() {
		if (this.props.user) {
			this.setState({ justSaved: true });
			setTimeout(() => this.setState({ justSaved: false }), 1000);

			let word = this.props.searchWord;
			let content = {
				definition: this.props.word.definition,
				example: this.props.word.examples
					? this.props.word.examples[0]
					: undefined
			};

			Meteor.call("defaultList.insert", word, content, err => {
				if (err) {
					this.setState({
						error: err.reason
					});

					console.log("Error from meteor.call" + err);
					return;
				}

				this.setState({
					error: ""
				});
			});

			Meteor.call("allSearchedWords.insert", word, content, err => {
				if (err) {
					this.setState({
						error: err.reason
					});

					console.log("Error from meteor.call" + err);
					return;
				}

				this.setState({
					error: ""
				});
			});

			Meteor.call("Questions.insert", word, content, err => {
				if (err) {
					this.setState({
						error: err.reason
					});

					console.log("Error from meteor.call" + err);
					return;
				}

				this.setState({
					error: ""
				});
			});
		} else {
			this.setState({ error: "You need to log in first." });
		}
	}

	render() {
		const segmentContent = (
			<Card className="hvr-grow-shadow mainPageCard" centered fluid>
				<Card.Content>
					Definition: {this.props.word.definition}
					<br />
					<br />
					{this.props.word.examples ? (
						<Card.Description>
							Example: {this.props.word.examples[0]}
						</Card.Description>
					) : (
						undefined
					)}
				</Card.Content>
				<Card.Content extra textAlign="center">
					{this.props.user ? (
						this.state.justSaved ? (
							<Button basic color="red">
								Saved
							</Button>
						) : (
							<Button
								color="blue"
								onClick={this.handleAddClick.bind(this)}
							>
								Save it to my list
							</Button>
						)
					) : (
						undefined
					)}

					{this.state.error && !this.props.user ? (
						<Message negative>
							<p>{this.state.error}</p>
						</Message>
					) : (
						undefined
					)}
				</Card.Content>
			</Card>
		);

		const style = {
			borderRadius: 25,
			opacity: 0.7,
			background: "#5AEB28"
		};

		return (
			<div>
				{this.props.user ? (
					<Popup disabled trigger={segmentContent}>
						<Popup.Header>
							Log in to save it to your list
						</Popup.Header>
					</Popup>
				) : (
					<Popup
						trigger={segmentContent}
						style={style}
						position="top right"
					>
						<Popup.Header>
							Log in to save it to your list
						</Popup.Header>
					</Popup>
				)}
			</div>
		);
	}
}

WordItem.propTypes = {
	searchWord: PropTypes.string.isRequired,
	word: PropTypes.object.isRequired,
	user: PropTypes.bool.isRequired,
	myWords: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
	const handle = Meteor.subscribe("defaultList");

	return {
		user: !!Meteor.user(),
		myWords: DefaultList.find({
			userId: Meteor.userId()
		}).fetch(),
		ready: handle.ready()
	};
})(WordItem);
