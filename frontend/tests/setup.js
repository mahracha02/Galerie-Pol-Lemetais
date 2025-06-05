import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Make Jest functions available globally
global.jest = jest;
global.describe = describe;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.beforeEach = beforeEach;
global.test = test;
global.expect = expect; 