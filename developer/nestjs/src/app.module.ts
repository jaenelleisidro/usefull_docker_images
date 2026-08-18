import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { PrismaService } from "./prisma.service.js"; 
import { UserService } from "./user.service.js"; 
import { PostService } from "./post.service.js"; 

@Module({
  imports: [TerminusModule,ConfigModule.forRoot()],
  controllers: [AppController,HealthController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}

