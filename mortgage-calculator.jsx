import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [mortgageData, setMortgageData] = useState([]);
  
  // Calculate mortgage data
  useEffect(() => {
    const calculateMortgage = () => {
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      // Calculate monthly payment amount (fixed throughout the loan)
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      let remainingBalance = loanAmount;
      const data = [];
      
      for (let month = 0; month <= numberOfPayments; month++) {
        if (month === 0) {
          // Initial state before first payment
          data.push({
            month,
            remainingBalance,
            interestPaid: 0,
            principalPaid: 0,
            totalInterestPaid: 0,
            totalPrincipalPaid: 0,
            monthlyPayment: monthlyPayment,
          });
          continue;
        }
        
        // Calculate interest for this month
        const interestForMonth = remainingBalance * monthlyRate;
        
        // Calculate principal for this month
        const principalForMonth = monthlyPayment - interestForMonth;
        
        // Update remaining balance
        remainingBalance -= principalForMonth;
        
        // Handle final payment rounding
        if (month === numberOfPayments) {
          remainingBalance = 0;
        }
        
        // Calculate cumulative values
        const totalInterestPaid = data[month - 1].totalInterestPaid + interestForMonth;
        const totalPrincipalPaid = data[month - 1].totalPrincipalPaid + principalForMonth;
        
        data.push({
          month,
          remainingBalance: Math.max(0, remainingBalance),
          interestPaid: interestForMonth,
          principalPaid: principalForMonth,
          totalInterestPaid,
          totalPrincipalPaid,
          monthlyPayment,
        });
      }
      
      // Filter to show data at yearly intervals for better visualization
      const yearlyData = data.filter(item => item.month % 12 === 0 || item.month === numberOfPayments);
      setMortgageData(yearlyData);
    };
    
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return value.toFixed(2) + '%';
  };
  
  // Format tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const year = Math.floor(data.month / 12);
      const remainingMonths = data.month % 12;
      
      return (
        <div className="p-4 bg-white shadow rounded border border-gray-200">
          <p className="font-bold">{`Year ${year}${remainingMonths > 0 ? ` Month ${remainingMonths}` : ''}`}</p>
          <p>{`Monthly Payment: ${formatCurrency(data.monthlyPayment)}`}</p>
          <p>{`Interest Portion: ${formatCurrency(data.interestPaid)}`}</p>
          <p>{`Principal Portion: ${formatCurrency(data.principalPaid)}`}</p>
          <p>{`Remaining Balance: ${formatCurrency(data.remainingBalance)}`}</p>
          <p>{`Total Interest Paid: ${formatCurrency(data.totalInterestPaid)}`}</p>
          <p>{`Total Principal Paid: ${formatCurrency(data.totalPrincipalPaid)}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Summary stats
  const totalInterestPaid = mortgageData.length > 0 ? mortgageData[mortgageData.length - 1].totalInterestPaid : 0;
  const monthlyPayment = mortgageData.length > 0 ? mortgageData[1]?.monthlyPayment : 0;
  const totalPaid = loanAmount + totalInterestPaid;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mortgage Evolution Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Loan Amount</label>
          <input 
            type="number" 
            value={loanAmount} 
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="10000"
            max="10000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
          <input 
            type="number" 
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="0.1"
            max="20"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Loan Term (years)</label>
          <select 
            value={loanTerm} 
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Monthly Payment</p>
          <p className="text-xl font-bold">{formatCurrency(monthlyPayment)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Interest</p>
          <p className="text-xl font-bold">{formatCurrency(totalInterestPaid)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Amount Paid</p>
          <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Balance Evolution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mortgageData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => Math.floor(value / 12)}
              label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value).replace('$', '')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="remainingBalance" 
              name="Remaining Balance" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="totalPrincipalPaid" 
              name="Principal Paid" 
              stroke="#82ca9d" 
            />
            <Line 
              type="monotone" 
              dataKey="totalInterestPaid" 
              name="Interest Paid" 
              stroke="#ff7300" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Monthly Payment Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mortgageData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => Math.floor(value / 12)}
              label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value).replace('$', '')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="interestPaid" 
              name="Interest Portion" 
              stroke="#ff7300" 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="principalPaid" 
              name="Principal Portion" 
              stroke="#82ca9d" 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MortgageCalculator;