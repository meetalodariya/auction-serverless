import { v4 as uuid } from "uuid";
import createHttpError from "http-errors";
import validator from "@middy/validator";

import commonMiddleware from "../lib/commonMiddleware";
import auctionsTableClient from "../lib/auctionsTableClient";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";

async function createAuction(event, context) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;
  const endDate = new Date();
  endDate.setHours(new Date().getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    highestBid: {
      amount: 0,
    },
    endingAt: endDate.toISOString(),
    seller: email,
  };

  try {
    await auctionsTableClient
      .put({
        Item: auction,
      })
      .promise();
  } catch (err) {
    console.log(err);
    throw new createHttpError.InternalServerError(err);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
