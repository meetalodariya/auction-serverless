import auctionsTableClient from "./auctionsTableClient";

export const setPicturesUrl = async (auction, pictureUrl) => {
  const params = {
    Key: { id: auction.id },
    UpdateExpression: "set pictureUrl = :pictureUrl",
    ExpressionAttributeValues: {
      ":pictureUrl": pictureUrl,
    },
  };

  return auctionsTableClient.update(params).promise();
};
