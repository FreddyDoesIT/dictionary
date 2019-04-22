import React from "react";
import PropTypes from "prop-types";

class AnswerOption extends React.Component {
	render() {
		return (
			<li className="answerOption">
				<input
					type="radio"
					className="radioCustomButton"
					name="radioGroup"
					checked={this.props.answerType === this.props.answer}
					id={this.props.answerType}
					value={this.props.answerType}
					disabled={this.props.answer}
					onChange={this.props.onAnswerSelected}
				/>
				<label
					className="radioCustomLabel"
					htmlFor={this.props.answerType}
				>
					{this.props.answerContent}
				</label>
			</li>
		);
	}
}

AnswerOption.propTypes = {
	answerType: PropTypes.string.isRequired,
	answerContent: PropTypes.string.isRequired,
	answer: PropTypes.string,
	onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;
