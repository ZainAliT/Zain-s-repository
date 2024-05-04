import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { json } from "express"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user._id;
    //TODO: create playlist

    if(!name){
        throw new ApiError(404 , "Playlist name is required !")
    }

    const existingPLaylist = await Playlist.findOne({ name : name });

    if(existingPLaylist){
        throw new ApiError(404 , "You already have a playlist with this name !")
    }

    const newPlaylist = await Playlist.create({
        name : name,
        description : description,
        owner : userId,
    });

    res
    .status(200)
    .json(
        new ApiResponse(200 , newPlaylist , "Playlist has been created successfuly !")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId){
        throw new ApiError(404 , "User id is required !")
    }

    const playlist = await Playlist.find({ owner : userId });

    if(!playlist){
        throw new ApiError(404 , "You don't have any playlist !")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , playlist , "Playlist fetched successfuly !")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        throw new ApiError(404 , "PLaylist Id is required !")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404 , "You don't have any playlist !")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , playlist , "Playlist fetched successfuly !")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!(playlistId && videoId)){
        throw new ApiError(404 , "Playlist id and video id is required")
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if(!playlist){
        throw new ApiError(404 , "Cannot find playlist !")
    }

    if(!video){
        throw new ApiError(404 , "Cannot find video !")
    }

    playlist.videos.push(video);
    const updatedPlaylist = await playlist.save();

    if(!updatedPlaylist){
        throw new ApiError(404 , "Cannot add video to playlist !");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , updatedPlaylist , "Video added to playlist !")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(playlistId && videoId)){
        throw new ApiError(404 , "Playlist and video is required");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    playlist.videos.pop(video);
    const updatedPlaylist = await playlist.save();

    if(!updatePlaylist){
        throw new ApiError(404 , "Video cannot be removed");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , updatedPlaylist , "Playlist updated !")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId){
        throw new ApiError(404 , "Playlist id is required !")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404 , "Cannot find playlist with the matching id !")
    }

    await Playlist.deleteOne(playlist);

    res
    .status(200)
    .json(
        new ApiResponse(200 , "Playlist deleted successfuly !")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        throw new ApiError(404 , "Playlist id is required !")
    }

    if(!(name || description)){
        throw new ApiError(404 ,"name or description is required !")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404 , "Playlist not found !")
    }

    playlist.name = name;
    playlist.description = description;

    const updatedPlaylist = await playlist.save();

    if(!updatePlaylist){
        throw new ApiError(404 , "Error while updating playlist !")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , updatedPlaylist , "Playlist updatde successfuly !")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
