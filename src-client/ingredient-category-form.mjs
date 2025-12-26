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

import { Validation } from '../src-shared/validation.mjs';

import {
    DISABLE_TOGGLE_CLASS, FORM_ALERT_ID,
    INGREDIENT_CATEGORY_FORM_ID,
    TIMEOUT_DURATION_MILLIS,
    WAS_VALIDATED_CLASS
} from './constants.mjs';

export class IngredientCategoryFormHandler {
    /**
     * @type {string[]}
     */
    #categoryNamesCache = [];

    #NAME_INPUT_ID = 'name';
    #NAME_INPUT = undefined;

    #DESCRIPTION_INPUT_ID = 'description';
    #DESCRIPTION_INPUT = undefined;

    #FORM_ALERT_DIV = undefined;

    #FORM = undefined;

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
        this.#categoryNamesCache = await this.#getCategoryNames();
        this.#decorateForm();
    }

    #decorateForm() {
        this.#FORM = document.getElementById(INGREDIENT_CATEGORY_FORM_ID);

        if (this.#FORM) {
            this.#NAME_INPUT = document.getElementById(this.#NAME_INPUT_ID);
            this.#DESCRIPTION_INPUT = document.getElementById(this.#DESCRIPTION_INPUT_ID);
            this.#FORM_ALERT_DIV = document.getElementById(FORM_ALERT_ID);

            this.#FORM.addEventListener('submit', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (this.#FORM.checkValidity() && this.#isFormValid()) {
                    this.#updateFormValidationState();
                    this.#FORM.classList.add(WAS_VALIDATED_CLASS);
                    this.#setPageDisabled(true);
                    await this.#submitIngredientCategory(this.#buildIngredientCategory());
                } else {
                    this.#updateFormValidationState();
                    this.#FORM.classList.add(WAS_VALIDATED_CLASS);
                }
            }, false);

            this.#FORM.addEventListener('change', () => {
                this.#FORM.classList.remove(WAS_VALIDATED_CLASS);
                this.#FORM.checkValidity();
                this.#updateFormValidationState();
                this.#FORM.classList.add(WAS_VALIDATED_CLASS);
            });

            this.#setPageDisabled(false);
        }
    }

    #isFormValid() {
        return this.#isNameInputValid();
    }

    /**
     * @param isDisabled {boolean}
     */
    #setPageDisabled(isDisabled) {
        const elements = document.getElementsByClassName(DISABLE_TOGGLE_CLASS);

        Array.from(elements).forEach((element) => {
            element.disabled = isDisabled;
        });
    }

    /**
     * @returns {boolean}
     */
    #isNameInputValid() {
        const isValidInput = this.#isStringInputValid(this.#NAME_INPUT);
        let isUnique = false;

        if (isValidInput) {
            const cacheIndex = this.#categoryNamesCache.findIndex((element) => {
                return element.trim().toLowerCase() === this.#NAME_INPUT.value.trim().toLowerCase();
            });

            isUnique = cacheIndex === -1;
        }

        return isValidInput && isUnique;
    }

    /**
     * @param input {*}
     * @returns {boolean}
     */
    #isStringInputValid(input) {
        if (!input ||
            !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
            return false;
        }

        return Validation.isNonEmptyString(input.value);
    }

    #updateFormValidationState() {
        this.#setCustomValidityMessage(this.#NAME_INPUT, this.#isNameInputValid(), 'Ingredient category name is required and must be unique.');
    }

    #setCustomValidityMessage(inputElement, isValid, validationMessage){
        if (inputElement && (inputElement instanceof HTMLElement)) {
            if (isValid) {
                inputElement.setCustomValidity('');
            } else {
                inputElement.setCustomValidity(validationMessage);
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

    /**
     * @returns {{ name: string | undefined, description: string | undefined }}
     */
    #buildIngredientCategory() {
        const ingredientCategory = {};

        if (this.#NAME_INPUT) {
            ingredientCategory.name = this.#NAME_INPUT.value.trim().toLowerCase();
        }

        if (this.#isStringInputValid(this.#DESCRIPTION_INPUT)) {
            ingredientCategory.description = this.#DESCRIPTION_INPUT.value.trim();
        }

        return ingredientCategory;
    }

    async #submitIngredientCategory(ingredientCategory) {
        if (!ingredientCategory || (typeof ingredientCategory !== 'object')) {
            throw new Error('Invalid ingredient category object.');
        }

        let success;

        try {
            const response = await fetch('/api/ingredient-category', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(ingredientCategory),
            });

            if (response && response.ok) {
                this.#addFormSuccessAlert();
                this.#categoryNamesCache = await this.#getCategoryNames();
                success = true;
            } else {
                this.#addFormFailureAlert();
                success = false;
            }
        } catch (error) {
            console.error('Error adding ingredient category.', error);
            this.#addFormFailureAlert();
            success = false;
        }

        await new Promise((resolve) => {
            setTimeout(() => { resolve(); }, TIMEOUT_DURATION_MILLIS);
        });

        this.#clearFormAlert();

        if (success) {
            this.#resetForm();
        }

        this.#setPageDisabled(false);
    }

    #addFormSuccessAlert() {
        if (this.#FORM_ALERT_DIV) {
            this.#FORM_ALERT_DIV.hidden = false;
            this.#FORM_ALERT_DIV.classList.add('alert-success');
            this.#FORM_ALERT_DIV.innerText = 'Ingredient category added successfully!';
        }
    }

    #addFormFailureAlert() {
        if (this.#FORM_ALERT_DIV) {
            this.#FORM_ALERT_DIV.hidden = false;
            this.#FORM_ALERT_DIV.classList.add('alert-danger');
            this.#FORM_ALERT_DIV.innerText = 'An error occurred. Please try again later.';
        }
    }

    #clearFormAlert() {
        if (this.#FORM_ALERT_DIV) {
            this.#FORM_ALERT_DIV.hidden = true;
            this.#FORM_ALERT_DIV.classList.remove('alert-danger', 'alert-success');
            this.#FORM_ALERT_DIV.innerText = '';
        }
    }

    #resetForm() {
        if (this.#FORM) {
            this.#FORM.reset();
            this.#FORM.classList.remove(WAS_VALIDATED_CLASS);
            this.#clearFormAlert();
        }
    }
}
