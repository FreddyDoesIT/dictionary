import React from "react";
import PropTypes from "prop-types";
import QuestionCount from "./QuestionCount";
import AnswerOption from "./AnswerOption";

class Quiz extends React.Component {
	renderQuestion() {
		return <h2 className="question">{this.props.question}</h2>;
	}

	renderAnswerOptions() {
		return this.props.answerOptions.map(key => (
			<AnswerOption
				key={key.content}
				answerContent={key.content}
				answerType={key.type}
				answer={this.props.answer}
				questionId={this.props.questionId}
				onAnswerSelected={this.props.onAnswerSelected}
			/>
		));
	}

	render() {
		return (
			<div className="exam" key={this.props.questionId}>
				<QuestionCount
					counter={this.props.questionId}
					total={this.props.questionTotal}
				/>
				<br/>
				{this.renderQuestion()}

				<ul className="answerOptions">{this.renderAnswerOptions()}</ul>
			</div>
		);
	}
}

Quiz.propTypes = {
	questionId: PropTypes.number.isRequired,
	answer: PropTypes.string,
	answerOptions: PropTypes.array.isRequired,
	question: PropTypes.string.isRequired,

	questionTotal: PropTypes.number.isRequired,
	onAnswerSelected: PropTypes.func.isRequired
};

export default Quiz;
