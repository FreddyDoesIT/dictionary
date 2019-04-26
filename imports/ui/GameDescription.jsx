import React from "react";
import { Message } from "semantic-ui-react";

export default class GameDescription extends React.Component {
	render() {
		return (
			<Message>
				<Message.Header>How to Chanllenge Yourself</Message.Header>
				<Message.List>
					<Message.Item>
						Click Go to Challenge button to challenge yourself. 
						If Your list has less than 10 words, you need to add more to your list to join the challenge game.
					</Message.Item>
					<Message.Item>
						Once you are on the Challenge Game page, click Play to start a new game or join an existing game. You will be randomly assigned an opponent.
					</Message.Item>
					<Message.Item>
						You will be given 10 questions selected from all searching records.
					</Message.Item>
					<Message.Item>
						Once you select an answer, you cannot change to other answers. 
						After selecting, if the background color turns to red, then you are wrong.
						If it is green, then you are right.
					</Message.Item>
					<Message.Item>
						Every question needs to be answered to continue. 
						Once you answer it, you will be given the next question. 
					</Message.Item>

					<Message.Item>
						Every word is worth 10 points. You can check the scoreboard on the right side.
					</Message.Item>
					<Message.Item>
						Once ten questions are finished, there will be a message shows {"You win"} or {"You lost"} or {"Tie"} according to your points.
					</Message.Item>

					<Message.Item>
						If anyone is logged out during the game, then the opponent will be the winner!
					</Message.Item>
				</Message.List>
			</Message>
		);
	}
}
