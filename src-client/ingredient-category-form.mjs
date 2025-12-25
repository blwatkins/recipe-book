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

import { Validation } from "../src-shared/validation.mjs";
import {INGREDIENT_CATEGORY_FORM_ID} from "./constants.mjs";

export class IngredientCategoryFormHandler {
    // TODO - input validation
    // TODO - form submission handling (fetch API)
    // TODO - success/error feedback to user
    /**
     * @type {string[]}
     */
    #categoryNames = [];

    #NAME_INPUT_ID = 'name';
    #NAME_INPUT = undefined;
    #NAME_INVALID_FEEDBACK_ID = 'invalid-feedback-name';

    constructor() {
    }

    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await this.#init();
            });
        } else {
            await this.#init();
        }
    }

    async #init() {
        this.#categoryNames = await this.#getCategoryNames();
        this.#decorateForm();
    }

    #decorateForm() {
        this.#NAME_INPUT = document.getElementById(this.#NAME_INPUT_ID);
        // const descriptionInput = document.getElementById(this.DESCRIPTION_INPUT_ID);

        const form = document.getElementById(INGREDIENT_CATEGORY_FORM_ID);

        if (form) {
            form.addEventListener('change', () => {
                form.classList.remove('was-validated');
                form.checkValidity();
                this.#updateFormValidationState();
                form.classList.add('was-validated');
            });
        }
    }

    #isFormValid() {
        return this.#isNameInputValid();
    }

    #isNameInputValid() {
        return this.#isStringInputValid(this.#NAME_INPUT);
    }

    #isDescriptionInputValid() {

    }

    #isStringInputValid(input) {
        if (!input &&
            !(input instanceof HTMLInputElement) &&
            !(input instanceof HTMLTextAreaElement)) {
            console.log('input must be a valid HTMLInputElement');
            return false;
        }

        return Validation.isNonEmptyString(input.value);
    }

    #updateFormValidationState() {
        this.#setValidation(this.#NAME_INPUT, this.#isNameInputValid(), 'Please enter a valid category name.');
    }

    #setValidation(element, isValid, message){
        if (element && (element instanceof HTMLElement)) {
            if (isValid) {
                element.setCustomValidity('');
            } else {
                element.setCustomValidity(message);
            }
        }
    }

    /**
     * @returns {Promise<string[]>}
     */
    async #getCategoryNames() {
        try {
            const response = await fetch('/api/ingredient-category/names');

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching category names.', error);
        }

        return [];
    }
}
