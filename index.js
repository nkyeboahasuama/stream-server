const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3005;
app.use(cors());

app.get("/stream-file", (req, res) => {
  const readFilePath = "./readFile.txt";
  const writeFilePath = "./writeFile.txt";
  const readStream = fs.createReadStream(readFilePath, { highWaterMark: 100 });
  const writeStream = fs.createWriteStream(writeFilePath);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  readStream.on("data", (chunk) => {
    res.write(`data: ${chunk.toString("utf-8")}\n\n`);
    const isEmpty = writeStream.write(chunk.toString("utf-8"));
    if (!isEmpty) {
      readStream.pause();
      writeStream.on("drain", () => {
        readStream.resume();
      });
    }
  });

  readStream.on("end", () => {
    console.log("end");
    res.end();
  });

  readStream.on("error", () => {
    console.log("Error in file");
    res.status(500).send("Server error");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
