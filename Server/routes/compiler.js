const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");


router.post("/py", (req, res) => {
  const { code, input } = req.body;
  // console.log(req.body)
  const python = spawn("python", ["-c", code]);

  let output = "";
  let error = "";

  python.stdin.write(input);
  python.stdin.end();

  python.stdout.on("data", (data) => {
    output += data;
  });

  python.stderr.on("data", (data) => {
    error += data;
  });

  python.on("close", (code) => {
    if (code !== 0 || error) {
      res.status(500).send({ error: error });
    } else {
      res.send({ output: output });
    }
  });
});

module.exports = router;
