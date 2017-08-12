export const unitMap = {
  "each": ["slice", "slices", "medium", "cloves"],
  "tablespoon": ["tablespoons", "tbsp"],
  "teaspoon": ["teaspoons", "tsp"],
  "ounce": ["ounces", "oz"],
  "pound": ["pounds", "lb", "lbs"],
  "gram": ["grams", "g", "gs"],
  "fluid ounce": ["fluid ounces", "fl oz"],
  "cup": ["cups"],
};

// Build the all units map, which maps a string to a standard token
export let allUnitsMap = {};
for (let key of Object.keys(unitMap)) {
  allUnitsMap[key] = key;
  for (let alias of unitMap[key]) {
    allUnitsMap[alias] = key;
  }
}

// Key is original unit, objects are 'unit to convert to' : 'multiplication factor'
let conversionTable = {
  "tablespoon": {
    "teaspoon": 3,
  },
  "teaspoon": {
    "tablespoon": 1 / 3,
    "cup": 1 / 48,
  },
  "cup": {
    "tablespoon": 16,
    "teaspoon": 48,
  },
  "ounce": {
    "pound": 1 / 16,
    "gram": 28,
  },
  "pound": {
    "ounce": 16,
    "gram": 448,
  },
  "gram": {
    "ounce": 1 / 28,
    "pound": 1 / 448,
  },
};

// TODO: generate automatically: https://basarat.gitbooks.io/typescript/docs/types/literal-types.html
export type UnitEnum =
  "each"
  | "tablespoon"
  | "teaspoon"
  | "ounce"
  | "pound"
  | "gram"
  | "fluid ounce"
  | "cup";

export class Unit {
  public name: string;
  public originalName: string;
  constructor(name: string) {
    this.originalName = name;

    if (Object.keys(allUnitsMap).indexOf(name) === -1) {
      throw new Error(`Unknown unit: ${name}`);
    }
    this.name = allUnitsMap[name];
  }

  public conversionFactor(unit: Unit, amount: number): number {
    if (unit.name === this.name) {
      return 1 / amount;
    }
    let conversion = conversionTable[this.name];
    if (!conversion || !conversion[unit.name]) {
      throw new Error(`No conversion possible from ${this.name} to ${unit.name}`);
    }

    return 1 / amount * conversion[unit.name];
  }
}

export interface IngredientMatch {
  ingredientId?: string;
  servings?: number;
  originalText: string;
}

export class Recipe {
  public name: string;
  public description: string;
  public ingredients: string = "";
  public instructions: string;
  public calories: number;
  public cost: number;
  public servings: number;
  public sourceUrl: string;
  public id: string;
  public ingredientMatches: IngredientMatch[] = [];
  public imageUrl: string;

  get costPerServing(): number {
    if (!this.cost || !this.servings) {
      return undefined;
    }
    return this.cost / this.servings;
  }
  get caloriesPerServing(): number {
    if (!this.calories || !this.servings) {
      return undefined;
    }
    return Math.round(this.calories / this.servings);
  }

  constructor(jsonData) {
    for (let key of ["id", "name", "description", "calories", "cost", "ingredients", "instructions",
         "ingredientMatches", "servings", "imageUrl", "sourceUrl"]) {
      if (jsonData[key]) {
        this[key] = jsonData[key];
      }
    }
    // fill in ingredientMatches with undefineds
    let lenDiff = this.splitIngredients().length - this.ingredientMatches.length;
    if (lenDiff > 0) {
      for (let i = 0; i < lenDiff; i++) {
        this.ingredientMatches.push(undefined);
      }
    }
  }

  addMatch(match: IngredientMatch) {
    let index = this.findIngredientIndex(match.originalText);
    if (index === -1) {
      throw new Error(`Could not find index for match '${match.originalText}'`);
    }
    this.ingredientMatches[index] = match;
  }

  calculateCost(ingredientMap: any) {
    this.cost = 0.0;
    for (let match of this.ingredientMatches) {
      if (!match) continue;
      let ingredient: Ingredient = ingredientMap[match.ingredientId];
      this.cost += (match.servings * ingredient.containerCost / ingredient.servingsPerContainer);
    }
  }

  calculateCalories(ingredientMap: any) {
    this.calories = 0.0;
    for (let match of this.ingredientMatches) {
      if (!match) continue;
      let ingredient: Ingredient = ingredientMap[match.ingredientId];
      // console.log(match, ingredientMap);
      this.calories += (match.servings * ingredient.calories);
    }
    this.calories = Math.floor(this.calories);
  }

  private findIngredientIndex(originalText: string): number {
    return this.splitIngredients().indexOf(originalText);
  }

  public splitIngredients(): string[] {
    return this.ingredients.split("\n");
  }
}

export class Ingredient {
  public id: string;
  public name: string;
  public servingSize: number;
  public servingUnit: UnitEnum;
  public containerCost: number;
  public servingsPerContainer: number;
  public calories: number;
  public sourceUrl: string;
  public tags: string;

  constructor(jsonData) {
    for (let key of ["id", "name", "servingSize", "containerCost", "servingsPerContainer", "calories",
         "sourceUrl", "tags", "servingUnit"]) {
      this[key] = jsonData[key];
    }

    if (!this.id) {
      this.id = Math.random().toString(36).substr(2, 10);
    }
  }

  public getServingUnit(): Unit {
    try {
      return new Unit(this.servingUnit);
    } catch (e) {
      console.warn("could not construct unit for ingredient: ", this.servingUnit, e);
    }
  }

  public isValid(): boolean {
    return this.name &&
      this.servingSize &&
      this.containerCost &&
      this.servingsPerContainer &&
      this.calories &&
      this.sourceUrl &&
      this.tags &&
      this.servingUnit !== undefined;
  }
}
