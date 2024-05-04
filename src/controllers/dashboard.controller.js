import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user._id;

    const videos = await Video.find({ owner : userId });

    const likes = await Like.find({ likedBy : userId });

    const subscribers = await Subscription.find({ subscriber : userId });
    

    const totalLikes = likes.length;
    const totalSubscribers = subscribers.length;
    const totalVideos = videos.length;
    
    const stats = {
        totalLikes,
        totalSubscribers,
        totalVideos
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , stats , "Stats fetched successfuly !")
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const userId = req.user._id;

    const video = await Video.find({ owner : userId });

    res
    .status(200)
    .json(
        new ApiResponse(200 , video , "Videos of the channel fetched !")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }