import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { allSearchedWords } from "./allSearchedWords.js";

export const Questions = new Mongo.Collection("Questions");

if (Meteor.isServer) {
	Meteor.publish("Questions", function publishQuestions() {
		return Questions.find();
	});
}

let dataSet = allSearchedWords.find({}).fetch();
let wordsSet = new Set();
dataSet.forEach(e => wordsSet.add(e.word));

function shuffleArray(array) {
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

Meteor.methods({
	"Questions.insert"(word, content) {
		check(word, String);
		check(content, Object);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		wordsSet.delete(word);
		let uniquewords = Array.from(wordsSet);

		// to get two different index
		let optionIndex1 = Math.floor(Math.random() * (uniquewords.length - 1));
		let optionIndex2 = optionIndex1 + 1;

		let option1 = uniquewords[optionIndex1];
		let option2 = uniquewords[optionIndex2];

		let question = content.definition;
		let options = [];
		options.push(
			{
				type: true,
				content: word
			},
			{
				type: false,
				content: option1
			},
			{
				type: false,
				content: option2
			}
		);

		let wordDoc = Questions.findOne({
			question: question
		});

		if (wordDoc === undefined) {
			Questions.insert({
				question: question,
				options: shuffleArray(options)
			});
		}
	}
});
