const yargs = require("yargs");
const notes = require("./notes.js");

const WAIT_TIME = 2000;

// Supports for the commands are added.

yargs.command({
  command: "add",
  describe: "Add a new note",
  builder: {
    title: {
      decribe: "Note title",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string",
    },
  },
  handler: function (argv) {
    setTimeout(() => {
      notes.addNote(argv.title, argv.body);
      console.log("\n");
    }, WAIT_TIME);
    console.log("\nAdding the note!\n");
  },
});

yargs.command({
  command: "remove",
  describe: "Remove a note",
  builder: {
    title: {
      decribe: "Note title",
      demandOption: true,
      type: "string",
    },
  },
  handler: function (argv) {
    setTimeout(() => {
      notes.removeNote(argv.title);
      console.log("\n");
    }, WAIT_TIME);
    console.log("\nTrying to remove the note!\n");
  },
});

yargs.command({
  command: "list",
  describe: "List the notes",
  handler: function () {
    setTimeout(() => {
      notes.listNotes();
      console.log("\n");
    }, WAIT_TIME);
    console.log("\nRetrieving your notes!\n");
  },
});

yargs.command({
  command: "read",
  describe: "Read the note",
  builder: {
    title: {
      decribe: "Note title",
      demandOption: true,
      type: "string",
    },
  },
  handler: function (argv) {
    setTimeout(() => {
      notes.readNote(argv.title);
      console.log("\n");
    }, WAIT_TIME);
    console.log("\nRetrieving your note!\n");
  },
});

yargs.parse();
