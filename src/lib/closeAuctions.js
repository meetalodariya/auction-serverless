import AWS from "aws-sdk";
import auctionsTableClient from "./auctionsTableClient";

const sqs = new AWS.SQS();

export async function closeAuctions(auction) {
  const params = {
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  await auctionsTableClient.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "You won an auction!",
        recipient: bidder,
        body: `What a great deal! You got yourself a "${title}" for $${amount}.`,
      }),
    })
    .promise();

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Your item has been sold!",
        recipient: seller,
        body: `Your Item "${title}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  return Promise.all([notifyBidder, notifySeller]);
}
