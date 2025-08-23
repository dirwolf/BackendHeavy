import { Router } from "express";
import { 
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All subscription routes require authentication
router.use(verifyJWT);

// Toggle subscription (subscribe/unsubscribe)
router.route("/c/:channelId").post(toggleSubscription);

// Get subscribers of a channel
router.route("/c/:channelId").get(getUserChannelSubscribers);

// Get channels a user has subscribed to
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;
