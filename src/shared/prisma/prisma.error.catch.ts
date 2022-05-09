import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const catchPrismaNotFoundError = (e: Prisma.PrismaClientKnownRequestError) => {
  if (e.code == 'P2025') {
    throw new HttpException(`Entity not found!`, HttpStatus.NOT_FOUND);
  }
  throw e;
};
