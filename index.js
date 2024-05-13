"use strict";
import express, { request } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();
const port = process.env.port || 3001;

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

let infoDate = new Date();

app.get("/", (request, response) => {
  response.send("");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${infoDate}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // console.log(body);

  let isDuplicate = true;
  for (let i = 0; i < persons.length; i++) {
    if (persons[i].name.toLowerCase() === body.name.toLowerCase()) {
      isDuplicate = true;
      break;
    } else {
      isDuplicate = false;
    }
  }
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (isDuplicate) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);
    // console.log(person);
    response.json(person);
  }
});

app.listen(port);
console.log(`Server running on port ${port}`);
