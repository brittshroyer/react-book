var express = require('express');
var router = express.Router();
var User = require('../models/user');
var s3 = require('../services/s3');
var ASQ = require('asynquence');

router.get('/autocomplete', function(req, res) {
  var query = req.query.searchQuery,
      payload = {};

  // case insensitive search for username and name fields
  User.model.find({$or:[{"username" :{ $regex: query, $options : 'i'} }, {"name" :{ $regex: query, $options : 'i' } } ]}, function(err, users) {
    if (err) {
      return res.status(400).send(err);
    } else {
      payload.users = users;
      return res.status(200).send(payload);
    }
  });

});

router.get('/validateUsername', function(req, res) {
  var query = req.query.searchQuery,
      payload = {};

  User.model.findOne( { username : query }, function(err, doc) {
    if (err) {
      return res.status(400).send(err);
    } else {
      payload.result = doc;
      return res.status(200).send(payload);
    }
  });
});

router.get('/photo', function(req, res) {
  var fileName = req.query.file_name,
      fileType = req.query.file_type.toString(),
      payload = {};

  s3.getSignedUrl(fileName, fileType).then(function(done, result) {
    res.status(200).send(result);
  }).or(function(err) {
    res.status(400).send(err);
  });

});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  User.model.find({}, function(err, users) {
    if (err) {
      return res.status(500).send({error: err});
    } else {
      if (users.length > 0) {
        res.send({users: users});
      } else {
        res.send({users: []});
      }
    }
  });
});

router.get('/:username', function(req, res, next) {
  var username = req.params.username;

  User.model.findOne({username}, function(err, user) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(user);
    }
  });

});


router.get('/users/deletePhoto', function(req, res) {
  var photo = req.query.photo,
      payload = {};
      fileName = photo.split('images/')[1];

  s3.deleteObject(fileName).then(function(err, result) {
    console.log('result', result);
    return res.status(200).send(result);
  });
});

router.post('/create', function(req, res, next) {
  var payload = {},
      model = req.body.model;

  User.model.create(model, function(err, doc) {
    if (err) {
      console.log('err', err);
      payload.error = err;
      res.status(400).send(payload);
    } else {
      payload.user = doc;
      res.status(200).send(payload);
    }
  });
});

router.put('/:username', function(req, res, next) {
  var username = req.params.username,
      data = req.body.data;

  User.model.findOneAndUpdate({username}, data, { upsert: true }, function(err, user) {
    if (err) {
      console.error('err', err);
      res.status(400).send(err);
    } else {
      res.status(200).send(user);
    }
  });
});

module.exports = router;
