javascript:(function() {
    /* configuration */
    const containerId = 'g-tools';
    const blockStyle = `position:fixed;
						width: 500px;
						height: 300px;
						z-index:100;
                        background:#dddddd;
                        top: 0;
                        left: 0;`;

                       
    /* check block */
	const isToolsOpen = document.getElementById(containerId);

	if(isToolsOpen){
		isToolsOpen.remove();
	}else {
        createContainer();
	

        const formContainer = document.getElementById('form');
        const addButton = document.getElementById('add-pair');
        const saveButton = document.getElementById('save');
        const fillButton = document.getElementById('fill');
        const currentURL = window.location.href;
            
            
            /*  Инициализация формы */
            function initForm() {
                const savedData = localStorage.getItem(currentURL);
                
                if (savedData) {
                    try {
                        const pairs = JSON.parse(savedData);
                        pairs.forEach(pair => addPair(pair.key, pair.value));
                    } catch {
                        addPair(); /*  Добавляем пустую пару при ошибке парсинга */
                    }
                } else {
                    addPair(); /*  Пустая форма для нового URL */
                }
            }

            /*  Добавление новой пары полей */
            function addPair(key = '', value = '') {
                const pairDiv = document.createElement('div');
                pairDiv.className = 'pair-container';
                
                pairDiv.innerHTML = `
                    <input type="text" class="key-input" placeholder="Ключ" value="${key}">
                    <input type="text" class="value-input" placeholder="Значение" value="${value}">
                    <button class="remove">×</button>
                `;
                
                formContainer.appendChild(pairDiv);
            }

           /*  Сохранение данных */
            function saveData() {
                const pairs = [];
                const containers = formContainer.querySelectorAll('.pair-container');
                
                containers.forEach(container => {
                    const key = container.querySelector('.key-input').value.trim();
                    const value = container.querySelector('.value-input').value.trim();
                    
                    if (key || value) {
                        pairs.push({ key, value });
                    }
                });
                
                localStorage.setItem(currentURL, JSON.stringify(pairs));
                alert('Данные сохранены для текущего URL!');
            }

            /*  Удаление пары */
            formContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove')) {
                    if (formContainer.querySelectorAll('.pair-container').length > 1) {
                        e.target.closest('.pair-container').remove();
                    } else {
                        alert('Должна остаться хотя бы одна пара!');
                    }
                }
            });

            function fillByXPath() {
                const containers = formContainer.querySelectorAll('.pair-container');
                let filledCount = 0;
                let errorCount = 0;
                
                containers.forEach(container => {
                    const xpath = container.querySelector('.key-input').value.trim();
                    const value = container.querySelector('.value-input').value.trim();
                    
                    if (!xpath) return;
                    
                    try {
                        const result = document.evaluate(
                            xpath,
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        );
                        
                        const node = result.singleNodeValue;
                        
                        if (node) {
                            if (node.value !== undefined) {
                                node.value = value;
                                filledCount++;
                            } else if (node.textContent !== undefined) {
                                node.textContent = value;
                                filledCount++;
                            } else {
                                errorCount++;
                                console.error(`Элемент найден, но не поддерживает значения: ${xpath}`);
                            }
                        } else {
                            errorCount++;
                            console.error(`Элемент не найден: ${xpath}`);
                        }
                    } catch (e) {
                        errorCount++;
                        console.error(`Ошибка в XPath: ${xpath}`, e);
                    }
                });
                
                if (filledCount > 0 && errorCount === 0) {
                    showStatus(`Успешно заполнено ${filledCount} полей!`, 'success');
                } else if (filledCount > 0) {
                    showStatus(`Заполнено ${filledCount} полей, ${errorCount} ошибок`, 'error');
                } else {
                    showStatus('Не удалось заполнить ни одного поля', 'error');
                }
            }

            /*  Обработчики событий */
            addButton.addEventListener('click', () => addPair());
            saveButton.addEventListener('click', saveData); 
            fillButton.addEventListener('click', fillByXPath);

            /*  Инициализируем форму */
            initForm();
    }

    function createContainer(){
        const container = document.createElement('div');
	    
        container.style.cssText = blockStyle;
	    container.id = containerId;

        container.innerHTML = `<div id="form"></div>
                                    <div>
                                     <button id="add-pair">+ Добавить пару</button>
                                    <button id="save">Сохранить данные</button>
                                    <button id="fill">Заполнить по XPath</button>
                                    <button id="clear">Очистить форму</button>
                                </div>`;
        
        document.body.appendChild(container);   
    }
})();
