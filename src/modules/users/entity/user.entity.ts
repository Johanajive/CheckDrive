import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "src/common/enum/roles.enum";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    identificationDocument: number;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: RolesEnum.USER})
    role: RolesEnum;

    @Column({ nullable: false, default: true })
    @Exclude()
    status: boolean;

}