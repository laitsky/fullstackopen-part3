const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323532",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (req, res) => {
  res.send(persons);
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
PORT = 3001;
app.listen(PORT, () => {});
