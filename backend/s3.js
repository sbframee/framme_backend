const aws = require("aws-sdk");
const { v4: uuid } = require("uuid");
const region = "ap-south-1";
const bucketName = "framme-media";
const accessKeyId = "AKIA5GXQUKAU5IXTRQGS";
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

