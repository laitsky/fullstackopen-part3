const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen-backend.z8qmc.gcp.mongodb.net/fullstackopen?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected to database!"))
  .catch((err) => console.log("error:", err.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  name,
  number,
});

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(0);
  });
} else if (process.argv.length === 5) {
  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
    process.exit(0);
  });
} else {
  console.log(
    "Error! Please check again your command. You must provide either three or five arguments"
  );
  process.exit(1);
}
