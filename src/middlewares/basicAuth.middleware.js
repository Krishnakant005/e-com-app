import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. Check for the presence of the Authorization header
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  // 2. Extract the Base64-encoded credentials from the header
  const base64Credentials = authHeader.replace("Basic ", ""); // Remove the "Basic " prefix
  console.log(base64Credentials);
  // 3. Decode the Base64 string to get the original "username:password" format
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8",
  );
  console.log(credentials);
  // 4. Split the decoded string to separate the username and password
  const [username, password] = credentials.split(":");
  console.log(username, password);
  // 5. Validate the extracted username and password against your authentication logic
  const user = UserModel.getAllUsers().find(
    (user) => user.email === username && user.passsword === password,
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // If the user is found, proceed to the next middleware or route handler
  next();
};

export default basicAuthorizer;