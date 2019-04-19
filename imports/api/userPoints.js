import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

if (Meteor.isServer) {
	Meteor.publish("userData", function publishUserdata() {
		return Meteor.users.find(
			{},
			{
				fields: {
					username: 1,
					"profile.points": 1
				}
			}
		);
	});
}

Meteor.methods({
	"user.pointsUpdate"(id, points) {
		check(id, String);
		check(points, Number);

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(id, { $inc: { "profile.points": points } });
	}
});
