import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comments.model.js";
import mongoose from "mongoose";
import apiError from "../utils/apiErros.js";
import { Video } from "../models/video.model.js";

const getComments = asyncHandler(async (req, res) => {
  // get all comments for a video

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate videoId
  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid Video ID");
  }
  // Create the aggregation pipeline
  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        "ownerDetails._id": 1,
        "ownerDetails.username": 1,
        "ownerDetails.fullname": 1,
        "ownerDetails.avatar": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  // Use aggregatePaginate for pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );
  // Handle no comments case
  if (!comments || comments.docs.length === 0) {
    throw new apiError(404, "No comments found for this video");
  }

  // Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments: comments.docs,
        pagination: {
          total: comments.totalDocs,
          page: comments.page,
          limit: comments.limit,
          totalPages: comments.totalPages,
          hasNextPage: comments.hasNextPage,
          hasPrevPage: comments.hasPrevPage,
        },
      },
      "Comments fetched successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  // Validate inputs
  if (!videoId || !content) {
    throw new apiError(400, "Video ID and content are required");
  }

  //  Validate ObjectId
  if (!mongoose.isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid Video ID format");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // Create the comment
  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });

  // Increment the video's comment count
  await Video.findByIdAndUpdate(videoId, {
    $inc: { commentsCount: 1 },
  });

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(newComment._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [{ $project: { title: 1, thumbnail: 1, commentsCount: 1 } }],
      },
    },
    { $unwind: "$video" },
  ];

  const [populatedComment] = await Comment.aggregate(pipeline);

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // 1️⃣ Validate commentId
  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }

  if (!mongoose.isValidObjectId(commentId)) {
    throw new apiError(400, "Invalid Comment ID format");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new apiError(404, "Comment not found");
  }
  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new apiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  await Video.findByIdAndUpdate(comment.video, {
    $inc: { commentsCount: -1 },
  });

  //  Respond success
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  //  Validate fields
  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }
  if (!mongoose.isValidObjectId(commentId)) {
    throw new apiError(400, "Invalid Comment ID format");
  }
  if (!content || content.trim() === "") {
    throw new apiError(400, "Comment content cannot be empty");
  }

  //  Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new apiError(404, "Comment not found");
  }
  //  Check if the user owns the comment
  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new apiError(403, "You are not authorized to update this comment");
  }

  //  Update the comment
  await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content } },
    { new: true }
  );

  //  Fetch updated comment with owner info via aggregation
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
  ];
  const [updatedComment] = await Comment.aggregate(pipeline);

  //  Return updated comment
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

export { getComments, addComment, deleteComment, updateComment };
