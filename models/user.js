var User = function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
     username: String,
     email: String,
     name: String,
     hometown: String,
     gender: String,
     photo: String,
     occupation: String
  });

  var model = mongoose.model('user', userSchema);

  return {schema: userSchema,
          model: model};
}();

module.exports = User;
