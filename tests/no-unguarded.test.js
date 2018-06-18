'use strict';

const rule = require('../eslint-rules/no-unguarded-console'),
	RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('no-unguarded-console', rule, {
	valid: [
		{
			code: `if(process.env.NODE_ENV == 'development'){
				console.log('Here!');
			}`
		}
	],

	invalid: [
		{
			code: `if(process.env.NODE_ENV != 'development'){
				console.log('Here!');
			}`,
			errors: [{ message: 'Unexpected unguarded console statement.' }]
		},
		{
			code: `console.log('Here!');`,
			errors: [{ message: 'Unexpected unguarded console statement.' }]
		}
	]
});
