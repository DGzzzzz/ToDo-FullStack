const tbody = document.querySelector('tbody');
const form = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3030/tasks');
    const tasks = await response.json();
    return tasks;
}

const formatData = (dateUTC) => {
    const options = { dateStyle: 'long', timeStyle: 'short' };
    const data = new Date(dateUTC).toLocaleString('pt-br', options);
    return data;
}

const addTask = async(event) => {
    event.preventDefault();

    const task = { title: inputTask.value }

    await fetch('http://localhost:3030/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

    loadTasks();
    inputTask.value = '';
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3030/tasks/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}

const updateTask = async({ id, title, status }) => {

    await fetch(`http://localhost:3030/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, status })
    });

    loadTasks();
}

const createElement = (tag, innerText = '', innerHTML = '') => {

    const element = document.createElement(tag);

    if(innerText) {
        element.innerText = innerText;
    }

    if(innerHTML) {
        element.innerHTML = innerHTML;
    }

    return element;
}

const createSelect =(value) => {
    
    const options = `
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluída">concluída</option>
    `;

    const select = createElement('select', '', options);

    select.value = value;
    
    return select;
}

const createRow = (task) => {

    const { id, title, created_at, status } = task;

    const tr = createElement('tr');
    const tdTitle = createElement('td', title);
    const tdCreatedAt = createElement('td', formatData(created_at));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');

    const select = createSelect(status);

    select.addEventListener('change', (target) => {
        updateTask({ ...task, status: target.value });
    });

    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
    editButton.classList.add('btn-action');
    
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>');
    deleteButton.classList.add('btn-action');
    deleteButton.addEventListener('click', () => deleteTask(id));

    const editForm = createElement('form');
    const editInput = createElement('input');
    editInput.value = title;

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        updateTask({ id, title: editInput.value, status})
    });

    editButton.addEventListener('click', () => {
        tdTitle.innerHTML = '';
        tdTitle.appendChild(editForm);
    });

    editForm.appendChild(editInput);
    tdStatus.appendChild(select);
    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);

    return tr;
}

const loadTasks = async () => {
    
    const tasks = await fetchTasks();

    tbody.innerHTML = '';

    tasks.forEach(task => {
        const tr = createRow(task);
        tbody.appendChild(tr);
    });
}

addForm.addEventListener('submit', addTask);
loadTasks();