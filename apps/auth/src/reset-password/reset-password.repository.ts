import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { AbstractRepository } from "@app/common";
import { PasswordReset } from "./schema/password-reset.schema";

@Injectable()
export class PasswordResetRepository extends AbstractRepository<PasswordReset> {
    protected readonly logger = new Logger(PasswordResetRepository.name);

    constructor(
        @InjectModel(PasswordReset.name) PasswordResetModel: Model<PasswordReset>,
        @InjectConnection() connection: Connection
    ) {
        super(PasswordResetModel, connection);
    }
}