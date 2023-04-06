const PostModel = require('../models/post.model');

// GET
module.exports.getPosts = async (req, res) => {
  const posts = await PostModel.find();
  res.status(200).json(posts);
};

// SET
module.exports.setPosts = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
  }

  const post = await PostModel.create({
    message: req.body.message,
    author: req.body.author,
  });

  res.status(200).json(post);
};

// EDIT
module.exports.editPost = async (req, res) => {
  // récupère l'ID à modifier
  const post = await PostModel.findById(req.params.id);

  // Message d'erreur si post n'existe pas
  if (!post) {
    res.status(400).json({ message: "Ce post n'existe pas" });
  }

  const updatePost = await PostModel.findByIdAndUpdate(post, req.body, {
    new: true,
  });
  res.status(200).json({ updatePost });
};

// DELETE
module.exports.deletePost = async (req, res) => {
  // récupère l'ID à supprimer
  const post = await PostModel.findById(req.params.id);

  // Message d'erreur si post n'existe pas
  if (!post) {
    res.status(400).json({ message: "Ce post n'existe pas" });
  }

  await post.deleteOne();
  res.status(200).json('Message supprimé id : ' + req.params.id);
};

// LIKE
module.exports.likePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.userId } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// DISLIKE
module.exports.dislikePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.userId } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};
