import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import orderMock from "./mock/order";
import userMock from "./mock/user";
import roleMock from "./mock/role";
// import freightMock from "./mock/freight";
import inventoryMock from "./mock/inventory";

export const mockModules = [
  ...orderMock,
  ...userMock,
  ...roleMock,
  // ...freightMock,
  ...inventoryMock,
];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}