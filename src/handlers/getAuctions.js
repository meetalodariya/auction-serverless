import createHttpError from "http-errors";
import validator from "@middy/validator";

import commonMiddleware from "../lib/commonMiddleware";
import auctionsTableClient from "../lib/auctionsTableClient";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":status": status,
    },
  };

  try {
    const result = await auctionsTableClient.query(params).promise();

    auctions = result.Items;
  } catch (err) {
    console.log(err);
    throw new createHttpError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema })
);
