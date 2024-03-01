const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3005;
app.use(cors());

app.get("/stream-file", (req, res) => {
  const filePath = "./writeFile.txt";
  const fileStream = fs.createReadStream(filePath, { highWaterMark: 16000 });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  fileStream.on("data", (chunk) => {
    res.write(`data: ${chunk.toString("utf-8")}\n\n`);
  });

  fileStream.on("end", () => {
    console.log("end");
    res.end();
  });
  fileStream.on("error", () => {
    console.log("Error in file");
    res.status(500).send("Server error");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
