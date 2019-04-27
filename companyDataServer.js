const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const User = require('./usersArgon');
const cryptoJS = require('crypto-js');

const fs = require('fs');

app.set('port', process.env.PORT || 9040);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/crunchdata', (req, res) => {

	fs.readFile('./crunchbaseMockData.json', (err, data) => {
		if (err) {
			reject(Error(err));
		} else {     
			data = ' ' + data;             
			console.log(data);
			res.json(data);
		}
	}); 

	
  
});

app.listen(app.get('port'), () => {
    console.log('CompanyData Server listening on: http://localhost:%s', app.get('port'));
});

module.exports = app;