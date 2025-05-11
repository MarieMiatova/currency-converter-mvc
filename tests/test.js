import CurrencyModel from "../js/models/currencyModel.js";
import CurrencyView from "../js/views/currencyView.js";
import CurrencyController from "../js/controllers/currencyController.js";


document.body.innerHTML = `
    <input id="amount" type="number" />
    <select id="fromCurrency"></select>
    <select id="toCurrency"></select>
    <button id="convertBtn">Convert</button>
    <div id="result"></div>
    <ul id="exchangeHistory"></ul>
`;

describe("Currency Converter Tests", () => {
  let model, view, controller;

  beforeEach(() => {
    model = new CurrencyModel();
    view = new CurrencyView();
    controller = new CurrencyController(model, view);
  });

  describe("CurrencyModel Tests", () => {
    test("getCurrencies возвращает список валют", () => {
      const currencies = model.getCurrencies();
      expect(currencies).toBeInstanceOf(Array);
      expect(currencies.length).toBeGreaterThan(0);
      expect(currencies).toContain("USD");
      expect(currencies).toContain("EUR");
    });

    test("convertCurrency для одинаковых валют возвращает ту же сумму", async () => {
      const result = await model.convertCurrency(100, "USD", "USD");
      
      expect(result.amount).toBe(100);
      expect(result.fromCurrency).toBe("USD");
      expect(result.toCurrency).toBe("USD");
      expect(result.convertedAmount).toBe("100.00");
      expect(result.rate).toBe(1);
    });

    test("addToHistory добавляет запись в историю", () => {
      const historyLengthBefore = model.getExchangeHistory().length;
      model.addToHistory(100, "USD", "EUR", "85.00");
      const historyLengthAfter = model.getExchangeHistory().length;

      expect(historyLengthAfter).toBe(historyLengthBefore + 1);

      const historyEntry = model.getExchangeHistory()[historyLengthAfter - 1];
      expect(historyEntry.amount).toBe(100);
      expect(historyEntry.fromCurrency).toBe("USD");
      expect(historyEntry.toCurrency).toBe("EUR");
      expect(historyEntry.convertedAmount).toBe("85.00");
      expect(historyEntry.date).toBeDefined();
    });
    
    test("Ограничение истории до 50 элементов", () => {
      const testModel = new CurrencyModel();
      testModel.exchangeHistory = [];

      for (let i = 0; i < 55; i++) {
        testModel.addToHistory(i, "USD", "EUR", `${i}.00`);
      }
      
      expect(testModel.getExchangeHistory().length).toBe(50);
      const firstItem = testModel.getExchangeHistory()[0];
      expect(firstItem.amount).toBe(5);
    });
  });

  describe("CurrencyController Tests", () => {
    test("validateInput проверяет корректность введенных данных", () => {
      expect(controller.validateInput(0, "USD", "EUR")).toBe(false);  
      expect(controller.validateInput(100, "", "EUR")).toBe(false);
      expect(controller.validateInput(100, "USD", "")).toBe(false);
      expect(controller.validateInput(100, "USD", "EUR")).toBe(true);
    });
  });
}); 