import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import Quiz from "./Quiz.jsx";
import { Container, Message, Grid } from "semantic-ui-react";

export default class ChallengeQuiz extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: 0,
			questionId: 1,
			question: "",
			answerOptions: [],
			answer: "",
			points: 0,
			questionTotal: 10,
			result: ""
		};

		console.log(props.game);
		this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
	}

	componentDidMount() {
		// const shuffledAnswerOptions = this.props.game.quiz.map(question =>
		// 	this.shuffleArray(question.options)
		// );
		this.setState({
			question: this.props.game.quiz[0].question, // the first question
			answerOptions: this.props.game.quiz[0].options // the first group of options
		});
	}

	shuffleArray(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	handleAnswerSelected(event) {
		this.setUserAnswer(event.currentTarget.value);

		if (this.state.questionId < this.state.questionTotal) {
			setTimeout(() => this.setNextQuestion(), 300);
		} else {
			setTimeout(() => this.setResults(), 300);
			// set game status and winner
			Meteor.call("game.update", Meteor.userId());
			Meteor.call(
				"user.pointsUpdate",
				Meteor.userId(),
				this.state.points
			);
		}
	}

	setResults() {
		this.setState({
			result: "You got " + this.state.points + " points!"
		});
	}

	setNextQuestion() {
		const counter = this.state.counter + 1;
		const questionId = this.state.questionId + 1;

		this.setState({
			counter: counter,
			questionId: questionId,
			question: this.props.game.quiz[counter].question,
			answerOptions: this.props.game.quiz[counter].options,
			answer: ""
		});
	}

	setUserAnswer(answer) {
		if (answer === "true") {
			this.setState({
				points: this.state.points + 10
			});
		}

		this.setState({
			answer: answer
		});
	}

	renderQuiz() {
		return (
			<Quiz
				question={this.state.question}
				questionId={this.state.questionId}
				answerOptions={this.state.answerOptions}
				answer={this.state.answer}
				questionTotal={this.state.questionTotal}
				onAnswerSelected={this.handleAnswerSelected}
			/>
		);
	}

	render() {
		return (
			<Container>
				<Grid centered columns="equal">
					<Grid.Column width={8}>
						{this.state.result ? (
							<Message
								icon="bullhorn"
								header={this.state.result}
							/>
						) : (
							undefined
						)}
					</Grid.Column>
				</Grid>

				{this.renderQuiz()}
				{this.state.points}
			</Container>
		);
	}
}

ChallengeQuiz.propTypes = {
	game: PropTypes.object.isRequired
};


