import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    // multer upload is being used as a middleware which is necessary 
    upload.fields([     //this creates req.files
//         When you use upload.fields():
// Creates req.files (plural)
// req.files is an object with field names as keys

// they're defined as single file fields that Multer automatically converts to arrays.

// Each field can have multiple files (up to maxCount)
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

export default router;