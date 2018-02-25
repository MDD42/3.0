
function showShop(){																								
	document.getElementById('shopping-list').style.display ='block';
	document.getElementById('done-list').style.display = 'none';
	document.getElementById('del-list').style.display = 'none';
}
function showDone(){
	document.getElementById('shopping-list').style.display ='none';
	document.getElementById('done-list').style.display = 'block';
	document.getElementById('del-list').style.display = 'none';
}
function showDel(){
	document.getElementById('shopping-list').style.display ='none';
	document.getElementById('done-list').style.display = 'none';
	document.getElementById('del-list').style.display = 'block';
}



var tableShop = document.getElementById('table-shop'),					
tableDone 	= document.getElementById('table-done'),
tableDel 		= document.getElementById('table-del'),
shopList 	= [],
id = 1;

window.onload = function(){
	if (localStorage.getItem('shopList') != undefined) {
		shopList = JSON.parse(localStorage.getItem('shopList'));
		outFromLocalStorage(shopList);
		id = +JSON.parse(localStorage.getItem('id'));
		totalPrice();
	}

}
function outFromLocalStorage(arr){
	for (var i = 0; i < arr.length; i++) {
		if(!shopList[i].done && !shopList[i].del && !shopList[i].fullDel){
			put(tableShop, arr[i]);
		}
		else if(shopList[i].done && !shopList[i].del && !shopList[i].fullDel){
			put(tableDone, arr[i]);
		}
		else if(shopList[i].del && !shopList[i].fullDel){
			put(tableDel, arr[i]);
		}
	}
}

function Purchase(id, done, del, item, quantity, price) {					
	this.id = id;
	this.done = done;
	this.del = del;
	this.item = item;
	this.quantity = quantity;
	this.price = price;
}

//Действие на кнопку Добавить через конструктор заносми в массив новую покупку, 
// отправляем ее функции put с таблицей в которую нужно.
document.getElementById('add').onclick = function (){
	shopList[shopList.length] = new Purchase(id++, false, false, 
		document.getElementById('item').value, 
		document.getElementById('quantity').value, 
		document.getElementById('price').value);
	localStorage.setItem('shopList', JSON.stringify(shopList));
	localStorage.setItem('id', JSON.stringify(id));
	put(tableShop, shopList[shopList.length-1]);
	ClearForm();
	totalPrice();
}

// Добавляем строку в таблице
function addRow(targetTable){
	tr 						= document.createElement('tr'),
	tdNumber 			= document.createElement('td'),
	tdDone 				= document.createElement('td'),
	tdItem				= document.createElement('td'),
	tdQuantity 		= document.createElement('td'),
	tdPrice 			= document.createElement('td'),
	tdAction 			= document.createElement('td');
	editButton 	= document.createElement('button');
	editButton.innerHTML = '<strong>&#9998;</strong>';
	editButton.className = 'edit';
	editButton.setAttribute('onclick', 'edit(this.parentElement);');
	removeButton 	= document.createElement('button');
	removeButton.innerHTML = '<strong>&#215;</strong>';
	removeButton.className = 'remove';		
	removeButton.setAttribute('onclick', 'remove(this.parentElement);');
	tr.appendChild(tdNumber);
	tr.appendChild(tdDone);
	tr.appendChild(tdItem);
	tr.appendChild(tdQuantity);
	tr.appendChild(tdPrice);
	tr.appendChild(tdAction);
	tdAction.appendChild(editButton);
	tdAction.appendChild(removeButton);
	targetTable.appendChild(tr);
}

//функция добавляющая или перемещающая строки из таблицы в таблицу
function put(targetTable, parent){
	addRow(targetTable);
	tdNumber.innerHTML = parent.id;
	if (targetTable == tableDone) {
		tdDone.innerHTML = '<input type="checkbox" class="done" onclick="done(this.parentElement);" checked />';
	}else if(parent.done){
		tdDone.innerHTML = '<input type="checkbox" class="done" onclick="done(this.parentElement);" checked />';
	}
	else{
		tdDone.innerHTML = '<input type="checkbox" class="done" onclick="done(this.parentElement);" />';
	}
	tdItem.innerHTML 			= parent.item;
	tdQuantity.innerHTML 	= parent.quantity;
	tdPrice.innerHTML 		= parent.price;
	if (targetTable == tableDone) {
		editButton.style.display='none';
	}
	if(targetTable == tableDel){
		editButton.style.display='none';
		removeButton.setAttribute('onclick', 'fullremove(this.parentElement);');
	}
}


