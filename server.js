// Set Up ======================================================================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

// Configuration ===============================================================

mongoose.connect('mongodb://localhost:27017/todo-node');
// var db = mongo.db("mongodb://localhost:27017/todo-node", {native_parser:true});

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
})

// Model Schema ================================================================

var Todo = mongoose.model('Todo', {
  title : String,
  text : String
});

// Routes ======================================================================

  // API
  app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
      if (err) { res.send(err) };
      res.json(todos);
    });
  });

  app.post('/api/todos', function(req, res) {
    Todo.create({
      title : req.body.title,
      text : req.body.text,
      done : false
    }, function(err, todo) {
      if (err) { res.send(err) };
      Todo.find(function(err, todos) {
        if (err) { res.send(err) };
        res.json(todos);
      });
    });
  });

  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id : req.params.todo_id
    }, function(err, todo) {
      if (err) { res.send(err) };
      Todo.find(function(err, todos) {
        if (err) { res.send(err) };
        res.json(todos);
      });
    });
  });

  // Application ===============================================================
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

// Listen ======================================================================

app.listen(3000);
console.log("App listening on port 3000");
