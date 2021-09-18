import createHttpError from "http-errors";
import validator from "@middy/validator";

import commonMiddleware from "../lib/commonMiddleware";
import { getAuctionById } from "./getAuction";
import auctionsTableClient from "../lib/auctionsTableClient";
import placeBidSchema from "../lib/schemas/placeBidSchema";

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  if (auction && auction.highestBid.bidder === email) {
    throw new createHttpError.Forbidden(
      `You can't bid twice on the same auction`
    );
  }

  if (auction && auction.seller === email) {
    throw new createHttpError.Forbidden(
      `You can't bid on the auction that you've created`
    );
  }

  if (auction.status !== "OPEN") {
    throw new createHttpError.Forbidden("You cannot bid on closed auctions");
  }

  if (auction && amount <= auction.highestBid.amount) {
    throw new createHttpError.Forbidden(
      `Your bid must be highter than ${auction.highestBid.amount}`
    );
  }

  let updatedAuction;

  const params = {
    Key: { id },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await auctionsTableClient.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (err) {
    console.log(err);
    throw new createHttpError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
);
