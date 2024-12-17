import { useEffect, useState } from "react";
import Flagselect from "./Flagselect"; // Ensure this component is implemented correctly.

const MoneyConvertForm = () => {
    const [amount, setAmount] = useState(100); // Fixed "amout" typo.
    const [fromCurrency, setFromCurrency] = useState("INR");
    const [toCurrency, setToCurrency] = useState("USD");
    const [result, setResult] = useState("");
    const [isLoading, setLoading] = useState(false);

    // Function to swap currencies.
    const handleSwapCurrency = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Function to fetch exchange rate.
    const getExchangeRate = async () => {
        const API_KEY = import.meta.env.VITE_API_KEY; // Ensure this environment variable is set up.
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Something went wrong");
            const data = await response.json();
            const rate = (data.conversion_rate * amount).toFixed(2);
            setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            setResult("Failed to fetch exchange rate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to handle form submission.
    const handleFormSubmit = (e) => {
        e.preventDefault();
        getExchangeRate();
    };

    // Update exchange rate on initial load and when currencies change.
    useEffect(() => {
        getExchangeRate();
    }, [fromCurrency, toCurrency]);

    return (
        <form className="converter-form" onSubmit={handleFormSubmit}>
            {/* Amount Input */}
            <div className="form-group">
                <label className="label">Enter your amount</label>
                <input
                    type="number"
                    className="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
            </div>

            {/* Currency Selection */}
            <div className="form-group from-currency-group">
                <div className="sections">
                    <label className="label">From</label>
                    <Flagselect
                        selectedCurrency={fromCurrency}
                        handleCurrency={(e) => setFromCurrency(e.target.value)}
                    />
                </div>

                {/* Swap Button */}
                <div className="swap" onClick={handleSwapCurrency}>
                    <svg viewBox="1 2 21 23" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15 6.5V9H11V11H15V13.5L18.5 10L15 6.5ZM9 10.5L5.5 14L9 17.5V15H13V13H9V10.5Z"
                            fill="#000"
                        />
                    </svg>
                </div>

                <div className="sections">
                    <label className="label">To</label>
                    <Flagselect
                        selectedCurrency={toCurrency}
                        handleCurrency={(e) => setToCurrency(e.target.value)}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={`${isLoading ? "loading" : ""} submit`}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Exchange Rate"}
            </button>

            {/* Result */}
            <p className="exchange-result">
                {isLoading ? "Getting exchange rate..." : result}
            </p>
        </form>
    );
};

export default MoneyConvertForm;
