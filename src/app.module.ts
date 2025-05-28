import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthModule } from './Healt/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb+srv://julianocampomillan19:b7fuLqCRHQcFh4sM@byteclean.d5hibcf.mongodb.net/comentarios-db?retryWrites=true&w=majority',
      {
        // Configuraciones específicas para MongoDB Atlas
        retryWrites: true,
        w: 'majority',
      }
    ),
    ProjectsModule,
    CommentsModule,
    ContactModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}