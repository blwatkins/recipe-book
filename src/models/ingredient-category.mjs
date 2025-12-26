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

import { IngredientCategoryClient } from '../db/ingredient-category-client.mjs';

export class IngredientCategory {
    /**
     * @type {string[]}
     */
    static #namesCache = [];

    /**
     * @returns {void}
     */
    static clearCache() {
        IngredientCategory.#namesCache.length = 0;
    }

    /**
     * @param name {string}
     * @param description {string | null}
     * @returns {Promise<boolean>}
     */
    static async addCategory(name, description) {
        const dbClient = await IngredientCategory.buildDatabaseClient();
        const success = await dbClient.insertIngredientCategory(name, description);
        await dbClient.closeConnection();
        return success;
    }

    /**
     * @returns {Promise<string[]>}
     */
    static async getAllNames() {
        if (IngredientCategory.#namesCache.length === 0) {
            try {
                const dbClient = await IngredientCategory.buildDatabaseClient();
                const result = await dbClient.queryAllIngredientCategoryNames();
                IngredientCategory.#namesCache.push(...result.map(row => row.name).sort());
                await dbClient.closeConnection();
            } catch (error) {
                console.error('Error fetching ingredient category names.', error);
            }
        }

        return IngredientCategory.#namesCache;
    }

    /**
     * @returns {Promise<IngredientCategoryClient>}
     */
    static async buildDatabaseClient() {
        const dbClient = new IngredientCategoryClient();
        dbClient.connection = await IngredientCategoryClient.buildConnection();
        return dbClient;
    }
}
