var express = require('express');
var app = express()

var messages = [
{
	id: 1,
	name: 'Manu Arora',
	content: 'Go for lunch tomorrow',
	read: false
},
{
	id: 2,
	name: 'Yash Saluja',
	content: 'Trying to study something',
	read: false
},
{
	id: 3,
	name: 'Lakshit Kumar Singh',
	content: 'Placement lag gayi bro!',
	read: true
}	
];

app.get('/', function(req, res) {
	res.send('Hello world!, Paaji here')
});

app.get('/messages', function(req, res) {
	res.json(messages);
});

// localhost:3000/messages/2
app.get('/messages/:id', function(req, res) {
	// res.send(req.params.id);
	var id = parseInt(req.params.id, 10);
	var flag = false;

	// Looping through messages
	for(var i = 0; i < messages.length; i++) {
		if(messages[i].id === id) {
			res.json(messages[i]);
			flag = true;
			break;
		}
	}

	if (!flag) {
		res.send('Cannot find any messages with this ID');
	}
})


app.listen(3000, function() {
	console.log("Server is running...")
});