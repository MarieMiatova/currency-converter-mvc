class CurrencyModel {
    constructor() {
        this.currencies = [
            'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 
            'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 
            'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 
            'ZAR', 'AED', 'BRL', 'PLN', 'DZD', 'ARS', 
            'COP', 'CLP', 'MYR', 'TWD', 'THB', 'IDR'
        ];
        this.exchangeHistory = [];
        this.loadHistoryFromStorage();
    }

    isLocalStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    loadHistoryFromStorage() {
        if (!this.isLocalStorageAvailable()) return;
        
        try {
            const savedHistory = localStorage.getItem('exchangeHistory');
            this.exchangeHistory = savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
            this.exchangeHistory = [];
        }
    }

    saveHistoryToStorage() {
        if (!this.isLocalStorageAvailable()) return;
        
        try {
            localStorage.setItem('exchangeHistory', JSON.stringify(this.exchangeHistory));
        } catch (error) {
            console.error('Ошибка при сохранении истории:', error);
        }
    }

    getCurrencies() {
        return this.currencies;
    }

    getExchangeHistory() {
        return this.exchangeHistory;
    }

    createHistoryEntry(amount, fromCurrency, toCurrency, convertedAmount) {
        return {
            amount,
            fromCurrency,
            toCurrency,
            convertedAmount,
            date: new Date().toISOString()
        };
    }

    addToHistory(amount, fromCurrency, toCurrency, convertedAmount) {
        const historyEntry = this.createHistoryEntry(amount, fromCurrency, toCurrency, convertedAmount);
        
        this.exchangeHistory.push(historyEntry);
        
        if (this.exchangeHistory.length > 50) {
            this.exchangeHistory.shift();
        }
        
        this.saveHistoryToStorage();
        return historyEntry;
    }

    validateInput(amount, fromCurrency, toCurrency) {
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new Error('Неверная сумма');
        }
        
        if (!fromCurrency || !toCurrency) {
            throw new Error('Неверные валюты');
        }
    }

    async fetchExchangeRate(fromCurrency, toCurrency) {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/7767d2562d23ca4aa3f47251/latest/${fromCurrency}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === 'error') {
            throw new Error('Ошибка при конвертации');
        }
        
        const rate = data.conversion_rates[toCurrency];
        
        if (!rate) {
            throw new Error(`Курс для валюты ${toCurrency} не найден`);
        }
        
        return rate;
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        this.validateInput(amount, fromCurrency, toCurrency);
        
        if (fromCurrency === toCurrency) {
            const result = {
                amount,
                fromCurrency,
                toCurrency,
                convertedAmount: amount.toFixed(2),
                rate: 1
            };
            this.addToHistory(amount, fromCurrency, toCurrency, result.convertedAmount);
            return result;
        }

        const rate = await this.fetchExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = (amount * rate).toFixed(2);
        
        const result = {
            amount,
            fromCurrency,
            toCurrency,
            convertedAmount,
            rate
        };
        
        this.addToHistory(amount, fromCurrency, toCurrency, convertedAmount);
        return result;
    }
}

export default CurrencyModel; 