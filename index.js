'use strict'
import express, { request } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import Person from './models/person.js'

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.static('dist'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let personcount = 0

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

let infoDate = new Date()

app.get('/', (request, response) => {
  response.send('')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  // Person.find().then((person) => console.log(person[0]["name"]));
  // Person.find({})
  //   .then((person) => {
  //     if (person[Number(request.params.id)]) {
  //       response.json(person[Number(request.params.id)]);
  //     } else if (Number(request.params.id) > person.length) {
  //       throw new Error();
  //     } else {
  //       response.status(404).end();
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     response.status(400).send({ error: "malformatted id" });
  //   });
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    personcount = persons.length
    response.send(
      `<p>Phonebook has info for ${personcount}
       people</p><p>${infoDate}</p>`
    )
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.json(person)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// const generateId = () => {
//   const maxId =
//     Person.find({}).length > 0
//       ? Math.max(...Person.find({}).map((p) => p.id))
//       : 0;
//   return maxId + 1;
// };

// app.post("/api/persons", (request, response) => {
//   const body = request.body;
//   // console.log(body);

//   let isDuplicate = true;
//   for (let i = 0; i < persons.length; i++) {
//     if (persons[i].name.toLowerCase() === body.name.toLowerCase()) {
//       isDuplicate = true;
//       break;
//     } else {
//       isDuplicate = false;
//     }
//   }
//   if (!body.name) {
//     return response.status(400).json({
//       error: "name missing",
//     });
//   } else if (!body.number) {
//     return response.status(400).json({
//       error: "number missing",
//     });
//   } else if (isDuplicate) {
//     return response.status(400).json({
//       error: "name must be unique",
//     });
//   } else {
//     const person = {
//       id: generateId(),
//       name: body.name,
//       number: body.number,
//     };

//     persons = persons.concat(person);
//     // console.log(person);
//     response.json(person);
//   }
// });

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  // if (body.name === undefined || body.number === undefined) {
  //   console.log(process.argv);
  //   return response.status(400).json({ error: "content missing" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.updateOne({ name: person.name }, { number: person.number })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(port)
console.log(`Server running on port ${port}`)
