import { emitArgs } from "./socket-io";

export const globalLog = (...args: any[]) => {
  console.log("Global log recieved:", ...args);
  emitArgs("console_message", ...args);
};
