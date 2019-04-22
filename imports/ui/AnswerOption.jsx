import React from "react";
import PropTypes from "prop-types";

class AnswerOption extends React.Component {
	render() {
		return (
			<li className="answerOption">
				<label className="radioCustomLabel">
					{this.props.answerContent}
					<input
						type="radio"
						className="radioCustomButton"
						name="radioGroup"
						value={this.props.answerType}
						disabled={!!this.props.answer}
						onChange={this.props.onAnswerSelected}
					/>
					<span className="checkmark"></span>
				</label>
			</li>
		);
	}
}

AnswerOption.propTypes = {
	answerType: PropTypes.bool.isRequired,
	answerContent: PropTypes.string.isRequired,
	answer: PropTypes.string,
	onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;
