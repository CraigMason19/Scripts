const FOOD_SHEET_NAME = "Food & Drink";
const FOOD_DATABASE_NAME = "Database";

function getFoodSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FOOD_SHEET_NAME);

  if (!sheet) {
    throw new Error(`Couldn't find sheet (${FOOD_SHEET_NAME})!`);
  }

  return sheet;
}

function getDBSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FOOD_DATABASE_NAME);

  if (!sheet) { 
    throw new Error(`Couldn't find sheet (${FOOD_DATABASE_NAME})!`);
  }

  return sheet;
}

function initDBSheet() {
  const dbSheet = getDBSheet(); 
  
  dbSheet.clear();
  dbSheet.appendRow(["Food Item", "Count"]);

  Logger.log("DB initalised");
}

function writeItemToDBSheet(item) {
  const dbSheet = getDBSheet();
  const values = dbSheet.getDataRange().getValues(); // Get all data

  const itemLower = item.trim().toLowerCase(); // Normalize input
  const headerOffset = 1; // Skip header row

  // Check if item exists
  for (let row = headerOffset; row < values.length; row++) {
    if (values[row][0].toString().toLowerCase() === itemLower) {
      dbSheet.getRange(row + 1, 2).setValue(values[row][1] + 1); // Increase count
      return;
    }
  }

  // Find the first empty row manually
  let newRow = values.length + 1; // Default to the end of the data

  for (let row = headerOffset; row < values.length; row++) {
    if (!values[row][0]) {  // Check if the first column is empty
      newRow = row + 1;
      break;
    }
  }

  dbSheet.getRange(newRow, 1, 1, 2).setValues([[itemLower, 1]]);

  Logger.log(`Item added: ${item}`);
}

function updateDBSheet() {
  const foodSheet = getFoodSheet();

  // Define the range (C4:I7) → 7 days (columns) × 4 meals (rows)
  const range = foodSheet.getRange(4, 3, 4, 7); // (startRow, startCol, numRows, numCols)
  const meals = range.getValues(); // Get values as a 2D array

  let foodstuffs = []

  meals.forEach(meal => { 
    meal.forEach(day => {
      const dayItems = day.toString().split(/\r?\n/).map(item => item.trim()).filter(item => item !== "");
      foodstuffs.push(...dayItems);
    });
  });

  Logger.log(`FoodStuffs`);
  Logger.log(foodstuffs);

  foodstuffs.forEach(item => writeItemToDBSheet(item));
  Logger.log(`DB updated`);
}

initDBSheet(); 
// updateDBSheet();