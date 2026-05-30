import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  //1. read the token from the Authorization header
  const authHeader = req.headers["authorization"];  
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim(); 
     // Remove the "Bearer " prefix if it exists
  console.log(token);
  //2. if no token is present, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //3. if token is present, verify it using the same secret key used for signing
  try {
    const payload = jwt.verify(token, "mySuperSecretJWTKey123");
    req.userID= payload.userID; // Attach the user ID from the payload to the request object
    console.log(payload);
    req.user = payload; // Attach the decoded user information to the request object
  } catch (error) {
    //4. if the token is invalid or expired, return 401 Unauthorized
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  //5. call the next middleware or router handler if the token is valid
  next();
};
export default jwtAuth; 