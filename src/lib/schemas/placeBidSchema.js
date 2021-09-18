const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      nullable: false,
      required: ["amount"],
      properties: {
        amount: {
          type: "integer",
        },
      },
    },
    pathParameters: {
      type: "object",
      nullable: false,
      required: ["id"],
      properties: {
        id: {
          type: "string",
        },
      },
    },
  },
  required: ["pathParameters", "body"],
};

export default schema;
