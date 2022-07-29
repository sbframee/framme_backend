const aws = require("aws-sdk");
const { v4: uuid } = require("uuid");
const region = "ap-south-1";
const bucketName = "uploadframee";
const accessKeyId = "AKIAV4F7GLME6WOSL4EC";
const secretAccessKey = "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";

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const generateUploadURL = async () => {
  const imageName = uuid();
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };
  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};

module.exports = generateUploadURL;
