class CurrencyView {
    constructor() {
        this.elements = {
            amountInput: document.getElementById('amount'),
            fromCurrencySelect: document.getElementById('fromCurrency'),
            toCurrencySelect: document.getElementById('toCurrency'),
            convertBtn: document.getElementById('convertBtn'),
            resultElement: document.getElementById('result'),
            historyList: document.getElementById('exchangeHistory')
        };
        this.validateElements();
    }

    validateElements() {
        const requiredElements = Object.values(this.elements);
        const missingElements = requiredElements.filter(element => !element);
        
        if (missingElements.length > 0) {
            console.error('Не все DOM элементы найдены. Проверьте HTML разметку.');
        }
    }

    getInputValues() {
        return {
            amount: parseFloat(this.elements.amountInput?.value || '0'),
            fromCurrency: this.elements.fromCurrencySelect?.value || '',
            toCurrency: this.elements.toCurrencySelect?.value || ''
        };
    }

    createCurrencyOption(currency) {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        return option;
    }

    populateCurrencySelectors(currencies) {
        const { fromCurrencySelect, toCurrencySelect } = this.elements;
        
        if (!fromCurrencySelect || !toCurrencySelect) {
            console.error('Селекторы валют не найдены');
            return;
        }

        this.clearSelectors(fromCurrencySelect, toCurrencySelect);
        this.addCurrencyOptions(currencies, fromCurrencySelect, toCurrencySelect);
    }

    clearSelectors(fromSelect, toSelect) {
        while (fromSelect.options.length > 1) fromSelect.remove(1);
        while (toSelect.options.length > 1) toSelect.remove(1);
    }

    addCurrencyOptions(currencies, fromSelect, toSelect) {
        currencies.forEach(currency => {
            fromSelect.appendChild(this.createCurrencyOption(currency));
            toSelect.appendChild(this.createCurrencyOption(currency));
        });
    }

    displayResult(conversionResult) {
        if (!this.elements.resultElement) return;

        this.elements.resultElement.innerHTML = '';

        if (!conversionResult) return;
        
        if (conversionResult.loading) {
            this.elements.resultElement.innerText = 'Загрузка...';
            this.setLoadingState(true);
            return;
        }
        
        const { amount, fromCurrency, convertedAmount, toCurrency } = conversionResult;
        this.elements.resultElement.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        this.setLoadingState(false);
    }

    setLoadingState(isLoading) {
        const { convertBtn } = this.elements;
        if (!convertBtn) return;
        
        convertBtn.disabled = isLoading;
        convertBtn.classList.toggle('loading', isLoading);
    }

    displayError(message) {
        if (!this.elements.resultElement) return;
        this.elements.resultElement.innerText = message;
        this.setLoadingState(false);
    }

    createHistoryItem(item) {
        const historyItem = document.createElement('li');
        historyItem.textContent = `${item.amount} ${item.fromCurrency} → ${item.convertedAmount} ${item.toCurrency}`;
        return historyItem;
    }

    displayExchangeHistory(historyItems) {
        const { historyList } = this.elements;
        if (!historyList) return;

        historyList.innerHTML = '';
        
        historyItems.slice().reverse().forEach(item => {
            historyList.appendChild(this.createHistoryItem(item));
        });
    }

    bindConvert(handler) {
        const { convertBtn } = this.elements;
        if (!convertBtn) return;
        
        convertBtn.replaceWith(convertBtn.cloneNode(true));
        this.elements.convertBtn = document.getElementById('convertBtn');
        
        this.elements.convertBtn.addEventListener('click', handler);
    }

    clearAmount() {
        if (this.elements.amountInput) {
            this.elements.amountInput.value = '';
        }
    }

    focusAmount() {
        if (this.elements.amountInput) {
            this.elements.amountInput.focus();
        }
    }
}

export default CurrencyView; 