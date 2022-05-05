import {
  HttpException,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Logging
  // constructor() {
  //     super({
  //         log: [
  //             { emit: 'event', level: 'query' },
  //             { emit: 'stdout', level: 'info' },
  //             { emit: 'stdout', level: 'warn' },
  //             { emit: 'stdout', level: 'error' },
  //           ]
  //     })
  // }
  constructor() {
    super({
      rejectOnNotFound: {
        findUnique: (err) => new HttpException('Entity not found!', 404),
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
