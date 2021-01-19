const Clarifai = require('clarifai');
const api = require('../api/api');

const apiKey = api.api();

const app = new Clarifai.App({
	apiKey: apiKey,
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.CELEBRITY_MODEL, req.body.input)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => res.status(400).json('unable to work with api'));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall,
};
