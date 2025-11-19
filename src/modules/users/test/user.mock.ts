import { RolesEnum } from "src/common/enum/roles.enum";

export const userMock = {
    id_user: 1,
    name: "Johana",
    lastName: "Jimenez",
    email: "johana@gmail.com",
    identificationDocument: 123456789,
    phone: "3001234567",
    password: "123",
    role: RolesEnum.USER,
    status: true,
    appointments: []
};

