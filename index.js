const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys')
const authRoutes = require('./routes/authRoutes')
const billingRoutes = require('./routes/billingRoutes')
require('./models/users');
require('./services/passport');
 

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
			maxAge: 30 * 24 * 60 * 60 * 1000,
			keys: [keys.cookieKey]
		})
	);
app.use(passport.initialize());
app.use(passport.session());

authRoutes(app)
billingRoutes(app)

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets
	// like our main.js or main.css
	app.use(express.static('client/build'));
	
	const path = require('path');
	app.get('*',(req, res) => {
		res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html' ))
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);


