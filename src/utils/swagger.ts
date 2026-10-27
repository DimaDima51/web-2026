import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web-technologies project 2026",
            version: "1.0.0",
        },
        components: {
            schemas: {
                User: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Ivan",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "ivan@mail.ru",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routers/*.ts"],
};

export const openapiSpecification = swaggerJSDoc(options);