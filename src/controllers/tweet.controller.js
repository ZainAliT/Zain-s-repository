import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const userId = req.user._id;
    
    if(!userId){
        throw new ApiError(404 , "Yopu have to login or signup first");
    }

    if(!content){
        throw new ApiError(404 , "Invalid content or content missing");
    }

    const createTweet = await Tweet.create({
        content,
        owner : userId
    });

    if(!createTweet){
        throw new ApiError(404 , "Cannot create tweet");
    };

    res
    .status(200)
    .json(
        new ApiResponse(200 , content , "Tweet has beem created successfull!")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId;
    
    if(!userId){
        throw new ApiError(404 , "You have to login or signup first");
    }

    const getTweets = await Tweet.find({ owner : userId });

    if(!getTweets){
        throw new ApiError(404 , "Cannot get tweets!");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , getTweets , "Tweets fetched successfully!")
    );
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const getTweetId = req.params.tweetId;
    const content = req.body.content;

    if(!getTweetId){
        throw new ApiError(404 , "Invalid tweet ID!");
    }

    const tweet = await Tweet.findByIdAndUpdate(getTweetId , {
        content,
    });

    if(!tweet){
        throw new ApiError(404 , "Unable to find and update tweet");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , tweet , "Tweet updated successfully !")
    );
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const getTweetId = req.params.tweetId;
    
    if(!getTweetId){
        throw new ApiError(404 , "Invalid tweet ID!");
    }

    const tweet = await Tweet.findByIdAndDelete(getTweetId);

    if(!tweet){
        throw new ApiError(404 , "Unable to find and delete tweet");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200  , "Tweet deleted successfully !")
    );
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
