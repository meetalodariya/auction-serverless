const schema = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      nullable: true,
      properties: {
        status: {
          type: "string",
          enum: ["OPEN", "CLOSED"],
          default: "OPEN",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

export default schema;
