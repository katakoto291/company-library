import type { PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'

import prisma from '@/libs/prisma/client'

jest.mock('@/libs/prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

afterEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
