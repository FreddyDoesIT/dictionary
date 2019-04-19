import React from "react";
import PropTypes from "prop-types";
import WordItem from "./WordItem";
import { Grid, Container } from "semantic-ui-react";

export default class WordList extends React.Component {
	renderWordsList() {
		return this.props.words.map((word, index) => (
			<Grid.Column width={10} key={index}>
				<WordItem searchWord={this.props.searchWord} word={word} />
			</Grid.Column>
		));
	}

	render() {
		return (
			<Container>
				<Grid centered>{this.renderWordsList()}</Grid>
			</Container>
		);
	}
}

WordList.propTypes = {
	searchWord: PropTypes.string.isRequired,
	words: PropTypes.arrayOf(PropTypes.object).isRequired
};
