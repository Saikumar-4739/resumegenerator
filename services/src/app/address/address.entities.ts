import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('address')
export class AddressEntities{
    @PrimaryGeneratedColumn ('increment',{
        name: 'address_id',
    })
    addressId: number;

    @Column({name: 'userid'})
    userId: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    zipcode: string;
}
