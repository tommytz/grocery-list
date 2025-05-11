import 'dotenv/config';
import express from "express";
import cors from "cors";
import { auth } from "./auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

const app = express();
const port = 3000;

app.use(cors({ credentials: true }));
app.use(express.json());

app.post("/auth/signup", async (req, res) => {
  const user = await auth.api.signUpEmail({ body: req.body });
  res.status(201).json(user);
});

app.post("/auth/login", async (req, res) => {
  const session = await auth.api.signInEmail({ body: req.body, headers: fromNodeHeaders(req.headers), asResponse: true });
  res.status(session.status);
  session.headers.forEach((value, key) => res.setHeader(key, value));
  const body = await session.json();
  res.send(body);
});

app.post("/auth/logout", async (req, res) => {
  const session = await auth.api.signOut({ headers: fromNodeHeaders(req.headers) });
  res.status(200).json(session);
});

app.get("/whoami", async (req, res) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.status(200).json(session);
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.post("/echo", (req, res) => {
  const message = req.body.message;
  res.json({ message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
