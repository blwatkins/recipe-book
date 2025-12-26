/*
 * Copyright (C) 2025 brittni and the polar bear LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import mysql from 'mysql2/promise';

import { Validation } from '../../src-shared/validation.mjs';

export class DatabaseClient {
    /**
     * @type {mysql.Pool|null}
     */
    static #connectionPool = null;

    /**
     * @throws {Error}
     */
    constructor() {
        throw new Error('DatabaseClient is a static class and cannot be instantiated directly.');
    }

    /**
     * @returns {mysql.Pool|null}
     */
    static get pool() {
        return DatabaseClient.#connectionPool;
    }

    /**
     * @returns {void}
     */
    static connect() {
        if (!DatabaseClient.hasValidConfig()) {
            throw new Error('Invalid database configuration in environment variables.');
        }

        if (!DatabaseClient.#connectionPool) {
            DatabaseClient.#connectionPool = mysql.createPool({
                host: process.env.MYSQL_HOST,
                port: Number.parseInt(process.env.MYSQL_PORT, 10),
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            });
        }
    }

    /**
     * @returns {boolean}
     */
    static hasValidConfig() {
        const host = process.env.MYSQL_HOST;
        const port = Number.parseInt(process.env.MYSQL_PORT, 10);
        const user = process.env.MYSQL_USER;
        const password = process.env.MYSQL_PASSWORD;
        const database = process.env.MYSQL_DATABASE;

        return (
            Validation.isNonEmptyString(host)
            && Validation.isNumber(port)
            && Validation.isNonEmptyString(user)
            && Validation.isNonEmptyString(password)
            && Validation.isNonEmptyString(database)
        );
    }

    /**
     * @param query {string}
     * @returns {Promise<*>}
     * @throws {Error}
     */
    static async queryAll(query) {
        if (!DatabaseClient.pool) {
            throw new Error('Database connection pool is not established.');
        }

        if (!Validation.isNonEmptyString(query)) {
            throw new Error('Query must be a non-empty string.');
        }

        const [rows] = await this.pool.execute(query);
        return rows;
    }
}
