import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

  try {

    // Get token from cookies

    const token = req.cookies.token;

    console.log("Token from cookies:", token);

    // Check if token exists

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Verify token

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // console.log("decoded user: ",decoded)

    // Attach user data to request object

    req.user = decoded;



    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};



export default authMiddleware;