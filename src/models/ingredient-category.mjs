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

import { IngredientCategoriesClient } from '../db/ingredients-category-client.mjs';

export class IngredientCategory {
    /**
     * @type {string[]}
     */
    static #namesCache = [];

    /**
     * @returns {void}
     */
    static clearCache() {
        IngredientCategory.#namesCache = [];
    }

    /**
     * @param name {string}
     * @param description {string | null}
     * @returns {Promise<boolean>}
     * @throws {Error}
     */
    static async addCategory(name, description) {
        if (!Validation.isNonEmptyString(name)) {
            throw new Error('IngredientCategory name must be a non-empty string.');
        } else {
            name = name.trim();
        }

        if (!Validation.isNonEmptyString(description)) {
            description = null;
        } else {
            description = description.trim();
        }

        const dbClient = await IngredientCategory.buildDatabaseClient();
        const success = await dbClient.insertIngredientCategory(name, description);
        await dbClient.closeConnection();
        IngredientCategory.clearCache();
        return success;
    }

    /**
     * @returns {Promise<string[]>}
     */
    static async getAllNames() {
        if (IngredientCategory.#namesCache.length === 0) {
            const dbClient = await IngredientCategory.buildDatabaseClient();
            const result = await dbClient.queryAllIngredientCategoryNames();
            IngredientCategory.#namesCache = result.map(row => row.name);
            await dbClient.closeConnection();
        }

        return IngredientCategory.#namesCache;
    }

    /**
     * @returns {Promise<IngredientCategoriesClient>}
     */
    static async buildDatabaseClient() {
        const dbClient = new IngredientCategoriesClient();
        await IngredientCategoriesClient.buildConnection()
            .then((connection) => { dbClient.connection = connection; })
            .catch((error) => { console.error('Error building database connection.', error); });
        return dbClient;
    }
}
