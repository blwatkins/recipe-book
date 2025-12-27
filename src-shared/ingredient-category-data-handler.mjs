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

import { Validation } from './validation.mjs';

export class IngredientCategoryDataHandler {
    static get NAME_MAX_LENGTH() {
        return 64;
    }

    static get DESCRIPTION_MAX_LENGTH() {
        return 8192;
    }

    /**
     * @param name {string}
     * @returns {string}
     */
    static sanitizeName(name) {
        if (!Validation.isNonEmptyString(name)) {
            throw new Error('Ingredient category name must be a non-empty string.');
        }

        if (name.length > IngredientCategoryDataHandler.NAME_MAX_LENGTH) {
            throw new Error(`Ingredient category name must not exceed ${IngredientCategoryDataHandler.NAME_MAX_LENGTH} characters.`);
        }

        return name.trim().toLowerCase();
    }

    /**
     * @param description {string|undefined|null}
     * @returns {string|null}
     */
    static sanitizeDescription(description) {
        if (!Validation.isNonEmptyString(description)) {
            return null;
        }

        if (description.length > IngredientCategoryDataHandler.DESCRIPTION_MAX_LENGTH) {
            throw new Error(`Ingredient category description must not exceed ${IngredientCategoryDataHandler.DESCRIPTION_MAX_LENGTH} characters.`);
        }

        return description.trim();
    }
}
