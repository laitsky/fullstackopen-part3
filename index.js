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

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;
  const person = { name, number };

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => {
      res.status(204).end();
    })
    .catch((err) => res.status(404).end());
});

const generateId = () => Math.floor(Math.random() * 50000);

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  const personCount = persons.length;

  res.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${new Date()}</p>
    `);
});

const errorHandler = (err, req, res, next) => {

  if (err.name === "CastError") {
    return res.status(400).send({ error: "id not valid" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};
app.use(errorHandler);

PORT = process.env.PORT;
app.listen(PORT, () => {});
