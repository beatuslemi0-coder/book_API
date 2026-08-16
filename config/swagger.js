const { version } = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Book API",
            version: "1.0.0",
            description: "Book Management API"
        },
        servers: [
            {
                url: "https://book-api-ejt0.onrender.com"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ]
    },
    apis: ["./routes/*.js"]
};
const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;