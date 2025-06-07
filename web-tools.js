javascript: (function () {
  /* configuration */
  const containerId = 'g-tools';
  const currentURL = window.location.href;
  const blockStyle = `position: fixed; width: 500px; height: 300px; z-index: 100; background: rgb(221 221 221 / 63%); top: -1px; left: -1px; border: 1px solid black;`;

  /* logic */
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    existingContainer.remove();
    return;
  }

  createContainer();

  /* functions */
  function createContainer() {
    const container = document.createElement('div');
    container.style.cssText = blockStyle;
    container.id = containerId;
    container.innerHTML = `
      <div id="form"></div>
      <div>
        <button id="add-pair">+ Добавить пару</button>
        <button id="save">Сохранить</button>
        <button id="fill">Заполнить</button>
      </div>
    `;
    document.body.appendChild(container);
  }

  const formContainer = document.getElementById('form');
  const addButton = document.getElementById('add-pair');
  const saveButton = document.getElementById('save');
  const fillButton = document.getElementById('fill');

  /* Event handlers */
  addButton.addEventListener('click', () => addPair());
  saveButton.addEventListener('click', saveData);
  fillButton.addEventListener('click', fillByXPath);

  initForm();

  function initForm() {
    const savedData = localStorage.getItem(currentURL);
    if (!savedData) return addPair();

    try {
      JSON.parse(savedData).forEach(pair => addPair(pair.key, pair.value));
    } catch {
      addPair();
    }
  }

  function addPair(key = '', value = '') {
    const pairDiv = document.createElement('div');
    pairDiv.className = 'pair-container';
    
    /* Исправлено: безопасное создание элементов вместо innerHTML */
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'key-input';
    keyInput.placeholder = 'Ключ';
    keyInput.value = key;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'value-input';
    valueInput.placeholder = 'Значение';
    valueInput.value = value;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    removeBtn.textContent = '×';

    pairDiv.append(keyInput, valueInput, removeBtn);
    formContainer.appendChild(pairDiv);
  }

  function saveData() {
    const pairs = [];
    document.querySelectorAll('.pair-container').forEach(container => {
      const key = container.querySelector('.key-input').value.trim();
      const value = container.querySelector('.value-input').value.trim();
      if (key || value) pairs.push({ key, value });
    });

    localStorage.setItem(currentURL, JSON.stringify(pairs));
    showStatus('Данные сохранены для текущего URL!', 'success');
  }

  formContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('remove')) return;
    if (formContainer.querySelectorAll('.pair-container').length <= 1) {
      return showStatus('Должна остаться хотя бы одна пара!', 'error');
    }
    e.target.closest('.pair-container').remove();
  });

  function fillByXPath() {
    let filled = 0, errors = 0;
    
    document.querySelectorAll('.pair-container').forEach(container => {
      const xpath = container.querySelector('.key-input').value.trim();
      const value = container.querySelector('.value-input').value.trim();
      if (!xpath) return;

      try {
        /* Исправлено: безопасная обработка кавычек в XPath */
        const xpathSafe = xpath.replace(/"/g, "'");
        const node = document.evaluate(
          xpathSafe,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (!node) {
          errors++;
          return console.error(`Элемент не найден: ${xpath}`);
        }

        if ('value' in node) node.value = value;
        else node.textContent = value;
        filled++;
      } catch (e) {
        errors++;
        console.error(`Ошибка в XPath: ${xpath}`, e);
      }
    });

    if (filled > 0 && errors === 0) {
      showStatus(`Успешно заполнено ${filled} полей!`, 'success');
    } else if (filled > 0) {
      showStatus(`Заполнено ${filled} полей, ${errors} ошибок`, 'warning');
    } else {
      showStatus('Не удалось заполнить ни одного поля', 'error');
    }
  }

  function showStatus(message, type) {
    const statusEl = document.createElement('div');
    statusEl.textContent = message;
    statusEl.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px;
      background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#F44336'};
      color: white;
      z-index: 1000;
      border-radius: 4px;
    `;
    
    document.body.appendChild(statusEl);
    setTimeout(() => statusEl.remove(), 3000);
  }
})();
