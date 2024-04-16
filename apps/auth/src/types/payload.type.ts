import { Types } from "mongoose";

export interface PayloadType {
    email: string;
    _id: Types.ObjectId;
    userRole?: string;
}