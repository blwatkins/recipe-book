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

import { Validation } from '../../src-shared/validation.mjs';

import { DatabaseClient } from './database-client.mjs';

export class IngredientCategoryClient extends DatabaseClient {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }

    async queryAllIngredientCategories() {
        const query = 'SELECT * FROM IngredientCategories';
        return await this.queryAll(query);
    }

    /**
     * @returns {Promise<{name: string}[]>}
     * @throws {Error}
     */
    async queryAllIngredientCategoryNames() {
        const query = 'SELECT name FROM IngredientCategories';
        return await this.queryAll(query);
    }

    /**
     * @param name {string}
     * @param description {string | null}
     * @returns {Promise<boolean>}
     * @throws {Error}
     */
    async insertIngredientCategory(name, description) {
        const query = 'INSERT INTO IngredientCategories (name, description) VALUES (?, ?)';

        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }

        if (!Validation.isNonEmptyString(name)) {
            throw new Error('IngredientCategory name must be a non-empty string.');
        } else {
            name = name.trim().toLowerCase();
        }

        if (!Validation.isNonEmptyString(description)) {
            description = null;
        } else {
            description = description.trim();
        }

        const params = [name, description];


        await this.connection.execute(query, params);
        return true;
    }
}
