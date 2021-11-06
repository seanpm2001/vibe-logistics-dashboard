import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import testMock from "./mock/test";
import userMock from "./mock/user";
import roleMock from "./mock/role";

export const mockModules = [
  ...testMock,
  ...userMock,
  ...roleMock
];

export function setupProdMockServer() {
  console.log('mockModules: ', mockModules);
  createProdMockServer(mockModules);
}