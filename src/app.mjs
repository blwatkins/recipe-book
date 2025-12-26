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

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { rateLimit } from 'express-rate-limit';

import { Validation } from '../src-shared/validation.mjs';

import { IngredientCategory } from './models/ingredient-category.mjs';

import {
    APP_NAME,
    COPYRIGHT_HOLDER,
    MILLIS_PER_SECOND,
    PORT,
    SECONDS_PER_MINUTE,
    TRUST_PROXY,
    USER_NAME
} from './constants.mjs';

const app = express();

app.set('trust proxy', TRUST_PROXY);

const limiter = rateLimit({
    windowMs: MILLIS_PER_SECOND * SECONDS_PER_MINUTE,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: [
                "'self'"
            ],
            scriptSrc: [
                "'self'",
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/',
            ]
        }
    }
}));
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(express.static('public'));

app.disable('x-powered-by');

app.set('views', 'views');
app.set('view engine', 'ejs');

const REQUIRED_VIEWS_DATA = {
    APP_NAME: APP_NAME,
    USER_NAME: USER_NAME,
    COPYRIGHT_HOLDER: COPYRIGHT_HOLDER
};

app.get('/', (request, response) => {
    response.render('index', {
        title: 'Home',
        constants: REQUIRED_VIEWS_DATA
    });
});

app.get('/ingredient-category/new', async (request, response) => {
    response.render('ingredient-category/form', {
        title: 'New Ingredient Category',
        constants: REQUIRED_VIEWS_DATA
    });
});

app.get('/api/ingredient-category/names', async (request, response) => {
    const names = await IngredientCategory.getAllNames();
    response.json(names);
});

app.post('/api/ingredient-category', async (request, response) => {
    if (!request.body || !Validation.isNonEmptyString(request.body.name)) {
        response.status(400).json({ message: 'Invalid request body.' });
        return;
    }

    const { name, description } = request.body;

    try {
        const success = await IngredientCategory.addCategory(name, description);

        if (success) {
            response.status(201).json({message: 'Ingredient category created successfully.'});
        } else {
            response.status(500).json({message: 'Failed to create ingredient category.'});
        }
    } finally {
        IngredientCategory.clearCache();
    }
});

app.use('/api', (request, response) => {
    response.status(404).json({ error: 'API route not found.' });
});

app.use((request, response) => {
    response.status(404).send('Not Found.');
});

app.use('/api', (error, request, response, next) => {
    console.error(error);
    response.status(500).json({ error: 'Internal server error.' });
});

app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).send('Internal Server Error.');
});

app.listen(PORT, () => {
    console.log(`Application ${APP_NAME} listening on port ${PORT}`);
});
