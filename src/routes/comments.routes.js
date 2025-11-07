import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/comments.controller.js";


const router = Router();

router.use(verifyJwt);

router.route("/:videoId").get(getComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router