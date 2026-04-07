import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const MOCK_MEALS = [
  {
    title: 'Kiwi Mince and Kumara Bake',
    description: 'A hearty New Zealand classic with seasoned beef mince and golden kumara topped with melted cheese.',
    instructions: '1. Preheat oven to 180°C.\n2. Brown mince with onion and garlic in a large pan.\n3. Add diced tomatoes, Worcestershire sauce, salt and pepper.\n4. Simmer for 10 minutes.\n5. Meanwhile, cook sliced kumara until just tender.\n6. Layer mince mixture in a baking dish, top with kumara slices.\n7. Sprinkle grated cheese over the top.\n8. Bake for 25-30 minutes until golden and bubbling.',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    estimatedCost: 18.50,
    ingredients: [
      { name: 'mince', quantity: 0.5, unit: 'kg', category: 'Meat' },
      { name: 'kumara', quantity: 0.5, unit: 'kg', category: 'Produce' },
      { name: 'onion', quantity: 1, unit: 'medium', category: 'Produce' },
      { name: 'garlic', quantity: 2, unit: 'cloves', category: 'Produce' },
      { name: 'cheese', quantity: 100, unit: 'g', category: 'Dairy' },
      { name: 'tomato', quantity: 400, unit: 'g', category: 'Pantry' },
    ],
  },
  {
    title: 'Chicken Stir Fry with Rice',
    description: 'Quick and easy chicken and vegetable stir fry with fluffy steamed rice — a weeknight favourite.',
    instructions: '1. Cook rice according to packet directions.\n2. Slice chicken breast into thin strips.\n3. Heat oil in a wok over high heat.\n4. Stir-fry chicken until cooked through, about 5 minutes.\n5. Add broccoli, carrot and capsicum.\n6. Stir-fry for 3-4 minutes.\n7. Add soy sauce, oyster sauce and a splash of sesame oil.\n8. Toss everything together and serve over rice.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    estimatedCost: 15.00,
    ingredients: [
      { name: 'chicken', quantity: 0.5, unit: 'kg', category: 'Meat' },
      { name: 'rice', quantity: 0.3, unit: 'kg', category: 'Pantry' },
      { name: 'broccoli', quantity: 1, unit: 'head', category: 'Produce' },
      { name: 'carrot', quantity: 2, unit: 'medium', category: 'Produce' },
      { name: 'soy_sauce', quantity: 3, unit: 'tbsp', category: 'Pantry' },
      { name: 'oil', quantity: 2, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    title: 'Lamb Chops with Roast Vegetables',
    description: 'Tender grilled lamb chops served alongside colourful roasted seasonal vegetables.',
    instructions: '1. Preheat oven to 200°C.\n2. Dice potato, kumara and carrot into chunks.\n3. Toss vegetables with oil, salt and rosemary.\n4. Roast for 35-40 minutes until golden.\n5. Season lamb chops with salt, pepper and garlic.\n6. Heat a grill pan or BBQ to high heat.\n7. Cook chops 3-4 minutes each side for medium.\n8. Rest for 5 minutes before serving with roasted vegetables.',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    estimatedCost: 24.00,
    ingredients: [
      { name: 'lamb', quantity: 0.6, unit: 'kg', category: 'Meat' },
      { name: 'potato', quantity: 0.4, unit: 'kg', category: 'Produce' },
      { name: 'kumara', quantity: 0.4, unit: 'kg', category: 'Produce' },
      { name: 'carrot', quantity: 2, unit: 'medium', category: 'Produce' },
      { name: 'garlic', quantity: 3, unit: 'cloves', category: 'Produce' },
      { name: 'oil', quantity: 2, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    title: 'Pasta Bolognese',
    description: 'Classic Italian-style bolognese with a rich tomato and mince sauce over al dente pasta.',
    instructions: '1. Cook pasta in salted boiling water until al dente.\n2. Brown mince with diced onion and garlic.\n3. Add tinned tomatoes, tomato paste and Italian herbs.\n4. Season with salt and pepper.\n5. Simmer sauce for 20 minutes.\n6. Drain pasta and combine with sauce.\n7. Serve with grated parmesan and fresh basil if available.',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    estimatedCost: 12.00,
    ingredients: [
      { name: 'mince', quantity: 0.5, unit: 'kg', category: 'Meat' },
      { name: 'pasta', quantity: 400, unit: 'g', category: 'Pantry' },
      { name: 'tomato', quantity: 400, unit: 'g', category: 'Pantry' },
      { name: 'onion', quantity: 1, unit: 'large', category: 'Produce' },
      { name: 'garlic', quantity: 3, unit: 'cloves', category: 'Produce' },
      { name: 'cheese', quantity: 50, unit: 'g', category: 'Dairy' },
    ],
  },
  {
    title: 'Salmon with Steamed Greens',
    description: 'Pan-seared salmon fillets with a lemon-butter sauce, served with steamed broccoli and spinach.',
    instructions: '1. Pat salmon fillets dry and season with salt and pepper.\n2. Heat oil in a pan over medium-high heat.\n3. Cook salmon skin-side up for 4 minutes, then flip.\n4. Cook another 3-4 minutes until cooked through.\n5. Add butter, lemon juice and garlic to the pan.\n6. Baste the salmon with the butter sauce.\n7. Steam broccoli and spinach until just tender.\n8. Serve salmon over greens with butter sauce drizzled on top.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    estimatedCost: 20.00,
    ingredients: [
      { name: 'salmon', quantity: 0.4, unit: 'kg', category: 'Meat' },
      { name: 'broccoli', quantity: 1, unit: 'head', category: 'Produce' },
      { name: 'spinach', quantity: 1, unit: 'bag', category: 'Produce' },
      { name: 'butter', quantity: 30, unit: 'g', category: 'Dairy' },
      { name: 'garlic', quantity: 2, unit: 'cloves', category: 'Produce' },
      { name: 'oil', quantity: 1, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    title: 'Egg Fried Rice',
    description: 'Simple and satisfying egg fried rice using pantry staples — perfect for a quick midweek dinner.',
    instructions: '1. Cook rice and let it cool (or use leftover rice).\n2. Beat eggs with a pinch of salt.\n3. Heat oil in a wok over high heat.\n4. Scramble the eggs, breaking into small pieces.\n5. Add rice and stir-fry to combine.\n6. Add frozen peas, carrot and spring onion.\n7. Season with soy sauce and sesame oil.\n8. Stir-fry for 3-4 minutes and serve hot.',
    prepTime: 5,
    cookTime: 15,
    servings: 3,
    estimatedCost: 8.00,
    ingredients: [
      { name: 'rice', quantity: 0.3, unit: 'kg', category: 'Pantry' },
      { name: 'eggs', quantity: 4, unit: 'large', category: 'Dairy' },
      { name: 'carrot', quantity: 1, unit: 'medium', category: 'Produce' },
      { name: 'soy_sauce', quantity: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'oil', quantity: 2, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    title: 'Beef and Vegetable Soup',
    description: 'A warming, budget-friendly beef and vegetable soup that\'s perfect for colder NZ days.',
    instructions: '1. Brown diced beef in a large pot.\n2. Add diced onion, carrot and potato.\n3. Pour in beef stock and bring to the boil.\n4. Add tomato paste, thyme and bay leaf.\n5. Reduce heat and simmer for 40 minutes.\n6. Add chopped spinach in the last 5 minutes.\n7. Season with salt and pepper to taste.\n8. Serve with crusty bread.',
    prepTime: 15,
    cookTime: 50,
    servings: 6,
    estimatedCost: 16.00,
    ingredients: [
      { name: 'beef', quantity: 0.4, unit: 'kg', category: 'Meat' },
      { name: 'potato', quantity: 0.3, unit: 'kg', category: 'Produce' },
      { name: 'carrot', quantity: 2, unit: 'medium', category: 'Produce' },
      { name: 'onion', quantity: 1, unit: 'large', category: 'Produce' },
      { name: 'spinach', quantity: 1, unit: 'bag', category: 'Produce' },
      { name: 'bread', quantity: 1, unit: 'loaf', category: 'Pantry' },
    ],
  },
];

const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey && apiKey.startsWith('sk-')
  ? new OpenAI({ apiKey })
  : null;

function extractJson(text) {
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    return JSON.parse(jsonBlockMatch[1].trim());
  }
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }
  return JSON.parse(text);
}

export async function generateMealPlan({ days, budget, availableIngredients, constraints }) {
  if (!openai) {
    console.log('No OpenAI API key found — returning mock NZ meal data.');
    const shuffled = [...MOCK_MEALS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, days);
  }

  const systemPrompt =
    'You are a meal planning assistant for New Zealand households. ' +
    'Prefer common NZ meals and ingredients (mince, roast, stir fry, kumara, etc.). ' +
    'Optimise for budget, ingredient reuse across multiple days, and simplicity. ' +
    'Always respond with valid JSON only — no markdown, no extra text.';

  const userPrompt =
    `Create a ${days}-day meal plan for a New Zealand household.` +
    (budget ? ` Total weekly budget: NZD $${budget}.` : '') +
    (availableIngredients?.length ? ` Ingredients already available: ${availableIngredients.join(', ')}.` : '') +
    (constraints ? ` Dietary constraints: ${constraints}.` : '') +
    `\n\nReturn a JSON array of exactly ${days} meal objects. Each object must have:
- title (string)
- description (string, 1-2 sentences)
- instructions (string, numbered steps)
- prepTime (integer, minutes)
- cookTime (integer, minutes)
- servings (integer)
- estimatedCost (number, NZD)
- ingredients (array of { name, quantity, unit, category }) where category is one of: Produce, Meat, Dairy, Pantry, Frozen, Other

Optimise for ingredient reuse across days to minimise shopping cost.`;

  const initialResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  let meals;
  try {
    meals = extractJson(initialResponse.choices[0].message.content);
  } catch (err) {
    console.error('Failed to parse initial AI response:', err.message);
    throw new Error('AI returned invalid JSON for meal plan.');
  }

  const refinementPrompt =
    `Here is a ${days}-day meal plan as JSON:\n${JSON.stringify(meals, null, 2)}\n\n` +
    'Review this meal plan and optimise it for ingredient reuse. ' +
    'Where possible, replace ingredients so that the same ingredients appear in multiple meals. ' +
    'Keep the same structure and return the updated JSON array only.';

  const refinedResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: refinementPrompt },
    ],
  });

  try {
    const refined = extractJson(refinedResponse.choices[0].message.content);
    return refined;
  } catch (err) {
    console.warn('Refinement pass returned invalid JSON, using original meals:', err.message);
    return meals;
  }
}

export async function regenerateRecipe(existingPlan, dayNumber, constraints) {
  if (!openai) {
    const shuffled = [...MOCK_MEALS].sort(() => Math.random() - 0.5);
    const existingTitles = existingPlan.map((m) => m.title);
    const alternative = shuffled.find((m) => !existingTitles.includes(m.title)) || shuffled[0];
    return alternative;
  }

  const systemPrompt =
    'You are a meal planning assistant for New Zealand households. ' +
    'Prefer common NZ meals and ingredients. Respond with valid JSON only.';

  const otherMeals = existingPlan.filter((_, i) => i !== dayNumber - 1);
  const ingredientsInUse = [
    ...new Set(otherMeals.flatMap((m) => m.ingredients?.map((i) => i.name) || [])),
  ];

  const userPrompt =
    `Generate a single replacement meal for day ${dayNumber} of a meal plan.` +
    (constraints ? ` Constraints: ${constraints}.` : '') +
    (ingredientsInUse.length
      ? ` Try to reuse these ingredients already in the plan: ${ingredientsInUse.join(', ')}.`
      : '') +
    `\n\nReturn a single JSON object (not an array) with:
- title, description, instructions, prepTime, cookTime, servings, estimatedCost
- ingredients: array of { name, quantity, unit, category }

Do not repeat any of these meals already in the plan: ${otherMeals.map((m) => m.title).join(', ')}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  try {
    const text = response.choices[0].message.content;
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse regenerated recipe:', err.message);
    throw new Error('AI returned invalid JSON for regenerated recipe.');
  }
}
