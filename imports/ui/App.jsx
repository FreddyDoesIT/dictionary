import React from "react";
import SearchBox from "./Search.jsx";

export default class App extends React.Component {
	render() {
		return (
			<div>
				<h1>Welcome to Meteor!</h1>
				<SearchBox />
			</div>
		);
	}
}
