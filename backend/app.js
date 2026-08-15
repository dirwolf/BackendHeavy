import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';

const app = express();
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(",");
const corsOptions = {
    origin: (incomingOrigin, callback) => {
        if (!incomingOrigin) return callback(null, true); // allow non-browser requests like curl
        if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
        return callback(new Error("CORS not allowed by server"), false);
    },
    credentials: true, // allow cookies
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept']
};

app.use(cors(corsOptions));


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
//Parses form data (like from HTML <form> submissions).
app.use(express.static('public'));
//Serve static files from the public directory.
//This is useful for serving images, CSS files, and JavaScript files.
//The public directory is where you would typically store your static assets.
//This middleware will serve files from the public directory at the root URL.
//For example, if you have a file public/image.png, it would be accessible at http://localhost:8000/image.png.
app.use(cookieParser());

// Routes

// routes import
import userRouter from './routes/user.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js';




// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscription", subscriptionRoutes);


// Error handling middleware - MUST BE LAST!
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }
    
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});


app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


export { app };