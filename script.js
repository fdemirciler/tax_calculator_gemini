// --- Constants ---
const TAX_BRACKETS = [
  { rate: 0.10, low: 0, high: 20550 },
  { rate: 0.12, low: 20551, high: 83550 },
  { rate: 0.22, low: 83551, high: 178150 },
  { rate: 0.24, low: 178151, high: 340100 },
  { rate: 0.32, low: 340101, high: 431900 },
  { rate: 0.35, low: 431901, high: 647850 },
  { rate: 0.37, low: 647851, high: Infinity }
];

// --- DOM Elements ---
const DOM = {
  incomeInput: document.getElementById('income'),
  taxRateElement: document.getElementById('taxRate'),
  taxAmountElement: document.getElementById('taxAmount'),
  netIncomeElement: document.getElementById('netIncome'),
  taxBracketsBody: document.getElementById('taxBracketsBody')
};

// --- Formatting Utilities ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { // Consider making locale configurable
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', { // Consider making locale configurable
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// --- Performance Monitoring (Optional) ---
const measurePerformance = (func) => {
  return (...args) => {
    // Remove or disable in production if not needed
    // const start = performance.now();
    const result = func(...args);
    // const end = performance.now();
    // console.debug(`${func.name} took ${end - start}ms to execute`);
    return result;
  };
};

// --- Core Logic ---
const calculateTax = measurePerformance((income) => {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break; // No more income to tax

    const incomeInBracket = Math.min(remainingIncome, bracket.high - bracket.low);

    if (income > bracket.low) {
       const taxableAmountInBracket = Math.min(income, bracket.high) - bracket.low;
       if (taxableAmountInBracket > 0) {
         tax += bracket.rate * taxableAmountInBracket;
       }
    }
     if (income <= bracket.high) {
       break; // Stop if income falls within this bracket's upper limit
     }
  }
  return tax;
});


// --- Input Handling ---
const validateInput = (value) => {
  // Remove non-numeric characters except the first decimal point
  let numericString = value.replace(/[^\d.]/g, '');
  const decimalParts = numericString.split('.');
  if (decimalParts.length > 1) {
      numericString = decimalParts[0] + '.' + decimalParts.slice(1).join('');
  }

  const numericValue = parseFloat(numericString);
  if (isNaN(numericValue) || numericValue < 0) return 0;
  // Added a reasonable upper limit example
  if (numericValue > 1000000000) return 1000000000;
  return numericValue; // Return the raw numeric value for calculations
};

// --- Local Storage ---
const saveToLocalStorage = (income) => {
  try {
    localStorage.setItem('lastIncome', income.toString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    // Optionally inform the user
  }
};

const loadFromLocalStorage = () => {
  try {
    const lastIncome = localStorage.getItem('lastIncome');
    if (lastIncome) {
      const numericValue = parseFloat(lastIncome);
      // Check if numericValue is valid before proceeding
      if (!isNaN(numericValue) && numericValue >= 0) {
          DOM.incomeInput.value = formatNumber(numericValue); // Format for display
          updateResultsUI(numericValue); // Update based on the raw number
      } else {
          DOM.incomeInput.value = ''; // Clear input if stored value is invalid
          updateResultsUI(0);
      }
    } else {
         updateResultsUI(0); // Initialize if nothing is stored
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    updateResultsUI(0); // Default state on error
    // Optionally inform the user
  }
};


// --- UI Updates ---
const updateResultsUI = (income) => {
  const tax = calculateTax(income);
  const effectiveTaxRate = income > 0 ? ((tax / income) * 100).toFixed(2) : 0;
  const netIncome = income - tax;

  DOM.taxRateElement.textContent = `${effectiveTaxRate}%`;
  DOM.taxAmountElement.textContent = formatCurrency(tax);
  DOM.netIncomeElement.textContent = formatCurrency(netIncome);
};

const populateTaxBrackets = () => {
  DOM.taxBracketsBody.innerHTML = TAX_BRACKETS.map(bracket => `
    <tr>
      <td>${formatCurrency(bracket.low)}</td>
       <td>${bracket.high === Infinity ? 'Above' : formatCurrency(bracket.high)}</td>
      <td>${(bracket.rate * 100).toFixed(0)}%</td>
    </tr>
  `).join('');
};


// --- Event Handlers ---
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const handleIncomeInput = (e) => {
  const rawValue = e.target.value;
  const numericValue = validateInput(rawValue); // Get the raw validated number

  // Format the input field *display* value (optional: format on blur instead for simplicity)
   // Simple approach: update calculation but don't reformat input constantly
   // Or, if keeping instant formatting:
   const cursorPosition = e.target.selectionStart;
   const formattedValue = numericValue > 0 ? formatNumber(numericValue) : '';
   e.target.value = formattedValue;
   // Basic cursor adjustment (might need refinement for complex cases)
    if (formattedValue.length !== rawValue.length) {
       const diff = formattedValue.length - rawValue.length;
       // Try to adjust cursor; might be imperfect with separators
       const newPosition = Math.max(0, cursorPosition + diff);
       try {
           e.target.setSelectionRange(newPosition, newPosition);
       } catch (ex) { /* ignore potential errors during adjustment */ }
   }


  updateResultsUI(numericValue); // Update results based on the raw number
  saveToLocalStorage(numericValue); // Save the raw number
};


const handleKeyboardNavigation = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    DOM.incomeInput.blur(); // Remove focus from input on Enter
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    DOM.incomeInput.value = ''; // Clear input
    updateResultsUI(0);        // Reset results
    saveToLocalStorage(0);     // Save reset state
  }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    populateTaxBrackets();
    loadFromLocalStorage(); // Load saved state and update UI

    // Attach event listeners after DOM is ready
    DOM.incomeInput.addEventListener('input', debounce(handleIncomeInput, 300));
    DOM.incomeInput.addEventListener('keydown', handleKeyboardNavigation);
});