import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { AcademicModule } from './academics/academics.module';
import { ExperienceModule } from './experience/experience.module';
import { SkillModule } from './skills/skills.module';
import { PersonalDetailsModule } from './personal-details/personal-details.module';
import { ImageModule } from './image/image.module';




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '',
      port: 3306,
      database: 'resume_generator',
      synchronize: false,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AddressModule,
    AcademicModule,
    ExperienceModule,
    SkillModule,
    PersonalDetailsModule,
    ImageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
