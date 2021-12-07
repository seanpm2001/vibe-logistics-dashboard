import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import testMock from "./mock/test";
import userMock from "./mock/user";
import roleMock from "./mock/role";
import freightMock from "./mock/freight";
import warehouseMock from "./mock/warehouse";

export const mockModules = [
  ...testMock,
  ...userMock,
  ...roleMock,
  ...freightMock,
  ...warehouseMock,
];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}