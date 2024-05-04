import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { json } from "express"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query;

    if(!videoId){
        throw new ApiError(404 , "Video id is required !");
    }

    const skip = (page - 1) * limit;

    const getVideoComment = await Comment.aggregate([
        {
            $match : { video : mongoose.Types.ObjectId(videoId) }
        },
        
        {
            $group : {
                _id : "$video",
                count : { $sum : 1 }
            }
        },

        {
            $skip : skip
        },

        {
            $limit : limit
        }
    ]);

    if(!getVideoComment > 0){
        throw new ApiError(404 , "Video doesn't have any comment !");
    } else {
        res
        .status(200)
        .json(
            new ApiResponse(200 , getVideoComment , "Video comments fetched successfuly !")
        )
    }
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId} = req.params;
    const {content} = req.body;
    const userID = req.user._id;

    console.log(content);

    if(!videoId){
        throw new ApiError(404 , "Video is required");
    }

    if(!content){
        throw new ApiError(404 , "Comment cannot be null!");
    }

    const createComment = await Comment.create({
        content : content,
        video : videoId,
        owner : userID
    });

    if(!createComment){
        throw new ApiError(404 , "There is an error while adding comment !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , createComment , "Comment added successfuly !")
    );
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId} = req.params;
    const content = req.body;

    if(!commentId){
        throw new ApiError(404 , "Comment ID is required !");
    }

    const comment = await Comment.findByIdAndUpdate({
        content : content
    });

    if(!comment){
        throw new ApiError(404 , "Please add comment first to update it !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , comment , "Comment updated succesfuly !")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(404 , "Comment ID is required !");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if(!comment){
        throw new ApiError(404 , "Please add comment first to delete it !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , "Comment deleted succesfuly !")
    );
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
