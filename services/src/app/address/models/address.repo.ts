import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AddressEntities } from "../address.entities";

@Injectable()
export class AddressRepo extends Repository <AddressEntities> {
    constructor(private datasource: DataSource) {
        super(AddressEntities, datasource.createEntityManager());
    }
}