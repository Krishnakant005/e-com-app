import fs from "fs";
import winston from "winston";
//import winston from 'winston/lib/winston/config';

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});
// async function log(logData){
//     try {
//         logData= new Date().toISOString() + " " + logData;
//         logger.info(logData);
//     } catch (error) {
//         console.error('Error writing to log file:', error);
//     }
// }

// const fsPromise = fs.promises;
// async function log(logData){
//     try {
//         logData= new Date().toISOString() + " " + logData + "\n";
//         await fsPromise.appendFile('logs.txt', logData);
//     } catch (error) {
//         console.error('Error writing to log file:', error);
//     }
// }
const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signin")) {
    const logData = `${req.url}- ${JSON.stringify(req.body)}`;
    // await log(logData);
    logger.info(logData);
  }
  next();
};
export default loggerMiddleware;
