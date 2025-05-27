import { Document } from 'mongoose';
export type ContactDocument = ContactMessage & Document;
export declare class ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: Date;
}
export declare const ContactSchema: import("mongoose").Schema<ContactMessage, import("mongoose").Model<ContactMessage, any, any, any, Document<unknown, any, ContactMessage, any> & ContactMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ContactMessage, Document<unknown, {}, import("mongoose").FlatRecord<ContactMessage>, {}> & import("mongoose").FlatRecord<ContactMessage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
