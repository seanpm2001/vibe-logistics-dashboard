import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import userMock from "./user";
import roleMock from "./role";
import logisticMock from "./logistic";

export const mockModules = [
  ...logisticMock,
  ...userMock,
  ...roleMock,
];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
