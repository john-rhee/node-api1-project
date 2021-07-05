const express = require("express");

const db = require ("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({ api: "api is running..."})
})


//POST

server.post("/api/users", (req, res)=>{
    const reqData = req.body;

if (!reqData.name || !reqData.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."  });  
    }

else
    {
            db.insert(reqData)
        .then(para => {
            res.status(201).json(para);
        })
        .catch(err => {
            console.log("error on POST /api/users", err);
            res.status(500).json({ error: "There was an error while saving the user to the database"  });
        });
    }
});

//GET

server.get("/api/users", (req, res)=>{
    db.find()
    .then(database => {
        res.status(200).json(database);
    })
    .catch(error => {
        console.log("error on GET /api/users", error);
        res.status(500).json({error: "The users information could not be retrieved."})
    })
});

//GET BY ID

server.get("/api/users/:id", (req, res)=>{

    const id = req.params.id;

            db.findById(id)
            .then(database => {
              if (database) {
                res.status(200).json(database);
              }
              else{
                res.status(404).json({ message: "The user with the specified ID does not exist."  });  
              }
            })
            .catch(error => {
                console.log("error on GET /api/users/:id", error);
                res.status(500).json({ error: "The user information could not be retrieved."})
            })
       
});

//DELETE BY ID

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db.remove(id)
      .then(removed => {
        if (removed) {
          res.status(200).json({ message: "user removed successfully", removed });
        } else {
          // there was no hub with that id
          res.status(404).json({ message: "The user with the specified ID does not exist."  });
        }
      })
      .catch(error => {
        console.log("error on DELETE /api/users/:id", error);
        res.status(500).json({ errorMessage: "error removing the user" });
      });
  });

//PUT

server.put("/api/users/:id", (req, res)=>{
    const updateData = req.body;
    const id = req.params.id;

if (updateData.name && updateData.bio) {   

    db.update(id, updateData)
    .then(para => {
        if (para) {
        res.status(200).json(para);
        }
        else {
        res.status(404).json({ message: "The user with the specified ID does not exist."  });
        }
    })
    .catch(err => {
        console.log("error on PUT /api/users/:id", err);
        res.status(500).json({ error: "The user information could not be modified."  });
    });
  }

else  {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."  });  
    }

}); 

const port = 5000;
server.listen(port,()=>
console.log(`API running on port ${port}`)
);