const express  = require('express');
const users  = express.Router()
const cors = require('cors');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/db.js');
const {hashPassword} = require('../models/User'); 

users.use(cors());

process.env.SECRET_KEY = 'secret';


//REGISTER
users.post('/register', (req,res) => {
	const { email, password, first_name, last_name, gender, username } = req.body;
	if(!email || !password || !username) {
		res.send(0);
	}
	var sqlFetch = "Select * from user where Email = '"+email+"'";
	db.query(sqlFetch, async (err,rows) => {
		if(err) {
			res.send("Could not perform the action" + err);
		} else {
			if(rows.length) {
				res.send(0);
			} else {
				const hashedPswd = await hashPassword(password);
				var sqlInsert = "INSERT INTO user(First_Name,Last_Name,Email,Gender,Username,Password)values(\
								'"+first_name+"','"+last_name+"','"+email+"','"+gender+"','"+username+"','"+hashedPswd+"')";
				db.query(sqlInsert, (err,rows) => {
					if(err) {
						res.send("Could not perform the action" + err);
					} else {
						if(rows) {
							res.json({status: username + ' registered'});	
						} else {
							res.send('error: ' + err);
						}
					}
				})
			}
		}
	});
});

//LOGIN
users.post('/login', (req,res) => {
	const {email, password} = req.body;
	var sqlFetch = "Select (Password) from user where Email = '"+email+"'";
	db.query(sqlFetch, (err,rows) => {
		if(err) {
			res.send(err);
		} else {
			if(rows.length === 1) {
				if(bcrypt.compareSync(password, rows[0].Password)) {
					var fetchUser = "Select * from user where Email = '"+email+"'";
			        db.query(fetchUser, (err,user) => {
			        	const payload = JSON.stringify(user[0]);
		          	    let token = jwt.sign(JSON.parse(payload), process.env.SECRET_KEY, { expiresIn: 1440 });
		          	    res.send(token);
			        });
			    } else {
			        res.status(400).json('Wrong Credentials!')
			    }
			} else {
				res.send(0);
			}
		}
	});
});

module.exports = users
