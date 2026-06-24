import swaggerJSDoc from "swagger-jsdoc"

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MonSuiviAuto API",
      version: "1.0.0",
      description: "API de suivi d'entretien automobile — gestion des véhicules, entretiens, rappels, documents et administration.",
    },
    servers: [{ url: "http://localhost:4000", description: "Serveur local" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.route.ts"],
})

export { swaggerSpec }
