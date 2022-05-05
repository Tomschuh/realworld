import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [ArticleModule, AuthModule, UserModule, ProfileModule, TagModule],
})
export class ApiModule {}
