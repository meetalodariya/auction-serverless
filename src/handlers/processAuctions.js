import createHttpError from "http-errors";

import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuctions } from "../lib/closeAuctions";

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) =>
      closeAuctions(auction)
    );

    await Promise.all(closePromises);

    return { totalAuctionClosed: closePromises.length };
  } catch (err) {
    console.error(err);
    throw new createHttpError.InternalServerError(err);
  }
}

export const handler = processAuctions;
