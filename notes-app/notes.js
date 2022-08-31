const fs = require("fs");
const chalk = require("chalk");
const FILE_NAME = "notes.json";

const addNote = function (_title, _body) {
  const notes = loadNotes();
  if (!notes.some((note) => note.title === _title)) {
    notes.push({ title: _title, body: _body });
    saveNotes(notes);
    console.log(chalk`{bgGreen Note is saved!}`);
  } else console.log(chalk`{bgRed The note ${_title} already exists!}`);
};

const loadNotes = function () {
  try {
    //
    const dataBuffer = fs.readFileSync(FILE_NAME);
    const data = dataBuffer.toString();
    return JSON.parse(data);
    //
  } catch (error) {
    return [];
  }
};

const removeNote = function (title) {
  const notes = loadNotes();
  const index = notes.findIndex((note) => note.title === title);
  if (index !== -1) {
    notes.splice(index, 1);
    console.log(chalk`{bgGreen Note is removed}`);
  } else console.log(chalk`{bgRed Note with title "${title}" does not exist.}`);
  saveNotes(notes);
};

const saveNotes = function (notes) {
  const data = JSON.stringify(notes);
  fs.writeFileSync(FILE_NAME, data);
};

const listNotes = function () {
  const notes = loadNotes();
  notes.length
    ? notes.forEach((note, index) =>
        console.log(`Note #${index + 1}\t=> ${note.title}`)
      )
    : console.log(chalk`{bgRed There is no notes to list.}`);
  saveNotes(notes);
};

const readNote = function (title) {
  const notes = loadNotes();
  const theNote = notes.find((note) => note.title === title);
  theNote
    ? console.log(`Title: ${theNote.title}\nBody: ${theNote.body}`)
    : console.log(chalk`{bgRed The note ${title} does not exist.}`);
};

module.exports = {
  addNote: addNote,
  removeNote: removeNote,
  listNotes: listNotes,
  readNote: readNote,
};
