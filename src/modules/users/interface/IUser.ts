import { RolesEnum } from "src/common/enum/roles.enum";

export type User = {
    id_user: number;
    name: string;
    lastName: string;
    email: string;
    identificationDocument: number;
    phone: string;
    password: string;
    role: RolesEnum;
    status: boolean;
}