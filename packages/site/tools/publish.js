const AWS = require('aws-sdk')
const s3 = require('s3-node-client')

const { TARGET } = process.env

const deployConfig = require('./deploy-config.js')

const configTarget = deployConfig[TARGET]

const build = require('./build')
const task = require('./task')

const cloudfront = new AWS.CloudFront({
  accessKeyId: deployConfig.key,
  secretAccessKey: deployConfig.secret,
})

const s3Client = s3.createClient({
  maxAsyncS3: 20, // this is the default
  s3RetryCount: 3, // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: deployConfig.key,
    secretAccessKey: deployConfig.secret,
    region: 'ap-southeast-1',
    // endpoint: 's3.yourdomain.com',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
})

const uploadS3 = task('uploadS3', () => new Promise((resolve) => {
  const params = {
    localDir: './dist',
    deleteRemoved: true, // default false, whether to remove s3 objects
    // that have no corresponding local file.
    s3Params: {
      Bucket: deployConfig.s3Bucket,
      Prefix: configTarget.s3Prefix,
      ACL: 'public-read',
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },
  }
  const uploader = s3Client.uploadDir(params)
  uploader.on('error', (err) => {
    console.error('unable to sync:', err.stack)
  })
  uploader.on('progress', () => {
    console.log('progress', uploader.progressAmount, uploader.progressTotal)
  })
  uploader.on('end', () => {
    console.log('done uploading')
    resolve()
  })
}))

const invalidateCache = task('invalidateCache', () => {
  const now = new Date()
  const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}`
  return Promise.all(configTarget.cloudFrontDistIds.map(cloudfrontId => new Promise((resolve) => {
    return cloudfront.createInvalidation({
      DistributionId: cloudfrontId, /* required */
      InvalidationBatch: { /* required */
        CallerReference: key, /* required */
        Paths: { /* required */
          Quantity: 1, /* required */
          Items: ['/*'],
        },
      },
    }, (err, data) => {
      if (err) console.log(err, err.stack) // an error occurred
      else console.log(data) // successful response
      resolve()
    })
  })))
})

// Build and deploy the app to Firebase
module.exports = task('deploy', () => Promise.resolve()
  .then(() => build())
  .then(() => uploadS3())
  .then(() => invalidateCache())
  .then(() => { setTimeout(() => process.exit(), 3000) }))
