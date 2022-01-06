import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import userMock from "./mock/user";
import roleMock from "./mock/role";
import logisticMock from "./mock/logistic";
// import freightMock from "./mock/freight";
import inventoryMock from "./mock/inventory";

export const mockModules = [
  ...logisticMock,
  ...userMock,
  ...roleMock,
  // ...freightMock,
  ...inventoryMock,
];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}