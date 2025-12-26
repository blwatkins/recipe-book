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
import { IngredientCategoryDataHandler as ICHandler } from '../src-shared/ingredient-category-data-handler.mjs';

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
    #categoryNames = [];

    /**
     * @type {string}
     * @constant
     */
    #NAME_INPUT_ID = 'name';

    /**
     * @type {string}
     * @constant
     */
    #DESCRIPTION_TEXT_AREA_ID = 'description';

    #nameInput = undefined;
    #descriptionTextArea = undefined;
    #formAlertDiv = undefined;
    #form = undefined;

    async init() {
        this.#categoryNames = await this.#getCategoryNames();
        this.#decorateForm();
    }

    #decorateForm() {
        this.#form = document.getElementById(INGREDIENT_CATEGORY_FORM_ID);

        if (this.#form) {
            this.#nameInput = document.getElementById(this.#NAME_INPUT_ID);
            this.#descriptionTextArea = document.getElementById(this.#DESCRIPTION_TEXT_AREA_ID);
            this.#formAlertDiv = document.getElementById(FORM_ALERT_ID);

            this.#form.addEventListener('submit', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (this.#form.checkValidity() && this.#isFormValid()) {
                    this.#updateFormValidationState();
                    this.#form.classList.add(WAS_VALIDATED_CLASS);
                    this.#setPageDisabled(true);
                    await this.#submitIngredientCategory(this.#buildIngredientCategory());
                } else {
                    this.#updateFormValidationState();
                    this.#form.classList.add(WAS_VALIDATED_CLASS);
                }
            }, false);

            this.#form.addEventListener('change', () => {
                this.#form.classList.remove(WAS_VALIDATED_CLASS);
                this.#form.checkValidity();
                this.#updateFormValidationState();
                this.#form.classList.add(WAS_VALIDATED_CLASS);
            });

            this.#form.addEventListener('input', (event) => {
                if (this.#nameInput) {
                    if (event.target === this.#nameInput) {
                        this.#nameInput.value = this.#nameInput.value.toLowerCase();
                    }
                }
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
        const isValidInput = this.#isStringInputValid(this.#nameInput);
        let isUnique = false;

        if (isValidInput) {
            const name = ICHandler.sanitizeName(this.#nameInput.value);
            isUnique =  !this.#categoryNames.includes(name);
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
        this.#setCustomValidityMessage(this.#nameInput, this.#isNameInputValid(), 'Ingredient category name is required and must be unique.');
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

        if (this.#nameInput) {
            ingredientCategory.name = ICHandler.sanitizeName(this.#nameInput.value);
        }

        if (this.#isStringInputValid(this.#descriptionTextArea)) {
            ingredientCategory.description = ICHandler.sanitizeDescription(this.#descriptionTextArea.value);
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
                this.#categoryNames = await this.#getCategoryNames();
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
        if (this.#formAlertDiv) {
            this.#formAlertDiv.hidden = false;
            this.#formAlertDiv.classList.add('alert-success');
            this.#formAlertDiv.innerText = 'Ingredient category added successfully!';
        }
    }

    #addFormFailureAlert() {
        if (this.#formAlertDiv) {
            this.#formAlertDiv.hidden = false;
            this.#formAlertDiv.classList.add('alert-danger');
            this.#formAlertDiv.innerText = 'An error occurred. Please try again later.';
        }
    }

    #clearFormAlert() {
        if (this.#formAlertDiv) {
            this.#formAlertDiv.hidden = true;
            this.#formAlertDiv.classList.remove('alert-danger', 'alert-success');
            this.#formAlertDiv.innerText = '';
        }
    }

    #resetForm() {
        if (this.#form) {
            this.#form.reset();
            this.#form.classList.remove(WAS_VALIDATED_CLASS);
            this.#clearFormAlert();
        }
    }
}
