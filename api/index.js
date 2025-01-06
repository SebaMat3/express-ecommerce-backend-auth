//api/index.js

const routerApi = require("./routes");
const cors = require("cors");
const passport = require('passport');

const { logErrors, ormErrorHandler, boomErrorHandler, errorHandler } = require("./middlewares/error.handler");
const { checkApiKey} = require("./middlewares/auth.handler");


const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(passport.initialize());
app.use(express.json());

routerApi(app);

const whitelist = ['http://localhost:3000', 'https://myapp.com'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('not allowed'));
    }
  }
};

app.use(cors(options));
require("./utils/auth");


app.get("/", (req, res) => {
  res.send("My express server");
})
app.get("/new-path", checkApiKey, (req, res) => {
  res.send("Welcome to the new path!");
})

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, ()=>{
  console.log(`Listening at http://localhost:${port}`)
})

module.exports = app;

