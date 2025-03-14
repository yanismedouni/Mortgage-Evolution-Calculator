# Mortgage Evolution Calculator

This interactive React application visualizes the evolution of mortgage payments over time, showing how monthly payments are split between interest and principal, and how the remaining balance changes throughout the life of the loan.

![Mortgage Calculator Screenshot](screenshot.png)

## Features

- Interactive inputs for loan amount, interest rate, and loan term
- Real-time calculation of monthly payment, total interest, and total amount paid
- Visual representation of balance evolution over the life of the loan
- Detailed breakdown of how each payment is divided between interest and principal
- Responsive design that works on both desktop and mobile devices

## Mathematical Foundation

### Monthly Payment Calculation

The fixed monthly payment for an amortizing loan is calculated using the following formula:

$M = P \frac{r(1+r)^n}{(1+r)^n-1}$

Where:
- $M$ = Monthly payment amount
- $P$ = Principal (loan amount)
- $r$ = Monthly interest rate (annual rate divided by 12 and then by 100)
- $n$ = Total number of payments (loan term in years × 12)

In code, this is implemented as:

```javascript
const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
```

### Payment Breakdown

For each payment period:

1. **Interest Payment** = Remaining Balance × Monthly Interest Rate

   ```javascript
   const interestForMonth = remainingBalance * monthlyRate;
   ```

2. **Principal Payment** = Monthly Payment - Interest Payment

   ```javascript
   const principalForMonth = monthlyPayment - interestForMonth;
   ```

3. **New Remaining Balance** = Previous Remaining Balance - Principal Payment

   ```javascript
   remainingBalance -= principalForMonth;
   ```

### Amortization Schedule

The application generates a complete amortization schedule showing:
- The remaining loan balance after each payment
- The amount of each payment that goes toward interest
- The amount of each payment that goes toward reducing the principal
- Cumulative totals of interest and principal paid over time

## Technology Stack

- React (Frontend framework)
- recharts (Data visualization library)
- CSS with Tailwind-like utility classes (Styling)
- JavaScript (Logic implementation)

## Setup and Installation

### Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher recommended)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mortgage-calculator.git
   cd mortgage-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
mortgage-calculator/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── components/
│   │   └── MortgageCalculator.jsx
│   ├── App.js
│   ├── index.js
│   └── ...
└── package.json
```

## How to Use

1. Enter your desired loan amount (default: $300,000)
2. Adjust the interest rate as needed (default: 4.5%)
3. Select the loan term from the dropdown (options: 10, 15, 20, 25, or 30 years)
4. View the real-time updates to the monthly payment, total interest, and charts

## Implementation Details

### Key Components

The mortgage calculator consists of several key components:

1. **Input Controls**: Allow users to customize loan parameters
2. **Summary Statistics**: Display the monthly payment, total interest, and total paid
3. **Balance Evolution Chart**: Shows how the remaining balance decreases while principal paid increases
4. **Payment Breakdown Chart**: Illustrates how each payment shifts from mostly interest to mostly principal

### Calculation Logic

The core calculation logic occurs in the `useEffect` hook, which:

1. Calculates the fixed monthly payment using the amortization formula
2. Iterates through each payment period to determine:
   - Interest payment for the period
   - Principal payment for the period
   - Updated remaining balance
   - Cumulative totals
3. Stores the results in state for display in the UI

### Data Visualization

The application uses the `recharts` library to create interactive line charts that visualize:

1. The remaining balance over time
2. The cumulative principal paid over time
3. The cumulative interest paid over time
4. The breakdown of each payment between interest and principal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This calculator is for educational purposes only
- Always consult with a financial advisor before making mortgage decisions
