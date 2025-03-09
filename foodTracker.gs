const FOOD_SHEET_NAME = "Food & Drink";
const FOOD_DATABASE_SHEET_NAME = "Database";

// My spreadsheet has some styling, so define the first cell. (C4)
const START_CELL_ROW = 4;
const START_CELL_COL = 3;

const NUM_MEALS = 4;
const NUM_DAYS = 7;

function getSheet(sheetname) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);

  if (!sheet) {
    throw new Error(`Couldn't find sheet (${sheetname})!`);
  }

  return sheet;
}

function initDBSheet() {
  const dbSheet = getSheet(FOOD_DATABASE_SHEET_NAME); 
  
  dbSheet.clear();
  dbSheet.appendRow(["Food Item", "Count"]);

  Logger.log("DB initalised");
}

function writeItemToDBSheet(item) {
  const dbSheet = getSheet(FOOD_DATABASE_SHEET_NAME);
  const values = dbSheet.getDataRange().getValues();

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

  // Logger.log(`Item added: ${item}`);
}

function updateDBSheet() {
  const foodSheet = getSheet(FOOD_SHEET_NAME);

  const range = foodSheet.getRange(START_CELL_ROW, START_CELL_COL, NUM_MEALS, NUM_DAYS);
  const meals = range.getValues(); 

  let foodstuffs = []

  meals.forEach(meal => { 
    meal.forEach(day => {
      const dayItems = day.toString().split(/\r?\n/).map(item => item.trim()).filter(item => item !== "");
      foodstuffs.push(...dayItems);
    });
  });

  Logger.log(`FoodStuffs: [${foodstuffs}]`);
 
  foodstuffs.forEach(item => writeItemToDBSheet(item));

  Logger.log(`DB updated`);
}

function main() {
  initDBSheet(); 
  // updateDBSheet();
}