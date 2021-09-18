import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createHttpError from "http-errors";
import cors from "@middy/http-cors";

import { setPicturesUrl } from "../lib/setPicturesUrl";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { getAuctionById } from "./getAuction";

const uploadAuctionPicture = async (event) => {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const { email } = event.requestContext.authorizer;

  if (auction.status !== "OPEN") {
    throw new createHttpError.Forbidden(
      "You cannot upload picture for a closed auction!"
    );
  }

  if (auction.seller !== email) {
    throw new createHttpError.Unauthorized("Unauthorized!");
  }

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    updatedAuction = await setPicturesUrl(auction, pictureUrl);
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ msg: "Success", updatedAuction }),
  };
};

export const handler = middy(uploadAuctionPicture).use([
  httpErrorHandler(),
  cors(),
]);
