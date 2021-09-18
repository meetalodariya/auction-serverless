import createHttpError from "http-errors";

import commonMiddleware from "../lib/commonMiddleware";
import auctionsTableClient from "../lib/auctionsTableClient";

export async function getAuctionById(id) {
  let auction;

  try {
    const result = await auctionsTableClient
      .get({
        Key: { id },
      })
      .promise();
    auction = result.Item;
  } catch (err) {
    console.log(err);
    throw new createHttpError.InternalServerError(err);
  }

  if (!auction) {
    throw new createHttpError.NotFound(`Auction with ID "${id}" not found!`);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
