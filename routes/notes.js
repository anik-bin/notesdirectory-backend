const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../mongodb/models/Notes');
const { body, validationResult } = require('express-validator');

// Route-1: GET api/notes/fetchuser we get all the notes of a user, Login required

router.get('/fetchnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route-2: POST api/notes/addnote we add a note here, Login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // If there are errors then this returns a bad request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // here we create a new note

        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        })

        const savedNote = await note.save(); // .save() saves the note here
        res.json(savedNote);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route-3: PUT api/notes/updatenote we update a note here, Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // creating a notes object newNote

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated by finding it through it's id

        let notes = await Notes.findById(req.params.id);
        if(!notes){
            return res.status(404).send("Not found")
        }

        // check if the user logged in is updating their notes only and not other user's notes

        if(notes.user.toString() !== req.user.id){ // notes.user.toString extracts the user's id
            return res.status(401).send("Not allowed")
        }

        notes = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({notes});

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

// Route-4: DELETE api/notes/deletenote we delete a note here, Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be deleted by finding it through it's id

        let notes = await Notes.findById(req.params.id);
        if(!notes){
            return res.status(404).send("Not found")
        }

        // check if the user logged in is updating their notes only and not other user's notes

        if(notes.user.toString() !== req.user.id){ // notes.user.toString extracts the user's id
            return res.status(401).send("Not allowed")
        }

        notes = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been deleted", notes: notes});
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;