const apiUrl = '/items';
const form = document.getElementById('itemForm');
const itemIdInput = document.getElementById('itemId');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const itemsList = document.getElementById('itemsList');

async function fetchItems() {
  const response = await fetch(apiUrl);
  const items = await response.json();
  renderItems(items);
}

function renderItems(items) {
  itemsList.innerHTML = '';

  if (!items.length) {
    itemsList.innerHTML = '<p>No items yet.</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="item-actions">
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </div>
    `;
    itemsList.appendChild(card);
  });
}

async function createItem(data) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    alert('Failed to add item');
    return;
  }

  form.reset();
  await fetchItems();
}

async function updateItem(id, data) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    alert('Failed to update item');
    return;
  }

  form.reset();
  resetForm();
  await fetchItems();
}

async function deleteItem(id) {
  const confirmed = confirm('Are you sure you want to delete this item?');
  if (!confirmed) return;

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    alert('Failed to delete item');
    return;
  }

  await fetchItems();
}

function resetForm() {
  form.reset();
  itemIdInput.value = '';
  saveBtn.textContent = 'Add Item';
  cancelBtn.classList.add('hidden');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  if (!payload.name || !payload.description) {
    alert('Please fill in all fields');
    return;
  }

  const itemId = itemIdInput.value;
  if (itemId) {
    await updateItem(Number(itemId), payload);
  } else {
    await createItem(payload);
  }
});

itemsList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const itemId = target.dataset.id;
  if (!itemId) return;

  if (target.classList.contains('delete-btn')) {
    await deleteItem(Number(itemId));
    return;
  }

  if (target.classList.contains('edit-btn')) {
    const response = await fetch(`${apiUrl}/${itemId}`);
    const item = await response.json();

    itemIdInput.value = item.id;
    nameInput.value = item.name;
    descriptionInput.value = item.description;
    saveBtn.textContent = 'Update Item';
    cancelBtn.classList.remove('hidden');
  }
});

cancelBtn.addEventListener('click', resetForm);

fetchItems();
