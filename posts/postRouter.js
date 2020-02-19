const express = require("express");

const router = express.Router();

const pd = require("./postDb");

router.get("/", (req, res) => {
  // do your magic!
  pd.get().then(post => {
    res.status(200).json(post);
  });
});

router.get("/:id", validatePostId(), (req, res) => {
  const { id } = req.params;
  // do your magic!
  pd.getById(id).then(post => {
    res.status(200).json(post);
  });
});

router.delete("/:id", validatePostId(), (req, res) => {
  const { id } = req.params;
  // do your magic!
  pd.remove(id).then(dltd => {
    if (dltd) {
      res.json({ post: "this post has been deleted." });
    } else {
      res.status(404).json({ message: "Post is not found" });
    }
  });
});

router.put("/:id", validatePostId(), (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  // do your magic!
  pd.getById(id).then(updatedPost => {
    if (updatedPost) {
      pd.update(id, newPost).then(post => {
        res.json(post);
      });
    } else {
      res.status(400).json({
        error: "No content found!"
      });
    }
  });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    pd.getById(req.params.id).then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          erroMessage: "post not found"
        });
      }
    });
    next();
  };
}

module.exports = router;
