import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const uploadPictureToS3 = async (key, body) => {
  const result = await s3
    .upload({
      Bucket: process.env.AUCTIONS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();

  return result.Location;
};
