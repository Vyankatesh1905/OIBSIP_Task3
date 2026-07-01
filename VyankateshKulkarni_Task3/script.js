// ============================================
// Temperature Converter - JavaScript
// Modern HTML, CSS & JavaScript Project
// ============================================

// ---------- DOM Elements ----------
const temperatureInput = document.getElementById("temperature");
const convertFromSelect = document.getElementById("convertFrom");
const convertToSelect = document.getElementById("convertTo");
const convertBtn = document.getElementById("convertBtn");
const resetBtn = document.getElementById("resetBtn");
const errorMessage = document.getElementById("errorMessage");
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");
const originalTemp = document.getElementById("originalTemp");
const convertedTemp = document.getElementById("convertedTemp");
const historyList = document.getElementById("historyList");

// Store last 5 conversions
let conversionHistory = [];

// Unit symbols for display
const unitSymbols = {
  celsius: "°C",
  fahrenheit: "°F",
  kelvin: "K"
};

// ---------- Conversion Functions ----------

/**
 * Convert any unit to Celsius (base unit)
 */
function toCelsius(value, fromUnit) {
  switch (fromUnit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return (value - 32) * 5 / 9;
    case "kelvin":
      return value - 273.15;
    default:
      return value;
  }
}

/**
 * Convert Celsius to target unit
 */
function fromCelsius(celsius, toUnit) {
  switch (toUnit) {
    case "celsius":
      return celsius;
    case "fahrenheit":
      return (celsius * 9 / 5) + 32;
    case "kelvin":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * Convert temperature from one unit to another
 */
function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return value;
  }

  const celsius = toCelsius(value, fromUnit);
  return fromCelsius(celsius, toUnit);
}

// ---------- Validation Function ----------

/**
 * Validate user input and return error message or null
 */
function validateInput(value, fromUnit) {
  // Check if input is empty
  if (value.trim() === "") {
    return "Please enter a temperature value.";
  }

  const temperature = Number(value);

  // Check if input is a valid number
  if (isNaN(temperature)) {
    return "Please enter a valid number.";
  }

  // Check if Kelvin value is below absolute zero
  if (fromUnit === "kelvin" && temperature < 0) {
    return "Kelvin value cannot be below 0 K (absolute zero).";
  }

  return null;
}

// ---------- Display Functions ----------

/**
 * Show error message to the user
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  resultCard.classList.add("hidden");
  resultCard.classList.remove("show");
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("show");
}

/**
 * Display conversion result in the result card
 */
function showResult(inputValue, convertedValue, fromUnit, toUnit) {
  const fromSymbol = unitSymbols[fromUnit];
  const toSymbol = unitSymbols[toUnit];

  // Main result: e.g. "25 °C = 77.00 °F"
  resultText.textContent = `${inputValue} ${fromSymbol} = ${convertedValue.toFixed(2)} ${toSymbol}`;

  // Detailed breakdown
  originalTemp.textContent = `Input: ${inputValue} ${fromSymbol}`;
  convertedTemp.textContent = `Output: ${convertedValue.toFixed(2)} ${toSymbol}`;

  resultCard.classList.remove("hidden");
  resultCard.classList.add("show");
}

// ---------- History Functions ----------

/**
 * Add a conversion to history (keep last 5)
 */
function addToHistory(conversionString) {
  conversionHistory.unshift(conversionString);

  if (conversionHistory.length > 5) {
    conversionHistory.pop();
  }

  updateHistoryDisplay();
}

/**
 * Update the history list in the UI
 */
function updateHistoryDisplay() {
  historyList.innerHTML = "";

  if (conversionHistory.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "history-empty";
    emptyItem.textContent = "No conversions yet";
    historyList.appendChild(emptyItem);
    return;
  }

  conversionHistory.forEach(function (item) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    historyList.appendChild(listItem);
  });
}

// ---------- Reset Function ----------

/**
 * Clear all inputs, results, and errors
 */
function resetConverter() {
  temperatureInput.value = "";
  convertFromSelect.value = "celsius";
  convertToSelect.value = "fahrenheit";

  hideError();
  resultCard.classList.add("hidden");
  resultCard.classList.remove("show");
  resultText.textContent = "";
  originalTemp.textContent = "";
  convertedTemp.textContent = "";
}

// ---------- Main Convert Handler ----------

/**
 * Handle convert button click
 */
function handleConvert() {
  hideError();

  const inputValue = temperatureInput.value;
  const fromUnit = convertFromSelect.value;
  const toUnit = convertToSelect.value;

  // Validate input
  const error = validateInput(inputValue, fromUnit);
  if (error) {
    showError(error);
    return;
  }

  const temperature = Number(inputValue);
  const convertedValue = convertTemperature(temperature, fromUnit, toUnit);

  // Display result
  showResult(temperature, convertedValue, fromUnit, toUnit);

  // Add to history
  const fromSymbol = unitSymbols[fromUnit];
  const toSymbol = unitSymbols[toUnit];
  const historyEntry = `${temperature} ${fromSymbol} → ${convertedValue.toFixed(2)} ${toSymbol}`;
  addToHistory(historyEntry);
}

// ---------- Event Listeners ----------

convertBtn.addEventListener("click", handleConvert);
resetBtn.addEventListener("click", resetConverter);

// Allow Enter key to trigger conversion
temperatureInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleConvert();
  }
});
