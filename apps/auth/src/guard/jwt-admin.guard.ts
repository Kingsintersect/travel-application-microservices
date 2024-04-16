import { ExecutionContext, Injectable, UnauthorizedException, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../types/payload.type";


@Injectable()
export class JwtAdminGuard extends AuthGuard("jwt") {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException("Cant gain access with invalid credentials");
        }
        if (user.userRole) { return user }
        else { throw err || new UnauthorizedException("Access is denied User"); }
    }
}