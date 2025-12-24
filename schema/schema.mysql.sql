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

# Create Tables
CREATE TABLE IF NOT EXISTS Units
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    symbol VARCHAR(8) UNIQUE
);

CREATE TABLE IF NOT EXISTS IngredientCategories
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS RecipeCategories
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Ingredients
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES IngredientCategories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Recipes
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    category_id INTEGER,
    serving_amount DOUBLE,
    serving_unit_id INTEGER,
    directions TEXT,
    FOREIGN KEY (category_id) REFERENCES RecipeCategories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (serving_unit_id) REFERENCES Units(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipeIngredients
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    measurement DOUBLE,
    measurement_unit_id INTEGER,
    UNIQUE (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (measurement_unit_id) REFERENCES Units(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS UnitConversions
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    unit_from_id INTEGER NOT NULL,
    unit_to_id INTEGER NOT NULL,
    conversion_factor DOUBLE NOT NULL,
    CHECK (unit_from_id <> unit_to_id),
    UNIQUE (unit_from_id, unit_to_id),
    FOREIGN KEY (unit_from_id) REFERENCES Units(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (unit_to_id) REFERENCES Units(id) ON DELETE CASCADE ON UPDATE CASCADE
);

# Drop Tables
DROP TABLE IF EXISTS UnitConversions;
DROP TABLE IF EXISTS RecipeIngredients;
DROP TABLE IF EXISTS Recipes;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS RecipeCategories;
DROP TABLE IF EXISTS IngredientCategories;
DROP TABLE IF EXISTS Units;
