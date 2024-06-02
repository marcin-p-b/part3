import mongoose from "mongoose";

const password = process.argv[2];
const name = process.argv[3];
const phonenumber = process.argv[4];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2}-\d{7}/.test(v) || /\d{3}-\d{6}/.test(v);
      },
    },
  },
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: phonenumber,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default Person;
