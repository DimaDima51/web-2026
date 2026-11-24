import swaggerJSDoc from "swagger-jsdoc";
import { openapiDefinition } from "../docs/openapi.ts";

const options = {
    failOnErrors: true,
    definition: {
        ...openapiDefinition,
        components: {
            ...openapiDefinition.components,
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
                Product: {
                    type: "object",
                    required: ["name", "price"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Клавиатура",
                        },
                        description: {
                            type: "string",
                            example: "Механическая клавиатура",
                        },
                        price: {
                            type: "integer",
                            minimum: 0,
                            example: 4990,
                        },
                        stock: {
                            type: "integer",
                            minimum: 0,
                            example: 10,
                        },
                    },
                },
                Order: {
                    type: "object",
                    required: ["user", "items"],
                    properties: {
                        user: {
                            type: "string",
                            description: "Идентификатор пользователя",
                        },
                        items: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                required: ["product", "quantity"],
                                properties: {
                                    product: { type: "string", description: "Идентификатор товара" },
                                    quantity: { type: "integer", minimum: 1, example: 2 },
                                    unitPrice: { type: "integer", readOnly: true },
                                },
                            },
                        },
                        status: {
                            type: "string",
                            enum: ["new", "processing", "completed", "cancelled"],
                            example: "new",
                        },
                        total: {
                            type: "integer",
                            minimum: 0,
                            readOnly: true,
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routers/*.ts"],
};

export const openapiSpecification = swaggerJSDoc(options);