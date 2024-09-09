import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { LoginEntity } from "../login.entities";


@Injectable()
export class Login_Repo extends Repository<LoginEntity>
{
    constructor(private dataSource:DataSource)
    {
        super(LoginEntity,dataSource.createEntityManager())
    }
}