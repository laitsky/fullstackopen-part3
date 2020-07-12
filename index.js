require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
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

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const personCount = persons.length;

  res.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${new Date()}</p>
    `);
});
PORT = process.env.PORT;
app.listen(PORT, () => {});
