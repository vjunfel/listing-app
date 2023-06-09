const myForm = document.querySelector('#my-form');
const myField = document.querySelector('#my-field');
const myList = document.querySelector('#my-list');
const btnDelete = document.querySelector('.btnDelete');
const clearAll = document.querySelector('#clear');
const filter = document.querySelector('#filter');
const formBtn = document.querySelector('#formBtn')
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => {
		addItemToDOM(item);
	});

	checkUI();
}

function createItem(e) {
	e.preventDefault();
	const inputValue = myField.value.trim();

	if (inputValue.length === 0) {
		const warningMessage = document.querySelector('#warning');
		warningMessage.classList.add('warn');

		setTimeout(() => {
			warningMessage.classList.remove('warn');
		}, 2500);
	} else {
		if(isEditMode){
			const itemToEdit = myList.querySelector('.edit-mode')

			removeItemFromStorage(itemToEdit.textContent);
			itemToEdit.classList.remove('edit-mode');
			itemToEdit.remove();
			formBtn.innerText = 'Add Item';
			formBtn.style.backgroundColor = '#ff7423';
			isEditMode = false;
		}

		addItemToDOM(inputValue);
		addToLocalStorage(inputValue);
	}
	myField.value = '';
	myField.focus();
	checkUI();
}

function addItemToDOM(newItem) {
	const li = document.createElement('li');
	li.className = 'item-list';
	li.appendChild(document.createTextNode(newItem));

	const button = createBtn('btnDelete');
	li.appendChild(button);
	myList.appendChild(li);
}

function addToLocalStorage(newItem) {
	let itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.push(newItem);
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}
	return itemsFromStorage;
}

function createBtn(classes) {
	const button = document.createElement('button');
	button.className = classes;

	const icon = createIcon('fa fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}
function onClickItem(e) {
	if (e.target.parentElement.classList.contains('btnDelete')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target)
		formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
	}
}

function setItemToEdit(item){
	isEditMode = true;
	myList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))

	item.classList.add('edit-mode');
	formBtn.style.backgroundColor = '#007533';
	myField.value = item.textContent;
}

function removeItem(item) {
	item.remove();

	removeItemFromStorage(item.textContent);

	checkUI();
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removed
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	// Re-set to localstorage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearLists() {
	if (confirm('Are you sure you want to delete all the list?')) {
		while (myList.firstChild) {
			myList.firstChild.remove();
		}
	} else {
		return;
	}

	// Clear local storage
	localStorage.clear('items');
	checkUI();
}

function checkUI() {
	const filter = document.querySelector('.filter-area');
	const clear = document.querySelector('.clear-items');
	const items = myList.querySelectorAll('li');
	const listHeader = document.querySelector('.list-item');

	if (items.length === 0) {
		filter.style.display = 'none';
		clear.style.display = 'none';
		listHeader.classList.add('hide');
	} else {
		filter.style.display = 'block';
		clear.style.display = 'block';
		listHeader.classList.remove('hide');
	}
}

function filterItem(e) {
	const filterInput = e.target.value.toLowerCase().trim();
	const itemList = myList.querySelectorAll('li');

	itemList.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();

		if (itemName.indexOf(filterInput) !== -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

checkUI();

// Event Listener
myForm.addEventListener('submit', createItem);
myList.addEventListener('click', onClickItem);
clearAll.addEventListener('click', clearLists);
filter.addEventListener('keyup', filterItem);
document.addEventListener('DOMContentLoaded', displayItems);
