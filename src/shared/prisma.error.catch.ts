import { HttpException, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export const catchNotFoundError = (e) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code == "P2025") {
        throw new HttpException(`Article not found!`, HttpStatus.NOT_FOUND);
      }
    }
    throw e;
  }