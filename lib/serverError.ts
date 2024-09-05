import { error } from "console";

export const uncaughtException = () =>
  process.on("uncaughtException", (error) => {
    console.error(`uncaughtException --- ${error.name} ----- ${error.message}`);
    process.exit(1);
  });

export const unhandledRejection = (server: any) =>
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    let time = 5;
    const interval = setInterval(() => {
      console.info(`server will close in ${time}`);
      time--;
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      server.close(() => {
        console.log("Server closed gracefully.");
        process.exit(1);
      });
    }, 5000);
  });
