import React from "react";
import { Meteor } from "meteor/meteor";
import { Container, Image } from "semantic-ui-react";

import NavigationBar from "./NavigationBar.jsx";
import SearchBar from "./SearchBar.jsx";

import TypingAnimation from "./TypingAnimation.jsx";
import WordsList from "./WordsList";

import "../api/wordsAPI";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchWord: "",
			words: [],
			error: ""
		};
	}

	// call api to get data
	onSearchSubmit(word) {
		if (word.length === 0) {
			this.setState({
				error: "A valid word required"
			});
			return;
		}

		Meteor.call("getData", word, (err, res) => {
			if (err) {
				this.setState({
					searchWord: "",
					words: [],
					error: "Word not found"
				});
				return;
			}

			this.setState({
				searchWord: res.word,
				words: res.results,
				error: ""
			});
		});
	}

	render() {
		let date = new Date();
		let imgSrc = "/" + date.getDay() + ".png";
		return (
			<Container textAlign="center">
				<header>
					<NavigationBar className="header" />
				</header>
				<main>
					<Image
						centered
						src={imgSrc}
						size="big"
						alt="Wordict Logo"
					/>
					<TypingAnimation /> <br />
					<SearchBar onSubmit={this.onSearchSubmit.bind(this)} />
					{this.state.error ? this.state.error : undefined}
					<WordsList
						searchWord={this.state.searchWord}
						words={this.state.words}
					/>
				</main>
			</Container>
		);
	}
}
