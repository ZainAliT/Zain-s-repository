import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // TODO: toggle subscription
    const subscriberId = req.user._id;
    
    if(!channelId){
        throw new ApiError(404 , "Channel ID is required!");
    }

    const subscriber = await User.findById(subscriberId);

    if(!subscriber){
        throw new ApiError(404 , "Subscriber not found!");
    }

    const channel = await User.findById(channelId);

    if(!channel){
        throw new ApiError(404 , "Channel not found!");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber : subscriberId,
        channel : channelId
    });

    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id);
        res
        .status(200)
        .json(
            new ApiResponse(200 , "Channel unsbscribed successfully")
        );
    } else {
        const newSubscription = new Subscription({
            subscriber : subscriberId,
            channel : channelId
        });

        await newSubscription.save();

        res
        .status(200)
        .json(
            new ApiResponse(200 , newSubscription ,  "Channel subscribed successfully")
        );
    };
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.params.subscriberId;

    const userId = req.user._id;

    if(!channelId){
        throw new ApiError(404 , "Channel id is required");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404 , "User doesn't exists");
    }

    const subscriberCount = await Subscription.aggregate([
        {
            $match : { channel : channelId},
        },
        
        {
            $group : {
                _id : "$channel",
                totalSubscribers : { $sum : 1}
            }
        }       
    ]);

    console.log(subscriberCount.length);

    if(subscriberCount.length > 0){
        res
        .status(200)
        .json(
            new ApiResponse(200 , subscriberCount , `Total subscriber are${subscriberCount}`)
        );
    } else {
        throw new ApiError(404 , "The channel doesnt have any subscribers");
    }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if(!subscriberId){
        throw new ApiError(404 , "Subscriber id is required");
    }

    const subscriber = await User.findById(subscriberId);

    if(!subscriber){
        throw new ApiError(404 , "Subscriber not found !");
    }

    const subscribedChannelCount = await Subscription.aggregate([
        {
            $match : { subscriber : mongoose.Types.ObjectId(subscriberId) }
        },

        {
            $group : {
                _id : "$channel",
                count : { $sum : 1 }
            }
        }
    ]);

    
    if(subscribedChannelCount.length > 0){
        res
        .status(200)
        .json(
            new ApiResponse(200 , subscribedChannelCount , `Total subscriberChannelCount is${subscribedChannelCount}`)
        );
    } else {
        res
        .status(200)
        .json(
            new ApiResponse(200 , "The specific user doesn't have any subscriberd channel")
        );
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}