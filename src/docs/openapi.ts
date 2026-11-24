export const openapiDefinition = {
    openapi: "3.0.3",
    info: {
        title: "Учебный магазин — Express API",
        version: "1.0.0",
        description: "CRUD на MongoDB. Все цены в копейках. Используйте только вымышленные учебные данные.",
    },
    servers: [{ url: "/" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Передавайте access token в заголовке Authorization: Bearer <token>.",
            },
        },
        responses: {
            Unauthorized: {
                description: "Отсутствующий или недействительный токен",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                error: { type: "string", example: "Передайте правильный токен" },
                            },
                        },
                    },
                },
            },
        },
    },
};
