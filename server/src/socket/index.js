import { setupSocketEvents } from "./events.js";
import { socketAuthMiddleware } from "../middlewares/auth.middleware.js";

export const setupSocket = (io) => {
  io.use(socketAuthMiddleware);
  setupSocketEvents(io);
};
