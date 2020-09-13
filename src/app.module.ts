import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ConfigModule.forRoot(), TodoModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
