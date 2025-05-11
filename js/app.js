import CurrencyModel from './models/currencyModel.js';
import CurrencyView from './views/currencyView.js';
import CurrencyController from './controllers/currencyController.js';

class App {
    constructor() {
        this.model = null;
        this.view = null;
        this.controller = null;
    }

    initialize() {
        try {
            this.model = new CurrencyModel();
            this.view = new CurrencyView();
            this.controller = new CurrencyController(this.model, this.view);
            
            console.log('Приложение инициализировано успешно');
        } catch (error) {
            console.error('Ошибка при инициализации приложения:', error);
            throw error;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});