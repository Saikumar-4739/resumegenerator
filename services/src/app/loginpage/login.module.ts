import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { JwtModule } from "@nestjs/jwt";
import { Login_Repo } from "./repo/login.repo";
import { LoginEntity } from "./login.entities";
import { LoginService } from "./login.services";


@Module({
    imports:[
        TypeOrmModule.forFeature([LoginEntity]),

        JwtModule.register({
            secret:'secret',
            signOptions:{expiresIn:'1d'},
          })
    ],
    providers:[LoginService,Login_Repo],
    controllers:[LoginController],
    
    
})

export class LoginModule{}