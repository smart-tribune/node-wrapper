'use strict'

const request = require('request');
const async = require('async');
const querystring = require('querystring');

exports.connectSmartTribune = function connectSmartTribune(config, context, next) {
	
	if (typeof config.CONSUMER_KEY === 'undefined' || config.CONSUMER_KEY == '') {
		throw new Error('CONSUMER_KEY is not properly defined.');
	}

	if (typeof config.CONSUMER_SECRET === 'undefined' || config.CONSUMER_SECRET == '') {
		throw new Error('CONSUMER_SECRET is not properly defined.');
	}

	const API_URL = config.API_URL;
	const CONSUMER_KEY = config.CONSUMER_KEY;
	const CONSUMER_SECRET = config.CONSUMER_SECRET;
	const CALLBACK_URL = config.CALLBACK_URL;


	var oauth = {
		callback: CALLBACK_URL,
		consumer_key: CONSUMER_KEY,
		consumer_secret: CONSUMER_SECRET
	};

	var url,
		request_token,
		headers,
		auth_data;

	if (context.oauth != undefined) {
		next(null, oauth);
	} else {
		async.series([
			function (callback) {
				url = API_URL + '/index/request_token';
				request.post({ url: url, oauth: oauth }, function (error, response, body) {
					auth_data = querystring.parse(body);
					headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36' };
					url = auth_data.authentification_url;
					request_token = {
						oauth_token: auth_data.oauth_token,
						oauth_secret: auth_data.oauth_token_secret
					};
					callback();
				});
			},
			function (callback) {
				request.post({ url: url, formData: request_token, followRedirect: false, headers: headers }, function (error, response, body) {
					var header_data = querystring.parse(response.headers.location);
					oauth = {
						consumer_key: CONSUMER_KEY,
						consumer_secret: CONSUMER_SECRET,
						token: header_data.oauth_token,
						token_secret: auth_data.oauth_token_secret,
						verifier: header_data.oauth_verifier
					};
					url = API_URL + '/index/access_token';
					callback();
				});
			},
			function (callback) {
				request.post({ url: url, oauth: oauth }, function (error, response, body) {
					var perm_data = querystring.parse(body);
					oauth = {
						consumer_key: CONSUMER_KEY,
						consumer_secret: CONSUMER_SECRET,
						token: perm_data.oauth_token,
						token_secret: perm_data.oauth_token_secret
					};
					callback();
				});
			}
		], function (err) {
			if (err) return next(err);
			context.oauth = oauth;
			next(null, oauth);
		});
	}

};
