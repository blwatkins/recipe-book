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

CREATE TABLE IF NOT EXISTS Units
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    symbol VARCHAR(8) UNIQUE
);

CREATE TABLE IF NOT EXISTS IngredientCategories
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS RecipeCategories
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Ingredients
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    preparation VARCHAR(64) NOT NULL DEFAULT '',
    UNIQUE (name, preparation)
);

CREATE TABLE IF NOT EXISTS Recipes
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    serving_amount DOUBLE NOT NULL,
    serving_unit_id INTEGER NOT NULL,
    approximate_servings BOOLEAN NOT NULL DEFAULT FALSE,
    directions TEXT,
    CHECK (serving_amount > 0),
    FOREIGN KEY (serving_unit_id) REFERENCES Units(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS IngredientCategoryAssignments
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingredient_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    UNIQUE (ingredient_id, category_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES IngredientCategories(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipeCategoryAssignments
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    UNIQUE (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES RecipeCategories(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipeIngredients
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    measurement_amount DOUBLE NOT NULL,
    measurement_unit_id INTEGER NOT NULL,
    approximate_measurement BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (recipe_id, ingredient_id),
    CHECK (measurement_amount > 0),
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
    UNIQUE (unit_from_id, unit_to_id),
    CHECK (conversion_factor > 0),
    FOREIGN KEY (unit_from_id) REFERENCES Units(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (unit_to_id) REFERENCES Units(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_recipe_ingredients ON RecipeIngredients(ingredient_id);

delimiter //
CREATE TRIGGER unit_conversions_check AFTER INSERT ON UnitConversions
FOR EACH ROW
BEGIN
    IF NEW.unit_from_id = NEW.unit_to_id THEN
        DELETE FROM UnitConversions WHERE id = NEW.id;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'unit_from_id and unit_to_id cannot be the same.';
    END IF;
END;//
delimiter ;
