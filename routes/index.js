var mongoose = require('mongoose');
//var db = mongoose.createConnection('localhost', 'pollsapp');

//cnnecting to mongolab database
var db = mongoose.connect('mongodb://momota:nilufar1356@ds049641.mongolab.com:49641/polling');
var pollsSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', pollsSchema);


exports.index = function (req, res) {
    res.render('index', { title: 'Polls' });
}

//json API for list of polls
exports.list = function (req, res) {
    Poll.find({}, 'question', function (err, polls) {
        res.json(polls);
    });
}

//json API for getting single poll
exports.poll = function (req, res) {
    var pollId = req.params.id;
    console.log(pollId);
    Poll.findById(pollId, '', { lean: true },
        function (err, poll) {
            if (poll) {
                var userVoted = false,
                    userChoice,
                    totalVotes = 0;
                for (c in poll.choices) {
                    var choice = poll.choices[c];
                    for (v in choice.votes) {
                        var vote = choice.votes[v];
                        totalVotes++;
                        if (vote.ip === (req.header('x-forwarded-for') || req.ip)) {
                            userVoted = true; userChoice = { _id: choice._id, text: choice.text }
                        }
                    }
                }
                poll.userVoted = userVoted;
                poll.userChoice = userChoice;
                poll.totalVotes = totalVotes;
                //console.log(poll);
                res.json(poll);
            } else {
                res.json({ error: true });
            }
    });
}

//josn API for create a new poll
exports.create = function (req, res) {
    var reqBody = req.body,
        choices = reqBody.choices.filter(function (v) { return v.text != ''; }),
        pollObj = { question: reqBody.question, choices: choices };
    var poll = new Poll(pollObj);
    poll.save(function (err, doc) {
        if (err || !doc) throw 'Error';
        res.json(doc);
            
    });

}

//Socket API for saving a vote
exports.vote = function (socket) {
    socket.on('send:vote', function (data) {
        var ip = socket.handshake.headers['x-forwarded-for'] ||
            socket.handshake.address.address;
        Poll.findById(data.poll_id, function (err, poll) {
            var choice = poll.choices.id(data.choice);
            choice.votes.push({ ip: ip });
            poll.save(function (err, doc) {
                var theDoc = {
                    question: doc.question, _id: doc._id,
                    choices: doc.choices, userVoted: false, totalVotes: 0
                };
                for (var i = 0; i < doc.choices.length; i++) {
                    var choice = doc.choices[i];
                    for (var j = 0; j < choice.votes.length; j++) {
                        var vote = choice.votes[j];
                        theDoc.totalVotes++;
                        theDoc.ip = ip;
                        if (vote.ip === ip) {
                            theDoc.userVoted = true;
                            theDoc.userChoice = { _id: choice._id, text: choice.text }
                        } 
                    }
                }
                socket.emit('myvote', theDoc);
                socket.broadcast.emit('vote', theDoc);
            });
        });
    });
}