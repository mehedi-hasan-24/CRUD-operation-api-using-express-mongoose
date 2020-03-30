const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());


mongoose.connect('mongodb://localhost/crud', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) console.log(err);
    else console.log('connected');
});



//defining Schema
var personSchema = new Schema ({
  name : String,
  email : String
});

//Creating a model of personSchema
const personModel = mongoose.model('person', personSchema);

//Create
app.post('/persons' , function (req, res) {
  console.log(req.body);
  personModel.create(req.body, function(err, result){
    if(err) res.send(err);
    else res.send("inserted data\n" + result);
  });
  });

  //Read
app.get('/persons', function(req, res){
  personModel.find({}, function(err, result){
    if(err) res.send(err);
    else res.send(result);
  })
});


//Update
app.put('/persons/:id', function(req, res){
  console.log(req.params.id);
  personModel.findById(req.params.id, function(err, result){
    if(err) return res.send('ID doesn\'t found\nTo get ID of all records please send a get request to /persons');
    else 
    {
      personModel.findOneAndUpdate(
        {_id: req.params.id},                            //query parameter
        {$set : {name : req.body.name, email: req.body.email}},  //set up parameter
        {upsert: true},                   //options
        function(err, result){            //callback function
          if(err) res.send("Please! Try to update with an ID.\n To get ID of all records please send a get request to /persons");
          else res.send('Updated the record of ID: '+ req.params.id+' with \n'+ "Name = " +req.body.name + "\n" + "E-mail = " + req.body.email);
    
      });
    
    }
  })

  
});


//Delete
app.delete('/persons/:id', function(req, res){
  console.log(req.params.id);
  personModel.findById(req.params.id, function(err, result){
    if(err) return res.send('ID doesn\'t found\nTo get ID of all records please send a get request to /persons');
    else
    {
      personModel.deleteOne(
        {_id: req.params.id}, 
        function(err){
          if(err) res.send("Please! Try to delete with an ID.\n To get ID of all records please send a get request to /persons");
          else res.send('Deleted the record of ID: '+ req.params.id);
        }
      )
    }

  });
  
});




  app.get('/', (req, res) => res.send('thikThak ache'));


  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  