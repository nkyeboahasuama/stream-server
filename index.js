const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3005;
app.use(cors());
app.get("/stream-file", (req, res) => {
  const filePath = "./writeFile.txt";
  const fileStream = fs.createReadStream(filePath, { highWaterMark: 20 });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  fileStream.on("data", (chunk) => {
    fileStream.pause();
    paused = true;

    setTimeout(() => {
      res.write(`data: ${chunk.toString("utf-8")}\n\n`);
      paused = false;
      fileStream.resume();
    }, 100);
  });

  fileStream.on("end", () => {
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
