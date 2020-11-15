const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// An array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();

  console.log('Submitted!!!');
  const name = e.currentTarget.item.value;
  // Don't add empty and name to the list
  if (!name) return;

  const item = {
    name,
    id: Date.now(),
    completed: false,
  };
  // Push list item into state
  items.push(item);
  // Clear the form
  e.target.reset();
  // Fire off a custom event that will alert anyone that the items have been updated!
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  const html = items
    .map(
      item => `
        <li class="shopping-item">
          <input
            type="checkbox"
            name="id"
            value="${item.id}"
            ${item.completed ? 'checked' : ''}
          >
          <span class="itemName">${item.name}</span>
          <button
            name="id"
            value="${item.id}"
            aria-label="Remove ${item.name}"
          >
          &times;
          </button>
        </li>
      `
    )
    .join('');

  list.innerHTML = html;
  console.log(items);
}

function mirrorToLocalStorage() {
  const localStorageItems = JSON.stringify(items);
  localStorage.setItem('items', localStorageItems);
  console.info('Saving items to local storage...');
}

function restoreFromLocalStorage() {
  console.info('Restoring items from local storage...');
  // Get items from local storage
  const localStorageItems = JSON.parse(localStorage.getItem('items'));
  if (localStorageItems.length) {
    items = localStorageItems;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('DELETING ITEM...', id);
  const newItemsList = items.filter(item => item.id !== id);
  items = newItemsList;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
  console.log(items);
  disorderly;
}

function markAsCompleted(id) {
  console.log('Marking as completed...', id);
  const itemRef = items.find(item => item.id === id);
  itemRef.completed = !itemRef.completed; // Allows for a toggling functionality
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
  console.log(itemRef);
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
/*
Event Delegation: Instead of attaching the event listener directly to the buttons,
we DELEGATE listening for a click to the parent element <ul class="list">. When
the button is clicked, the listener of the parent element catches the BUBBLING event.
disorderly
SOURCE: https://dmitripavlutin.com/javascript-event-delegation/
*/
list.addEventListener('click', function(e) {
  const id = parseInt(e.target.value, 10);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsCompleted(id);
  }
});

// list.addEventListener('click');

restoreFromLocalStorage();
