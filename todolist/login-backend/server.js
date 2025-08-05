const express = require("express"); // express is a package that can help build servers with a few lines of code
const fs = require("fs"); // fs is used to read files
const cors = require("cors"); // cors stands for Cross-Origin Resource Sharing which allows React (Port 3000) to talk to this backend (Port 5000)

//Creating the server app
const app = express();
const PORT = 5000;

app.use(cors()); //accept requests from port 3000
app.use(express.json()); //understand JSON data that would be sent by React

app.post("/login", (req, res) => {
  // this is basically saying: "when someone sends a POST request to /login, run this function"
  const { username, password } = req.body; //getting the username and password from the request.body
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8")); //reads the users.json file and loads all the user info
  const user = users.find((u) => u.username === username); //searches the list for someone with the same username

  if (!user) {
    //if user doesn't exist or password is wrong, then reject it
    return res.status(401).json({ success: false, message: "User not Found" });
  }

  if (user.password !== password) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect Password" });
  }

  return res.json({ success: true, message: "Login successful!" });
});

//Starting the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
