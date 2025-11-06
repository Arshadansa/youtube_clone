import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  getSubscribedChannels,
  toggleSubscription,
  getUserChannelSubscribers,
} from "../controllers/subscriber.controller.js";

const router = Router();
router.use(verifyJwt);

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;
