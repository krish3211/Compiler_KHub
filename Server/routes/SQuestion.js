const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchauth");
const SQuestion = require("../models/SubmitQ");

router.post("/addSubmit/:id", fetchuser, async (req, res) => {
  try {
    // let note = await SQuestion.findById(req.params.id);
    const { passedtestcases, actualtestcases, testpercentage, codes } = req.body;
    let submit = await SQuestion.find({ user: req.user.id }).select("pquestion");
    if (submit[0]["pquestion"].toString() === req.params.id) {
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
      let sques = await SQuestion.findById(submit[0]["_id"]);
    if (!sques) {
      return res.status(404).send("Not Found");
    }
      sques = await SQuestion.findByIdAndUpdate(submit[0]["_id"], { $set: newNote }, { new: true });
      
      return res.json({ sques });
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
    res.json("savedS");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetching", fetchuser, async (req, res) => {
  try {
    let sumit = await SQuestion.find({ user: req.user.id }).select(["pquestion"]);
    res.json(sumit);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
