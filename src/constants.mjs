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

/**
 * Get the trust proxy setting from environment variables.
 *
 * @return {number|boolean} `true` for 'true', a number for valid numeric strings, or `false` for any other value or if not set.
 */
function getTrustProxy() {
    const trustProxy = process.env.TRUST_PROXY;
    const digitsRegex = /^\d+$/;

    if (trustProxy === 'true') {
        return true;
    }

    if (typeof trustProxy === 'string' && digitsRegex.test(trustProxy)) {
        return Number.parseInt(trustProxy, 10);
    }

    return false;
}

export const PORT = Number.parseInt(process.env.PORT, 10) || 3000;
export const TRUST_PROXY = getTrustProxy();
export const APP_NAME = process.env.APP_NAME || 'recipe-book';
export const USER_NAME = process.env.USER_NAME || 'User';

export const MILLIS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
