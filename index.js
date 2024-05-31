const express = require("express");
const cors = require("cors");
const ConnectToDB = require("./Config/config");
const NotesRoute = require("./routes/notes");
const UserRoute = require("./routes/users");
const authenticate = require("./middleware/AuthenticateUser");

const app = express();
ConnectToDB();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.use("/", UserRoute);
app.use("/", authenticate, NotesRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
