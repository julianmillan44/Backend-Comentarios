import { Document } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    name: string;
    email: string;
    message: string;
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any> & Comment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
