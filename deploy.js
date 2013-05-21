
/*

# TODO:

* gzipping
* cache-control headers
* track objects and see if there is a mismatch for deleting
* md5s for tracking what has been sent and what hasn't?
* error recovery (back off)
* expose mime look up and addition

Create module out of this file

*/

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
  , current = []

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
  var fs = require('graceful-fs')
    , mime = require('mime')
    , _url = url(file.filename)
    , req = s3
      .put(_url, { 'content-length': file.stats.size
        , 'content-type': mime.lookup(file.filename)
        , 'x-amz-acl': 'public-read'
        })

  console.log('uploading'.yellow, _url)

  current.push(_url)

  fs
  .createReadStream(file.filename)
  .pipe(req)

  // req.on('response', function(res){
  //   var body = ''
  //   // console.log('res.statusCode', res.statusCode)
  //   // console.log('res.headers', res.headers)
  //   res.setEncoding('utf8')
  //   res
  //   .on('data', function(data){
  //     body += data
  //   })
  //   .on('end', function(){

  //   })
  // })
}

function finish(){
  // list bucket things and delete them if they dont' match what's in the
  // build directory

  s3.list(function(err, list){
    if (err) throw(err)

    console.log('checking for things that need to deleted'.yellow)

    console.log('list', list)

    var zap = list['Contents'].map(function(obj){
      // see if key is not in the list
      if (current.indexOf(obj.key) === -1) return obj.key
    }).filter(function(o){ return o })

    console.log('zap', zap)

    if (zap.length === 0) return console.log('nothing to delete'.yellow)
  })

  // client.list({ prefix: 'my-prefix' }, function(err, data){
  //    `data` will look roughly like:

  //   {
  //     Prefix: 'my-prefix',
  //     IsTruncated: true,
  //     MaxKeys: 1000,
  //     Contents: [
  //       {
  //         Key: 'whatever'
  //         LastModified: new Date(2012, 11, 25, 0, 0, 0),
  //         ETag: 'whatever',
  //         Size: 123,
  //         Owner: 'you',
  //         StorageClass: 'whatever'
  //       },
  //       ⋮
  //     ]
  //   }
  // })
}

function url(file){
  return file.replace('build/', '')
}
