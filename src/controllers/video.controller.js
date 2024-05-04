import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { getVideoDurationInSeconds } from "get-video-duration"
import { json } from "express"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if(!userId){
        throw new ApiError(404 , "User id is required !");
    }

    const videos = await Video.find({ owner : userId });

    res
    .status(200)
    .json(
        new ApiResponse(200 , videos , "Videos fetched successfuly !")
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    const userID = req.user._id;

    if(!(title && title !== '')){
        throw new ApiError(404 , "Title cannot be empty !");
    }
    console.log(req.files);

    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if(!videoFileLocalPath){
        throw new ApiError(404 , "Video file is required !");
    }

    const getDuration = await getVideoDurationInSeconds(videoFileLocalPath).then((duration) => duration);
    console.log(getDuration);
    
    const videoCD = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoCD){
        throw new ApiError(404 , "Error occured while uploading video on cloudinary");
    }

    const video = await Video.create({
        title : title,
        description : description,
        videoFile : videoCD.url,
        thumbnail : thumbnail.url,
        duration : getDuration,
        owner : userID
    });

    if(!video){
        throw new ApiError(404 , "Cannot create video !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , video , "Video uploaded successfuly !")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!videoId){
        throw new ApiError(404 , "Video id is required !");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404 , "Cannot find video with the matching id !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , video , "Video fetched successfuly !")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!videoId){
        throw new ApiError(404 , "Video id is required !");
    }

    const { title , description } = req.body;

    const thumbnailLocalPath = req.file.path;

    if(!thumbnailLocalPath){
        throw new ApiError(404 , "Thumbnail file is not provided !")
    }

    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);


    const video = await Video.findById(videoId);

    video.title = title;
    video.description = description;
    video.thumbnail = thumbnailUpload.url;

    const updatedVideo = video.save({validateBeforeSave : false});

    if(!updatedVideo){
        throw new ApiError(404 ,"Cannot find video with the matching id to update details !")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , video , "Video details updated successfuly !")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId){
        throw new ApiError(404 , "Video id is required !");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if(!video){
        throw new ApiError(404 , "Cannot find video with the matching id !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , "Video deleted successfuly !")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!videoId){
        throw new ApiError(404 , "Video id is required !");
    }

    const video  = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404 , "Cannot find video with the matching ID !");
    }

    video.isPublished = !video.isPublished;

    const updatedVideo = await video.save({ validateBeforeSave : false });

    res
    .status(200)
    json(
        new ApiResponse(200 , updatedVideo , "Publish Status updated ! ")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
