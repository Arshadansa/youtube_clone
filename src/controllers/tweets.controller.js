import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiErros.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Tweet } from "../models/tweets.model.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  //  Validate input
  if (!content || content.trim() === "") {
    throw new apiError(400, "Tweet content is required");
  }

  //  Create new tweet
  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(tweet._id) },
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

  const [populatedTweet] = await Tweet.aggregate(pipeline);
  return res
    .status(201)
    .json(new ApiResponse(201, populatedTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new apiError(400, "Invalid User ID");
  }
  const tweets = await Tweet.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "users", // name of the collection being joined
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!tweets.length) {
    throw new apiError(404, "No tweets found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new apiError(400, "TweetId is required");
  }
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new apiError(400, "Invalid Tweets ID");
  }
  if (!content || content.trim() === "") {
    throw new apiError(400, "tweet content is required");
  }

  const tweet = Tweet.findById(tweetId);

  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }
 

  // Update only if tweet belongs to the logged-in user
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: req.user?._id },
    { $set: { content } },
    { new: true }
  );

  if (!updatedTweet) {
    throw new apiError(404, "Tweet not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

  // ✅ Validate tweetId
  if (!tweetId) {
    throw new apiError(400, "Tweet ID is required");
  }
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new apiError(400, "Invalid Tweet ID");
  }

  // ✅ Find tweet and verify ownership
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new apiError(403, "You are not authorized to delete this tweet");
  }

  // ✅ Delete tweet
  await Tweet.findByIdAndDelete(tweetId);
   return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
