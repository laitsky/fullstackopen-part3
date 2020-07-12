const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const url = `mongodb+srv://fullstackopen:blackberry123@fullstackopen-backend.z8qmc.gcp.mongodb.net/fullstackopen?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected to database!"))
  .catch((err) => console.log("error:", err.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));
app.use(
  morgan((token, req, res) => {
    return [
      token.method(req, res),
      token.url(req, res),
      token.status(req, res),
      token.res(req, res, "content-length"),
      "-",
      token["response-time"](req, res),
      "ms",
      req.method === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ");
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((note) => note.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(200).end();
});

const generateId = () => Math.floor(Math.random() * 50000);

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(406).json({
      error: "Name or number is missing",
    });
  } else if (persons.find((person) => person.name === name)) {
    return res.status(406).json({
      error: "Name must be unique",
    });
  }

  const person = {
    name,
    number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.status(201).json(person);
});

app.get("/info", (req, res) => {
  const personCount = persons.length;

  res.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${new Date()}</p>
    `);
});
PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});
