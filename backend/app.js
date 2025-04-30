import express from 'express';
import cors from 'cors';
import { cookie } from 'express/lib/response';

const app = express();
app.use(cors({
    origin: process_params.env.CORS_ORIGIN,
    credentials : true
    // Allow cookies, authorization headers, or TLS client certificates to be sent
    //  from the frontend (cross-origin) to the backend.
}))

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
//Parses form data (like from HTML <form> submissions).
app.use(express.static('public'));
//Serve static files from the public directory.
//This is useful for serving images, CSS files, and JavaScript files.
//The public directory is where you would typically store your static assets.
//This middleware will serve files from the public directory at the root URL.
//For example, if you have a file public/image.png, it would be accessible at http://localhost:8000/image.png.
app.use(cookieParser());

export { app };