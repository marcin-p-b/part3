import mongoose from "mongoose";
import "dotenv/config";

if (process.argv.length < 3) {
  console.log("give password as argument");
  console.log(process.argv);
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phonenumber = process.argv[4];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: phonenumber,
});

if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log("contact saved!");
    console.log(`added ${name} number ${phonenumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
