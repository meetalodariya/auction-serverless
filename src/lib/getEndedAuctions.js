import auctionsTableClient from "./auctionsTableClient";

export async function getEndedAuctions() {
  const params = {
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const results = await auctionsTableClient.query(params).promise();

  return results.Items;
}
