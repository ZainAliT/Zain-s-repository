import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    //TODO: toggle like on video

    const userId = req.user._id;

    if(!videoId){
        throw new ApiError(404 , "Video id is required !")
    };

    const existingLike = await Like.findOne({ video : videoId , likedBy : userId });

    if(existingLike){
        await Like.deleteOne({ video : videoId , likedBy : userId });
        res
        .status(200)
        .json(
            new ApiResponse(200 , "Video unliked successfuly !")
        );
    } else {
        const newLike = new Like({  video : videoId , likedBy : userId });
        await newLike.save(); 
        res
        .status(200)
        .json(
            new ApiResponse(200 , newLike ,  "Video liked successfuly !")
        );
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id;

    if(!commentId){
        throw new ApiError(404 , "Comment id is required !")
    }

    const existingCommentLike = await Like.findOne({ comment : commentId , likedBy : userId });

    if(existingCommentLike){
        await Like.deleteOne({ comment : commentId , likedBy : userId});
        res
        .status(200)
        .json(
            new ApiResponse(200 , "Comment unliked successfuly !")
        )
    } else {
        const newLike = new Like({ comment : commentId  , likedBy : userId});
        await newLike.save();
        res
        .status(200)
        .json(
            new ApiResponse(200 , newLike ,  "Comment liked successfuly !")
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id;

    if(!tweetId){
        throw new ApiError(404 , "tweet id is required !")
    }

    const existingTweetLike = await Like.findOne({ tweet : tweetId , likedBy : userId });

    if(existingTweetLike){
        await Like.deleteOne({ tweet : tweetId , likedBy : userId});
        res
        .status(200)
        .json(
            new ApiResponse(200 , "Tweet unliked successfuly !")
        )
    } else {
        const newLike = new Like({ tweet : tweetId  , likedBy : userId});
        await newLike.save();
        res
        .status(200)
        .json(
            new ApiResponse(200 , newLike ,  "Tweet liked successfuly !")
        )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user._id;

    const likedVideos = await Like.aggregate([
        {
            $match : {
                likedBy : userId
            }
        },

        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "videoDetails"
            }
        } , 

        {
            $unwind : "$videoDetails"
        } , 

        {
            $replaceRoot : { newRoot : "$videoDetails"}
        }
    ])

    if(!likedVideos || likedVideos.length === 0){
        throw new ApiError(404 , "The video doesn't have any likes !")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , likedVideos , "Liked videos fetched successfuly !")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}