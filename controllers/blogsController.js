import Blog from "../model/Blog.js";
import cloudinaryUpload from "../config/cloudinaryUpload.js";

export const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find();
  if (!blogs) return res.status(204).json({ message: "No blogs found" });
  res.json(blogs);
};

export const createNewBlog = async (req, res) => {
  
  let imagePath = req.file.path;

  const uploaded_img = await cloudinaryUpload(imagePath);

  try {
    const result = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      author: req.user.names,
      date: req.body.date,
      image: uploaded_img.url,
    });

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const updateBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Blog ID required" });
  const blog = await Blog.findOne({ _id: req.params.id });

  if (!blog)
    return res.status(204).json({ message: "No blog matches the given ID" });
  if (req?.body?.title) blog.title = req.body.title;
  if (req?.body?.author) blog.author = req.body.author;
  if (req?.body?.body) blog.body = req.body.body;
  if (req?.file) {
    let imagePath = req.file.path;
    console.log(imagePath);
    const uploaded_img = await cloudinaryUpload(imagePath);
    blog.image = uploaded_img.url;
  }

  const result = await blog.save();
  res.json(result);
};

export const findBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "The blog ID is required" });

  const blog = await Blog.findOne({ _id: req.params.id });

  if (!blog)
    return res.status(204).json({ message: "No blog matches the given ID" });

  res.json(blog);
};

export const deleteBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "The blog ID is required" });

  const blog = await Blog.findOne({ _id: req.params.id });

  if (!blog)
    return res.status(204).json({ message: "No blog matches the given ID" });

  const result = await Blog.deleteOne({ _id: req.params.id });
  res.json(result);
};
export default { getAllBlogs, createNewBlog, updateBlog, findBlog };
