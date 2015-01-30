// var db = require("./models");

var yelp = require("yelp").createClient({
	consumer_key: "wDLVVvgkswY90UiN6-jwYQ",
	consumer_secret: "KR_-iy69uIOKM5knKrfTW4C4ONc",
	token: "08ippIshdtc9BrgS4FhVKQb0Hvrsk412",
	token_secret: "oXiLP7PLx5rCMKu488BymGk9DU8"
});

var repl = require("repl");

var newREPL = repl.start("jazz bar > ");
newREPL.context.yelp = yelp;