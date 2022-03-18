import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import userMock from './user';
import logisticMock from './logistic';

export const mockModules = [
  ...logisticMock,
  ...userMock,
];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
