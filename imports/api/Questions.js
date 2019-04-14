import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { allSearchedWords } from "./allSearchedWords.js";

/* CodeReview <Yan>: First of all, great work and beautiful user interface of your project.*/
// It has many features and I believe it can help students when they are struggle with remember learning english words.

// There are small suggestions that you might want to consider. 
// Maybe you can put the "my lists" and "chanllege" button out of the drop-down menu cause I don't know what to do after I save the word to my lists.

// Hope this can help. Good luck!


export const Questions = new Mongo.Collection("Questions");

if (Meteor.isServer) {
	Meteor.publish("Questions", function publishQuestions() {
		return Questions.find();
	});
}

let dataSet = allSearchedWords.find({}).fetch();
let wordsSet = new Set();
dataSet.forEach(e => wordsSet.add(e.word));

Meteor.methods({
	"Questions.insert"(word, content) {
		check(word, String);
		check(content, Object);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		wordsSet.delete(word);
		let uniquewords = Array.from(wordsSet);


		let option1 =
			uniquewords[Math.floor(Math.random() * uniquewords.length + 1) - 1];
		let option2 =
			uniquewords[Math.floor(Math.random() * uniquewords.length + 1) - 1];

		let question = content.definition;
		let options = [];
		options.push({
			type: true,
			content: word
		}, {
			type: false,
			content: option1
		}, {
			type: false,
			content: option2
		});


		let wordDoc = Questions.findOne({
			question: question
		});

		if (wordDoc === undefined) {
			Questions.insert({
				question: question,
				options: options
			});
		}
	}
});
