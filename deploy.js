
var colors = require('colors')
  , convict = require('convict')
  , config = convict({ key: { env: 'AWS_KEY'
      , default: null
      , format: String
      }
    , secret: { env: 'AWS_SECRET'
      , default: null
      , format: String
      }
    })

config.validate()

var powerwalk = require('powerwalk')
  , s3 = require('knox').createClient({ key: config.get('key')
    , secret: config.get('secret')
    , bucket: 'artifact.sh'
    , region: 'us-west-1' // remove this to simulate an error
    })

// TODO: check for things to delete
powerwalk('./build')
.on('error', function(err){ throw err })
.on('stat', beam)
.on('end', finish)

function beam(file){
  console.log('uploading'.yellow, url(file.filename))

  var fs = require('graceful-fs')
    , mime = require('mime')
    , req = s3
      .put(url(file.filename), { 'content-length': file.stats.size
        , 'content-type': mime.lookup(file.filename)
        , 'x-amz-acl': 'public-read'
        })

  fs
  .createReadStream(file.filename)
  .pipe(req)

  req.on('response', function(res){
    var body = ''
    console.log('res.statusCode', res.statusCode)
    console.log('res.headers', res.headers)
    res.setEncoding('utf8')
    res
    .on('data', function(data){
      body += data
    })
    .on('end', function(){
      console.log('body', body)
    })


  })
}

function finish(){
  // list bucket things and delete them if they dont' match wha'ts in the build
  // directory
}

function url(file){
  return file.replace('build', '')
}