function done(item) {
	if (!item.getElementsByTagName('input')[0].checked) {
		var id = item.parentElement.getElementsByTagName('td')[0].innerHTML - 1;
		purchase = shopList[id];
		purchase.done = false;
		purchase.del = false;
		put(tableShop, purchase);
		item.parentElement.parentElement.removeChild(item.parentElement);
		localStorage.setItem('shopList', JSON.stringify(shopList))
	}
	else {
		var id = item.parentElement.getElementsByTagName('td')[0].innerHTML - 1;
		purchase = shopList[id];
		purchase.del = false;
		purchase.done = true;
		put(tableDone, purchase);
		item.parentElement.parentElement.removeChild(item.parentElement);
		localStorage.setItem('shopList', JSON.stringify(shopList))
	}
	totalPrice();		
}

function remove(item) {		
	var id = item.parentElement.getElementsByTagName('td')[0].innerHTML - 1;
	purchase = shopList[id];
	purchase.del = true;
	put(tableDel, purchase);
	item.parentElement.parentElement.removeChild(item.parentElement);
	ClearForm();
	localStorage.setItem('shopList', JSON.stringify(shopList))
	totalPrice();
}


function fullremove(item) {		
	var id = item.parentElement.getElementsByTagName('td')[0].innerHTML - 1;
	shopList[id].done = false;
	shopList[id].del = false;
	shopList[id].fullDel = true;
	var parent = item.parentElement;
	parent.parentElement.removeChild(parent);
	totalPrice();
	localStorage.setItem('shopList', JSON.stringify(shopList))
}


function edit(item) {
	document.getElementById('add').style.display = "none";
	var arrOfActive = document.getElementsByTagName('tr');
	for (var i = 0; i < arrOfActive.length; i++) {
		arrOfActive[i].classList.remove('active');
	}
	console.log(document.getElementsByClassName('form')[0]);
	document.getElementsByClassName('form')[0].removeChild(document.getElementsByClassName('form')[0].lastChild)

	var id = item.parentElement.getElementsByTagName('td')[0].innerHTML - 1;
	purchase = shopList[id];
	document.getElementById('item').value = purchase.item;
	document.getElementById('quantity').value = purchase.quantity;
	document.getElementById('price').value = purchase.price;
	
	var parent = item.parentElement;
	parent.className = "active";

	updateButton = document.createElement('button');
	updateButton.innerHTML = 'Update';
	updateButton.id = 'update';
	document.getElementsByClassName('form')[0].appendChild(updateButton);

	document.getElementById('update').onclick = function (){
		for (var i = 0; i < arrOfActive.length; i++) {
			arrOfActive[i].classList.remove('active');
		}
		purchase.item = document.getElementById('item').value;
		purchase.quantity = document.getElementById('quantity').value;
		purchase.price = document.getElementById('price').value;
		parent.getElementsByTagName('td')[2].innerHTML = purchase.item; 
		parent.getElementsByTagName('td')[3].innerHTML = purchase.quantity; 
		parent.getElementsByTagName('td')[4].innerHTML = purchase.price;
		document.getElementById('update').style.display = "none";
		document.getElementById('add').style.display = "inline-block";
		localStorage.setItem('shopList', JSON.stringify(shopList))
		ClearForm();
		totalPrice();
	}
}

function ClearForm(){
	document.getElementById('item').value = "";
	document.getElementById('quantity').value = "";
	document.getElementById('price').value = "";
}

function totalPrice(){
	function totalPriceShop(){	
		var totalPriceShop = 0;
		for (var i = 0; i < shopList.length; i++) {
			if(!shopList[i].done && !shopList[i].del && !shopList[i].fullDel){
				totalPriceShop += +shopList[i].price;
			}
		}
		return totalPriceShop.toFixed(2);
	}
	document.getElementById('totalPriceShop').innerHTML = totalPriceShop();
	function totalPriceDone(){	
		var totalPriceDone = 0;
		for (var i = 0; i < shopList.length; i++) {
			if(shopList[i].done && !shopList[i].del && !shopList[i].fullDel){
				totalPriceDone += +shopList[i].price;
			}
		}
		return totalPriceDone.toFixed(2);
	}
	document.getElementById('totalPriceDone').innerHTML = totalPriceDone();
	function totalPriceDel(){	
		var totalPriceDel = 0;
		for (var i = 0; i < shopList.length; i++) {
			if(shopList[i].del && !shopList[i].fullDel){
				totalPriceDel += +shopList[i].price;
			}
		}
		return totalPriceDel.toFixed(2);
	}
	document.getElementById('totalPriceDel').innerHTML = totalPriceDel();
}


