const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://pk7677:${password}@cluster0.hlhek4p.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

// const note = new Note({
//   content: "HTML is okay",
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const phonebookEntry = new Phonebook({
    name: name,
    number: number,
  })
  phonebookEntry.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Phonebook.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((entry) => {
      console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
  })
}
