import { setupSocketEvents } from "./events.js";

export const setupSocket = (io) => {
  setupSocketEvents(io);
};