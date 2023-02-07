import express from "express";
import validate from "../../middleware/validationMiddleWare.js";
import { blog_schema, comment_schema } from "../../config/validation.js";

import {
  getAllBlogs,
  createNewBlog,
  updateBlog,
  findBlog,
  deleteBlog,
  likeBlog,
  commentToBlog,
} from "../../controllers/blogsController.js";
import multer from "multer";
import verifyUserToken from "../../middleware/authVerifyMiddleWare.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/")
  .get(getAllBlogs)
  .post(
    [verifyUserToken, upload.single("image"), validate(blog_schema)],
    createNewBlog
  );

router
  .route("/:id")
  .put(
    [verifyUserToken, upload.single("image"), validate(blog_schema)],
    updateBlog
  )
  .get(findBlog)
  .delete(verifyUserToken, deleteBlog);

router.route("/like/:id").get(verifyUserToken, likeBlog);

router
  .route("/comment/:id")
  .post([verifyUserToken, validate(comment_schema)], commentToBlog);

export default router;
