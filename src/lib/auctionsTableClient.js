import AWS from "aws-sdk";

export default new AWS.DynamoDB.DocumentClient({
  params: { TableName: process.env.AUCTIONS_TABLE_NAME },
});
