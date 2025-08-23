import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    console.log("channelId recieved : ", channelId," and req._user__id : ",req.user._id); 
    if (channelId === req.user._id.toString()) {

        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    // Check if channel exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {
        // Unsubscribe: remove the subscription
        await Subscription.findByIdAndDelete(existingSubscription._id)
        console.log("Existing subscription found , no unsubsribing it ");
        
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
    } else {
        // Subscribe: create new subscription
        const newSubscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        return res.status(200).json(
            new ApiResponse(200, newSubscription, "Subscribed successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    // Check if channel exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // Get all subscribers for this channel
    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username fullName avatar")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    // Check if user exists
    const user = await User.findById(subscriberId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Get all channels this user has subscribed to
    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username fullName avatar")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}