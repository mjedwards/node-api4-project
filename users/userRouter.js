const express = require("express");

const router = express.Router();

const ud = require("./userDb");
const pd = require("../posts/postDb");

router.post("/", validateUser(), (req, res) => {
  const person = req.body;
  // do your magic!
  if (person) {
    ud.insert(person).then(user => {
      res.status(201).json(user);
    });
  } else {
    res.status(400).json({ errorMessage: "Something went wrong." });
  }
});

router.post("/:id/posts", validateUserId(), (req, res) => {
  const text = req.body;
  const { id } = req.params;
  // do your magic!
  if (id) {
    ud.getById(id).then(data => {
      if (!data) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the post." });
      } else if (data) {
        pd.insert(text).then(addPost => {
          res.status(201).json(addPost);
        });
      }
    });
  }
});

router.get("/", (req, res) => {
  // do your magic!
  ud.get().then(users => {
    res.status(200).json(users);
  });
});

router.get("/:id", validateUserId(), (req, res) => {
  const { id } = req.params;
  // do your magic!
  ud.getById(id).then(user => {
    res.status(200).json(user);
  });
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  const { id } = req.params;
  // do your magic!
  ud.getUserPosts(id).then(userPost => {
    res.status(200).json(userPost);
  });
});

router.delete("/:id", validateUserId(), (req, res) => {
  const { id } = req.params;
  // do your magic!
  ud.remove(id).then(dltd => {
    if (dltd) {
      res.json({ post: "this user has been deleted." });
    } else {
      res.status(404).json({ message: "User is not found" });
    }
  });
});

router.put("/:id", validateUserId(), (req, res) => {
  const { id } = req.params;
  const newUser = req.body;
  // do your magic!
  pd.getById(id).then(updatedUser => {
    if (updatedUser) {
      ud.update(id, newUser).then(user => {
        res.json(user);
      });
    } else {
      res.status(400).json({
        errorMessage: "No content found!"
      });
    }
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    ud.getById(req.params.id).then(user => {
      if (user) {
        req.user = user;
      } else {
        res.status(404).json({
          errorMessage: "user not found"
        });
      }
    });
    next();
  };
}

function validateUser(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      res.status(400).send({ errorMessage: "no user found" });
    } else {
      res.json(req.body);
    }
    next();
  };

  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    ud.getUserPosts(req.params.id).then(post => {
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
