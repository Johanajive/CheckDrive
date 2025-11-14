import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    /**
     * canActivate: Verifica si el usuario tiene los roles necesarios
     * para acceder a la ruta solicitada.
     * Utiliza metadata definida con el decorador @Roles().
     * 
     * @param context { ExecutionContext } - Contexto de ejecución.
     * @returns { boolean } true si el usuario tiene permiso.
     * @throws ForbiddenException si no está autenticado o no tiene rol permitido.
     */
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user) throw new ForbiddenException ('Usuario no autenticado');

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException ('No tiene permiso para acceder a este ruta');
        }

        return true;
    }
}
