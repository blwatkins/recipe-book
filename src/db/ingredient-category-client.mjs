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

import { IngredientCategoryDataHandler as ICHandler } from '../../src-shared/ingredient-category-data-handler.mjs';

import { DatabaseClient } from './database-client.mjs';

export class IngredientCategoryClient extends DatabaseClient {
    /**
     * @returns {Promise<{name: string}[]>}
     */
    static async queryAllIngredientCategoryNames() {
        const query = 'SELECT name FROM IngredientCategories';
        return await IngredientCategoryClient.queryAll(query);
    }

    /**
     * @param name {string}
     * @param description {string | null}
     * @returns {Promise<boolean>}
     * @throws {Error}
     */
    static async insertIngredientCategory(name, description) {
        const query = 'INSERT INTO IngredientCategories (name, description) VALUES (?, ?)';

        if (!IngredientCategoryClient.pool) {
            throw new Error('Database connection is not established.');
        }

        name = ICHandler.sanitizeName(name);
        description = ICHandler.sanitizeDescription(description);
        const params = [name, description];

        try {
            await this.pool.execute(query, params);
            return true;
        } catch (error) {
            console.error('Error inserting ingredient category.', error);
            return false;
        }
    }
}
