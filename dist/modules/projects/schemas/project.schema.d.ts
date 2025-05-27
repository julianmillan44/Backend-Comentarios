import { Document } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare class Project {
    title: string;
    description: string;
    shortDescription?: string;
    technologies: string[];
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any> & Project & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}> & import("mongoose").FlatRecord<Project> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
