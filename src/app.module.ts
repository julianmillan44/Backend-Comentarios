import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthModule } from './Healt/health.module'; // Corregido el path

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      // Opciones adicionales para mejorar la conexión
      retryWrites: true,
      w: 'majority',
    }),
    ProjectsModule,
    CommentsModule,
    ContactModule,
    HealthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

