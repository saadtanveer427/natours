const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
var cors = require('cors')


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const bookingController = require('./controllers/bookingController')

const app = express();

app.enable('trust proxy')


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
const corsConfig = {
  credentials: true,
  origin: "*"//["https://127.0.0.1:3000","https://localhost:3000"]
};

app.use(cors(corsConfig));
//app.use(cors())
app.options('*',cors())

// Set security HTTP headers
//app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:','https://js.stripe.com/'],
 
 
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      imgSrc:["'self'", 'data:', 'blob:'],
 
      scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
 
      styleSrc: ["'self'", 'https:', "'unsafe-inline'",'blob:'],
 
      connectSrc: ["'self'", 'data', 'https://*.cloudflare.com','https://127.0.0.1:3000','https://api.mapbox.com',
      'https://events.mapbox.com','https://127.0.0.1:3000/api/v1/bookings/checkout-session'],
      workerSrc: ["'self'",'https://*.cloudflare.com','blob:']
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.post('/webhook-checkout',express.raw({type:'application/json'}),
bookingController.webhookCheckout)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression())

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // res.header("Access-Control-Allow-Credentials", true);
  // res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept','X-PINGOTHER');
  console.log(req.cookies,'cooo');
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
