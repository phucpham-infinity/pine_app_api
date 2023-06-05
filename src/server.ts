import express from "express";

const port = process.env.PORT || 3000;
const app = express();

app.get("/hello-world", (request, response) => {
  response.send("Hello World!");
});

app.get("/api", (request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Export the Express API
module.exports = app;
