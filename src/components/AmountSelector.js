import React from 'react';


const AmountSelector = ({ amounts, selectedAmount, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(amount)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              selectedAmount === amount
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            ₹{amount.toLocaleString()}
          </button>
        ))}
      </div>
      <div>
        <input
          type="number"
          placeholder="Other Amount"
          value={selectedAmount || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full p-3 border rounded-lg input-focus-effect mt-4"
        />
      </div>
    </div>
  );
};

export default AmountSelector;