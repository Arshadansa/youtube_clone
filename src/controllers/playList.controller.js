import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import apiError from "../utils/apiErros.js";
import { Video } from "../models/video.model.js";
import { playList } from "../models/playLists.model.js";

const createPlaylist = asyncHandler(async (req, res) => {});

const getPlaylistById = asyncHandler(async (req, res) => {});

const updatePlaylist = asyncHandler(async (req, res) => {});

const deletePlaylist = asyncHandler(async (req, res) => {});

const addVideoToPlaylist = asyncHandler(async (req, res) => {});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {});

const getUserPlaylists = asyncHandler(async (req, res) => {});

export {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
};
