const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');

const session = require('express-session');

const helpers = require('./utils/helpers');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const routes = require('./controllers');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
	secret: process.env.SESSION_SECRET,
	cookie: {
		expires: 10 * 60 * 1000,
	},
	resave: true,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
