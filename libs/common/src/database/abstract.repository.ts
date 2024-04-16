import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery, SaveOptions, Connection, FlattenMaps } from "mongoose";
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly model: Model<TDocument>, private readonly connection: Connection,) {

    }

    async create(document: Omit<TDocument, '_id'>, options?: SaveOptions): Promise<TDocument> {
        const createDocument = new this.model({
            ...document, _id: new Types.ObjectId(),
        });
        return (
            await createDocument.save(options)
        ).toJSON() as unknown as TDocument;
    }

    async checkExistence(filterQuery: FilterQuery<TDocument>): Promise<FlattenMaps<TDocument>> {
        return await this.model.findOne(filterQuery, {}, { lean: true });
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<FlattenMaps<TDocument>> {

        const document = await this.model.findOne(filterQuery, {}, { lean: true });

        if (!document) {
            this.logger.warn("Document not found with filterQuery", filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }

    // consoleLogMyActivity(warn_message,) {

    // }

    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, { lean: true, new: true });

        if (!document) {
            this.logger.warn(`Document not found With filterquery`, filterQuery);
            throw new NotFoundException(`Document not found.`);
        }

        return document;
    }

    async upsert(filterQuery: FilterQuery<TDocument>, document: Partial<TDocument>) {
        return this.model.findOneAndUpdate(filterQuery, document, { lean: true, upsert: true, new: true });
    }

    async find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, { lean: true });
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
        const document = await this.model.findOneAndDelete(filterQuery);

        if (!document) {
            this.logger.warn(`Document not found With filterquery`, filterQuery);
            throw new NotFoundException(`Document not found.`);
        }

        return document;
    }

    async startTransaction() {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }
}