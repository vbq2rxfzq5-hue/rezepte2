import { DOMBuilder } from '../dom-builder.js';
import { SecureStorage } from '../storage.js';
import { RecipeHelpers } from '../recipe-helpers.js';
import { Validator } from '../validator.js';
import { UNITS } from '../config.js';

export class FridgeCheckView {
    constructor(router) {
        this.router = router;
        this.fridgeItems = [];
    }

    render(data) {
        const container = DOMBuilder.createElement('div', { className: 'view active' });
        const header = DOMBuilder.createElement('header', { className: 'app-header' });
        const backBtn = DOMBuilder.createButton('← Zurück', 'back-btn');
        backBtn.addEventListener('click', () => this.router.navigateTo('shopping'));
        header.appendChild(backBtn);
        header.appendChild(DOMBuilder.createElement('h1', { textContent: 'Kühlschrank Check' }));
        container.appendChild(header);
        
        const formContainer = DOMBuilder.createElement('div', { className: 'form-container' });
        const infoBox = DOMBuilder.createElement('div', { className: 'info-box' });
        infoBox.appendChild(DOMBuilder.createElement('h3', { textContent: 'Was hast du bereits?' }));
        infoBox.appendChild(DOMBuilder.createElement('p', {
            textContent: 'Gib die Zutaten und Mengen ein, die du bereits im Kühlschrank hast.'
        }));
        formContainer.appendChild(infoBox);
        
        const itemsContainer = DOMBuilder.createElement('div', { id: 'fridge-items-container' });
        formContainer.appendChild(itemsContainer);
        
        const addBtn = DOMBuilder.createButton('+ Zutat hinzufügen', 'btn-secondary');
        addBtn.type = 'button';
        addBtn.addEventListener('click', () => this.addFridgeItem(itemsContainer));
        formContainer.appendChild(addBtn);
        
        const applyBtn = DOMBuilder.createButton('Kühlschrank-Check anwenden', 'btn-primary');
        applyBtn.addEventListener('click', () => this.applyCheck());
        formContainer.appendChild(applyBtn);
        
        container.appendChild(formContainer);
        this.addFridgeItem(itemsContainer);
        
        return container;
    }

    addFridgeItem(container) {
        const row = DOMBuilder.createElement('div', { className: 'ingredient-row' });
        row.appendChild(DOMBuilder.createInput('number', {
            className: 'ingredient-amount',
            placeholder: 'Menge',
            attributes: { step: '0.1', min: '0' }
        }));
        row.appendChild(DOMBuilder.createSelect(UNITS, 'g', 'ingredient-unit'));
        row.appendChild(DOMBuilder.createInput('text', {
            className: 'ingredient-name',
            placeholder: 'Zutat'
        }));
        
        if (this.fridgeItems.length > 0) {
            const removeBtn = DOMBuilder.createButton('✕', 'remove-ingredient');
            removeBtn.type = 'button';
            removeBtn.addEventListener('click', () => container.removeChild(row));
            row.appendChild(removeBtn);
        }
        
        container.appendChild(row);
        this.fridgeItems.push(row);
    }

    applyCheck() {
        const list = SecureStorage.loadShoppingList();
        if (!list) return;
        
        const fridgeItems = [];
        const rows = document.querySelectorAll('#fridge-items-container .ingredient-row');
        
        for (const row of rows) {
            const amount = row.querySelector('.ingredient-amount').value;
            const unit = row.querySelector('.ingredient-unit').value;
            const name = row.querySelector('.ingredient-name').value.trim();
            
            if (amount && name) {
                const amountVal = Validator.validateAmount(amount);
                const unitVal = Validator.validateUnit(unit);
                const nameVal = Validator.validateIngredientName(name);
                
                if (amountVal.valid && unitVal.valid && nameVal.valid) {
                    fridgeItems.push({
                        amount: amountVal.value,
                        unit: unitVal.value,
                        name: nameVal.value
                    });
                }
            }
        }
        
        if (fridgeItems.length === 0) {
            if (DOMBuilder.showConfirm('Keine Einträge. Fortfahren ohne Kühlschrank-Check?')) {
                this.router.navigateTo('shopping');
            }
            return;
        }
        
        const updated = RecipeHelpers.subtractFridgeItems(list.items, fridgeItems);
        const removed = list.items.length - updated.length;
        
        list.items = updated;
        SecureStorage.saveShoppingList(list);
        
        DOMBuilder.showAlert(`Kühlschrank-Check abgeschlossen!\n${removed} Artikel entfernt.`);
        this.router.navigateTo('shopping');
    }
}
