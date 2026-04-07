CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name_normalized VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER DEFAULT 4,
  source_url TEXT,
  is_ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id),
  quantity DECIMAL,
  unit VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS meal_plans (
  id SERIAL PRIMARY KEY,
  start_date DATE DEFAULT CURRENT_DATE,
  num_days INTEGER NOT NULL,
  budget DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_plan_recipes (
  id SERIAL PRIMARY KEY,
  meal_plan_id INTEGER REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id),
  day_number INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id),
  rating VARCHAR(10) CHECK (rating IN ('like', 'dislike')),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredient_prices (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER REFERENCES ingredients(id),
  avg_price DECIMAL,
  unit VARCHAR(50),
  last_updated TIMESTAMP DEFAULT NOW()
);
