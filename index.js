
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads",
    express.static(path.join(__dirname, "uploads"))
);
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/books",bookRoutes);
app.use("/users",userRoutes);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.get("/",(req,res) => {
    res.send("Book API is Running...");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});