const pool = require("../config/connection");

const requestStore = new Map();

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per IP

const trackAndBlockMiddleware = async (req, res, next) => {

    if (req.path.includes("detect-country")) {
        return next();
    }

    try {
        let ip =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.headers["x-real-ip"] ||
            req.socket?.remoteAddress ||
            req.ip;

        // Remove IPv6 prefix if present
        if (ip && ip.includes("::ffff:")) {
            ip = ip.replace("::ffff:", "");
        }

        const ALLOWED_IP = "157.250.202.114";

        const isAllowed = ip === ALLOWED_IP;
        if (isAllowed) {
            return next();
        }

        /** Rate limiting per minute per IP 100 requests */

        /*
        const currentTime = Date.now();
        const existing = requestStore.get(ip);

        if (!existing) {
            requestStore.set(ip, {
                count: 1,
                startTime: currentTime
            });
        } else {

            if (currentTime - existing.startTime < WINDOW_SIZE) {
                existing.count++;

                console.log("existing.count>> ", existing.count);

                if (existing.count > MAX_REQUESTS) {
                    return res.status(429).json({
                        success: false,
                        message: "Too many requests from this IP"
                    });
                }

            } else {
                requestStore.set(ip, {
                    count: 1,
                    startTime: currentTime
                });
            }
        }

        // if (req.path.includes("detect-country")) {
        //     return next();
        // }
        */

        // Optional: log request to DB
        await pool.query(
            `INSERT INTO roh_backend_request_tracking
            (ip_address, browser, route, method)
            VALUES (?, ?, ?, ?)`,
            [
                ip,
                req.headers["user-agent"],
                req.originalUrl,
                req.method,
                // isAllowed ? 0 : 1,
            ]
        );

        // if (!isAllowed) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Access restricted."
        //     });
        // }

        next();

    } catch (err) {
        console.error("Middleware error:", err.message);
        next();
    }
};

module.exports = trackAndBlockMiddleware;