const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchauth");
const PQuestion = require("../models/ProblemQue");
const SQuestion = require("../models/SubmitQ");

router.post("/addSubmit/:id", fetchuser, async (req, res) => {
  try {
    // let note = await SQuestion.findById(req.params.id);
    const { passedtestcases, actualtestcases, testpercentage, codes } = req.body;
    let submit = await SQuestion.find({ user: req.user.id }).select("pquestion");
    const targetId = req.params.id;

    const conductonArray = submit.map((item) => item["pquestion"].toString());
    const isConductionTrue = conductonArray.includes(targetId);
    if (isConductionTrue) {
      return res.status(500).send("Already data exist");
    }
    const sques = new SQuestion({
      user: req.user.id,
      pquestion: req.params.id,
      passedtestcases,
      actualtestcases,
      testpercentage,
      codes,
    });

    const savedS = await sques.save();
    res.json(savedS);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetching", fetchuser, async (req, res) => {
  try {
    let sumit = await SQuestion.find({ user: req.user.id });

    const pquestionIds = sumit.map((item) => item["pquestion"]);
    let fetch = await PQuestion.find({ _id: { $in: pquestionIds } });
    res.json({ sumit, fetch });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/resubmit/:id", fetchuser, async (req, res) => {
  try {
    // let note = await SQuestion.findById(req.params.id);
    const { passedtestcases, actualtestcases, testpercentage, codes } = req.body;
    let submit = await SQuestion.find({ user: req.user.id }).select("pquestion");
    const targetId = req.params.id;

    const conductonArray = submit.map((item) => item["pquestion"].toString());
    const isConductionTrue = conductonArray.includes(targetId);
    if (isConductionTrue) {
      const newNote = {};
      if (passedtestcases) {
        newNote.passedtestcases = passedtestcases;
      }
      if (actualtestcases) {
        newNote.actualtestcases = actualtestcases;
      }
      if (testpercentage) {
        newNote.testpercentage = testpercentage;
      }
      if (codes) {
        newNote.codes = codes;
      }
      let sques = await SQuestion.find({pquestion:req.params.id});
      if (!sques) {
        return res.status(404).send("Not Found");
      }
      sques = await SQuestion.findOneAndUpdate({pquestion:req.params.id}, { $set: newNote }, { new: true });

      return res.json({ sques });
    }

    res.status(500).send("Internal Server Error");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
