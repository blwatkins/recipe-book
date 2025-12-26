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
     * @type {mysql.Connection | null}
     */
    #connection = null;

    /**
     * @throws {Error}
     */
    constructor() {
        if (!DatabaseClient.hasValidConfig()) {
            throw new Error('Invalid database configuration in environment variables.');
        }
    }

    /**
     * @returns {mysql.Connection|null}
     */
    get connection() {
        return this.#connection;
    }

    /**
     * @param connection {mysql.Connection}
     */
    set connection(connection) {
        if (!connection) {
            throw new Error('Connection cannot be null or undefined.');
        }

        this.#connection = connection;
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
     * @returns {Promise<mysql.Connection>}
     */
    static async buildConnection() {
        return mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number.parseInt(process.env.MYSQL_PORT, 10),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async closeConnection() {
        if (this.#connection) {
            await this.#connection.end();
            this.#connection = null;
        }
    }

    /**
     * @param query {string}
     * @returns {Promise<*[]>}
     * @throws {Error}
     */
    async queryAll(query) {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }

        const [rows] = await this.connection.execute(query);
        return rows;
    }
}
