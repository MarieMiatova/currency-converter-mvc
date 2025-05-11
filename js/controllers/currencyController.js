class CurrencyController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.handleConvert = this.handleConvert.bind(this);
        
        this.initialize();
    }
    
    initialize() {
        try {
            this.initView();
            this.bindEvents();
        } catch (error) {
            console.error('Ошибка при инициализации контроллера:', error);
            this.view.displayError('Ошибка при загрузке приложения');
        }
    }
    
    initView() {
        this.view.populateCurrencySelectors(this.model.getCurrencies());
        this.view.displayExchangeHistory(this.model.getExchangeHistory());
    }
    
    bindEvents() {
        this.view.bindConvert(this.handleConvert);
        this.bindEnterKey();
    }

    bindEnterKey() {
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleConvert();
                }
            });
        }
    }
    
    validateInput(amount, fromCurrency, toCurrency) {
        const validations = [
            {
                condition: !amount || isNaN(amount) || amount <= 0,
                message: 'Пожалуйста, введите сумму.'
            },
            {
                condition: !fromCurrency,
                message: 'Пожалуйста, выберите исходную валюту.'
            },
            {
                condition: !toCurrency,
                message: 'Пожалуйста, выберите целевую валюту.'
            }
        ];

        for (const validation of validations) {
            if (validation.condition) {
                this.view.displayError(validation.message);
                return false;
            }
        }
        
        return true;
    }
    
    async handleConvert() {
        try {
            const input = this.view.getInputValues();
            
            if (!this.validateInput(input.amount, input.fromCurrency, input.toCurrency)) {
                return;
            }
            
            this.view.displayResult({ loading: true });
            
            const result = await this.model.convertCurrency(
                input.amount,
                input.fromCurrency,
                input.toCurrency
            );
            
            this.updateView(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    updateView(result) {
        this.view.displayResult(result);
        this.view.displayExchangeHistory(this.model.getExchangeHistory());
        this.view.clearAmount();
        this.view.focusAmount();
    }

    handleError(error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении курса валют';
        this.view.displayError(errorMessage);
    }
}

export default CurrencyController; 