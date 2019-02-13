var aws = require('aws-sdk'),
    ASQ = require('asynquence-contrib');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY, // id
    AWS_SECRET_KEY = process.env.AWS_SECRET_KEY, // secret
    S3_BUCKET = process.env.S3_BUCKET;

// For uploads (both misc and logos)
var getSignedUrl = function(filePath, fileType) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var key = "images/" + filePath;
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
  };

  return ASQ(function _getSignedUrl(done) {
    s3.getSignedUrl('putObject', s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        var returnData = {
          signed_request: data,
          url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + key
        };
        done(returnData);
      }
    });
  });

};

var getObject = function(filePath) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: filePath
  };

  return ASQ(function _getSignedUrl(done) {
    s3.getSignedUrl('getObject', s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        var returnData = {
          signed_request: data,
          url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + filePath
        };
        done(returnData);
      }
    });
  });
};

var deleteObject = function(filePath) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var key = "images/" + filePath;
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: key
  };

  return ASQ(function _deleteObject(done) {
    s3.deleteObject(s3Params, function(err, result) {
      if(err){
        done.fail(err);
      } else {
        done(result);
      }
    });
  });
};


module.exports = {
  getSignedUrl: getSignedUrl,
  deleteObject: deleteObject,
  getObject: getObject
};
