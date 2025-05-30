import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  // jadi per user , jadi kalau fabi yang di block yang lain tidak akan di block
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Error in rateLimiter middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default rateLimiter;
