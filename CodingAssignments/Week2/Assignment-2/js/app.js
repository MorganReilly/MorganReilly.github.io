(function () {
'use strict';

/*
To Buy List
Declare our initial shopping list
*/
var SHOPPING_LIST = [
    {
        item_name: "Litres of Milk",
        item_qty: "2"
    },
    {
        item_name: "Eggs",
        item_qty: "18"
    },
    {
        item_name: "Chicken Breasts",
        item_qty: "5"
    },
    {
        item_name: "Bags of Rice",
        item_qty: "3"
    },
    {
        item_name: "Jar of Coffee",
        item_qty: "1"
    },
    {
        item_name: "Loaf of Bread",
        item_qty: "1"
    },
    {
        item_name: "Bananas",
        item_qty: "5"
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
ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService){
    var buyCtrl = this;

    // Get our to-buy shopping list from our service
    buyCtrl.toBuyList = ShoppingListCheckOffService.getItemsToBuy();

    // Bought Click
    buyCtrl.buy = function (itemIndex, itemName, itemQty) {
        console.log("buyCtrl.buy(): ", itemIndex, itemName, itemQty)
        // Remove item
        ShoppingListCheckOffService.removeItem(itemIndex, itemName, itemQty);
        // Add item
        ShoppingListCheckOffService.addItem(itemName, itemQty);
    }
}

// Already Bought Controller - boughtCtrl
AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService){
    var boughtCtrl = this;

    // Get any item in the bought list
    boughtCtrl.boughtList = ShoppingListCheckOffService.getItemsBought();
}

// Shopping List Check Off Service
function ShoppingListCheckOffService (){
    var service = this;

    var toBuyList = SHOPPING_LIST; // Populate our toBuyList with the hard-coded list of items
    var boughtList = []; // Empty list to populate for bought items

    // Get all items to buy
    service.getItemsToBuy = function () {
        console.log("service.getItemsToBuy(): ", toBuyList);
        return toBuyList;
    }

    // Get all items bought
    service.getItemsBought = function (){
        console.log("service.getItemsBought():", boughtList);
        return boughtList;
    }

    // Add an item to the bought list
    service.addItem = function (itemName, itemQty){
        var item = {
            name: itemName,
            qty: itemQty
        };
        console.log("service.addItem(): ", item);
        boughtList.push(item);
    }   

    // Remove item from buy list
    service.removeItem = function (index) {
        console.log("service.removeItem(): ", index);
        toBuyList.splice(index, 1);
    }
}
})();

// Minified Code
// !function(){"use strict";var e=[{item_name:"Litres of Milk",item_qty:"2"},{item_name:"Eggs",item_qty:"18"},{item_name:"Chicken Breasts",item_qty:"5"},{item_name:"Bags of Rice",item_qty:"3"},{item_name:"Jar of Coffee",item_qty:"1"},{item_name:"Loaf of Bread",item_qty:"1"},{item_name:"Bananas",item_qty:"5"}];function t(e){var t=this;t.toBuyList=e.getItemsToBuy(),t.buy=function(t,i,o){console.log("Item Clicked: ",t,i,o),e.removeItem(t,i,o),e.addItem(i,o)}}function i(e){var t=this;t.boughtList=e.getItemsBought()}angular.module("ShoppingListCheckOff",[]).controller("ToBuyController",t).controller("AlreadyBoughtController",i).service("ShoppingListCheckOffService",function t(){var i=this,o=e,n=[];i.getItemsToBuy=function(){return console.log("service.getItemsToBuy(): ",o),o},i.getItemsBought=function(){return console.log("service.getItemsBought():",n),n},i.addItem=function(e,t){var i={name:e,qty:t};console.log("service.addItem(): ",i),n.push(i)},i.removeItem=function(e){console.log("service.removeItem(): ",e),o.splice(e,1)}}),t.$inject=["ShoppingListCheckOffService"],i.$inject=["ShoppingListCheckOffService"]}();