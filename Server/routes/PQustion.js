const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchauth");
const PQuestion = require("../models/ProblemQue");
const { body, validationResult } = require("express-validator");

// fetch all question
router.get("/fetchallques", fetchuser, async (req, res) => {
  //   only admin access
  userrole = req.user.role;
  if (userrole !== "admin") {
    return res.status(500).send("Your can't access this");
  }
  const questions = await PQuestion.find();
  res.json(questions);
}),
  // add problem coding question
  router.post(
    "/addques",
    fetchuser,
    [
      body("title", "Invalid title").isLength({ min: 3 }),
      body("question", "question must be atleast 10 characters").isLength({
        min: 10,
      }),
    ],
    async (req, res) => {
      try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        //   only admin access
        userrole = req.user.role;
        if (userrole !== "admin") {
          return res.status(500).send("Your can't access this");
        }
        const pques = new PQuestion(req.body);

        const savedQ = await pques.save();
        res.json(savedQ);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );

router.put("/updateques/:id", fetchuser, async (req, res) => {
  const { title, question, explanation, testcases, level } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (question) {
      newNote.question = question;
    }
    if (explanation) {
      newNote.explanation = explanation;
    }
    if (testcases) {
      newNote.testcases = testcases;
    }
    if (level) {
      newNote.level = level;
    }

    // Find the question to be updated and update it
    let updateq = await PQuestion.findById(req.params.id);
    if (!updateq) {
      return res.status(404).send("Not Found");
    }
    //   check admin or not
    userrole = req.user.role;
    if (userrole !== "admin") {
      return res.status(500).send("Your can't access this");
    }
    updateq = await PQuestion.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ updateq });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deleteques/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let ques = await PQuestion.findById(req.params.id);
    if (!ques) {
      return res.status(404).send("Not Found");
    }

    //   check admin or not
    userrole = req.user.role;
    if (userrole !== "admin") {
      return res.status(500).send("Your can't access this");
    }

    ques = await PQuestion.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", question: ques });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
