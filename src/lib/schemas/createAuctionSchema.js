const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      nullable: false,
      required: ["title"],
      properties: {
        title: {
          type: "string",
        },
      },
    },
  },
  required: ["body"],
};

export default schema;
