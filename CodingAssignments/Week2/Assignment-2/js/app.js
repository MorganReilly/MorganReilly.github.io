(function () {
'use strict';

/*
To Buy List
Declare our initial shopping list with 5 items
*/
var SHOPPING_LIST = [
    {
        item_name: "Milk",
        item_qty: "2"
    },
    {
        item_name: "Eggs",
        item_qty: "18"
    },
    {
        item_name: "Chicken",
        item_qty: "5"
    },
    {
        item_name: "Rice",
        item_qty: "3"
    },
    {
        item_name: "Coffee",
        item_qty: "10"
    }
]

/*
Declare Angular Module, Controller, and Service
*/
angular.module('ShoppingListCheckOff', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

// To Buy Controller - buyCtrl
ToBuyController.$inject = ['$scope', 'ShoppingListCheckOffService'];
function ToBuyController($scope, ShoppingListCheckOffService){
    var buyCtrl = this;

    // Get our to-buy shopping list from our service
    buyCtrl.shoppingList = ShoppingListCheckOffService.getItems();

    // Bought Click
    buyCtrl.buy = function (itemIndex, itemName, itemQty) {
        console.log("Item Clicked: ", itemIndex, itemName, itemQty)
        // Remove item
        ShoppingListCheckOffService.removeItem(itemIndex, itemName, itemQty);
    }
}

// Already Bought Controller - boughtCtrl
AlreadyBoughtController.$inject = ['$scope', 'ShoppingListCheckOffService'];
function AlreadyBoughtController($scope, ShoppingListCheckOffService){
    var boughtCtrl = this;

    boughtCtrl.addedList = ShoppingListCheckOffService.getItemsBought();

    // Reference to service.boughtList()
    // Can just reference the service object
}

// Shopping List Check Off Service
function ShoppingListCheckOffService (){
    var service = this;

    var toBuyList = SHOPPING_LIST; // Populate our toBuyList with the hard-coded list of items
    var boughtList = [];

    // Get all items to buy
    service.getItems = function () {
        console.log("service.getItems(): ", toBuyList);
        return toBuyList;
    }

    // Get all items bought
    service.getItemsBought = function (){
        console.log("service.getItemsBought():", boughtList);
        return boughtList;
    }

    // Remove item from buy list
    service.removeItem = function (index, itemName, itemQty) {
        console.log("service.removeItem(): ", index, itemName, itemQty);
        toBuyList.splice(index, 1);

        var item = {
            name: itemName,
            qty: itemQty
        };
        console.log(item);
        boughtList.push(item);
    }
}
})();