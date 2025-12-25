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

"use strict";

(() => {
    const FORM_ID = 'ingredient-category-form';
    const NAME_INPUT_ID = 'name';
    const DESCRIPTION_INPUT_ID = 'description';

    // TODO - form validation logic
    // TODO - form validation logic - does the category name already exist?
    // TODO - form submission logic
    // TODO - success and error handling

    function buildRequestBody(name, description) {
        const requestBody = {
            name: name
        }

        if (description) {
            requestBody.description = description;
        }

        return requestBody;
    }

    async function submitForm() {
        const nameInput = document.getElementById(NAME_INPUT_ID);
        const descriptionInput = document.getElementById(DESCRIPTION_INPUT_ID);

        if (nameInput && descriptionInput) {
            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            const requestBody = buildRequestBody(name, description);
        }
    }
})();
