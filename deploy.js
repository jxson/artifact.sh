
var colors = require('colors')
  , powerwalk = require('powerwalk')
  , aws = require('aws-sdk')
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

// configuration is in env vars
aws.config.update({ accessKeyId: config.get('key')
, secretAccessKey: config.get('secret')
})

powerwalk('./build')
.on('error', function(err){ throw err })
.on('read', beam)
.on('end', finish)

function beam(file){
  console.log('sending file'.yellow, file.filename)
}

function finish(){
  // list bucket things and delete them if they dont' match wha'ts in the build
  // directory
}
