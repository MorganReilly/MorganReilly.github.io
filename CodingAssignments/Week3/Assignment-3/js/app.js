(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .controller('FoundItemsController', FoundItemsController)
    .service('MenuSearchService', MenuSearchService)
    .constant('APIBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
    .directive('listItems', ListItems)
    .directive('foundItems', FoundItems)
    .directive('menuCategoryItems', MenuCategoryItems);

    // List Items Directive
    function ListItems() {
        var ddo = {
            template: '{{item}}'
        };
        return ddo;
    }

    // Menu Category Items Directive
    function MenuCategoryItems() {
        var ddo = {
            restrict: "E", // Element restriction
            templateUrl: 'menuCategoryItems.html'
        };
        return ddo;
    }

    // Found Items Directive
    function FoundItems() {
        var ddo = {
            templateUrl: 'foundItems.html', 
            scope:  {
                items: '<', // One-way binding
                title: '@', // DOM Attribute binding
                onRemove: '&' // Expression execution binding
            },
            controller: 'FoundItemsController as foundItemsCtrl',
            bindToController: true
        };
        return ddo;
    }

    // Controller used only for DDO isolate scope
    function FoundItemsController() {
        var foundItemsCtrl = this;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var narrowItDownCtrl = this;
        var foundItemsTitle = "Search Returned";
        
        narrowItDownCtrl.title = foundItemsTitle + " (" + 0 + " items)";
        
        // Display initial menu categories - Retrieval wrapped in a promise
        MenuSearchService.getMenuCategories().then(function (response){
            narrowItDownCtrl.menuHeaderList = response;
        }).catch(function (error){
            console.log("Something went wrong!", error);
        });

        // Narrow it down button and search functionality
        narrowItDownCtrl.narrowItDown = function (){
            // Retrieval wrapped in a promise
            MenuSearchService.getMatchedMenuItems(narrowItDownCtrl.searchTerm).then(function (response){
                // Store result of response in property called 'found' attached to the controller instance
                narrowItDownCtrl.found = response;
                narrowItDownCtrl.title = foundItemsTitle + " (" + narrowItDownCtrl.found.length + " items)"
            }).catch(function (error){
                console.log("Something went wrong!", error);
            });
        }

        // Remove item button functionality
        narrowItDownCtrl.removeItem = function (itemIndex) {
            MenuSearchService.removeUnwantedItem(itemIndex);
            console.log("Removed item at index: ", itemIndex);
            narrowItDownCtrl.title = foundItemsTitle + " (" + narrowItDownCtrl.found.length + " items)"
        }
    }

    MenuSearchService.$inject = ['$http', 'APIBasePath'];
    function MenuSearchService($http, APIBasePath){
        var service = this;
        var matchedItemsList = [];

        service.setMatchedItemsList = function (menuMatches) {
            matchedItemsList = menuMatches;
        }

        service.getMatchedItemsList = function () {
            return matchedItemsList;
        }

        service.removeUnwantedItem = function (itemIndex) {
            matchedItemsList.splice(itemIndex, 1);
        }

        service.getMatchedMenuItems = function (searchTerm){
            return $http({
                method: "GET",
                url: (APIBasePath + "/menu_items.json")
            }).then(function (response){
                service.setMatchedItemsList(checkFullMenuForMatch(searchTerm, response.data));
                return service.getMatchedItemsList();
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            });
        }

        service.getMenuCategories = function () {
            return $http({
                method: "GET",
                url: (APIBasePath + "/menu_items.json")
            }).then(function (response){
                return getMenuHeaderItems(response.data);
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            });
        }

        var getMenuHeaderItems = function(object) {
            var shortKeys = []; // shortKeys - holds the initials of the item and also will be used as our loop size below
            var shortKeyValueObjects = []; // shortKeyValueObjects - The object which contains data to check
            var menuHeaderItems = [];

            // Looping through the initial promise to sort out the data
            Object.keys(object).forEach(key => {
                shortKeys.push(key);
                shortKeyValueObjects.push(object[key]);
            });

            for (var i = 0; i < shortKeys.length; i++){
                menuHeaderItems.push(shortKeyValueObjects[i].category.name);
            }
            return menuHeaderItems;
        }

        var checkFullMenuForMatch = function(searchTerm, object) {
            var shortKeys = []; // shortKeys - holds the initials of the item and also will be used as our loop size below
            var shortKeyValueObjects = []; // shortKeyValueObjects - The object which contains data to check
            var menuItemDescriptions = [];
            console.log("Search Term: ", searchTerm); // Verify our search term has reached here to handle

            // TODO: Null check for search term
            if (!searchTerm == ""){
                // Looping through the initial promise to sort out the data
                Object.keys(object).forEach(key => {
                    shortKeys.push(key);
                    shortKeyValueObjects.push(object[key]);
                });

                /*
                Main loop to handle checking if the search term is in the menu
                > Loop over the list of short keys which defines the length
                > If the search term exists within the object body:
                    > Add the found object to a map, which will hold the following:
                        > Key - Category Name
                        > Value - Menu Item Object
                    > Both the search term and the category name is set to upper case to ease comparison
                > Comparison is done by the .includes() method
                > Printing the result to verify
                */
                for (var i = 0; i < shortKeys.length; i++){
                    if (shortKeyValueObjects[i].category.name.toUpperCase().includes(searchTerm.toUpperCase())){
                        console.log("Found: ", shortKeyValueObjects[i].category.name, shortKeyValueObjects[i].menu_items);
                        for (var j = 0; j < shortKeyValueObjects[i].menu_items.length; j++){
                            if (shortKeyValueObjects[i].menu_items[j].price_small === undefined){
                                menuItemDescriptions.push("[" + shortKeyValueObjects[i].menu_items[j].short_name + "] " + shortKeyValueObjects[i].menu_items[j].name + " - " + shortKeyValueObjects[i].menu_items[j].description + ". Large: $" + shortKeyValueObjects[i].menu_items[j].price_large); 
                            } else {
                                menuItemDescriptions.push("[" + shortKeyValueObjects[i].menu_items[j].short_name + "] " + shortKeyValueObjects[i].menu_items[j].name + " - " + shortKeyValueObjects[i].menu_items[j].description + ". Small: $" + shortKeyValueObjects[i].menu_items[j].price_small + ". Large: $" + shortKeyValueObjects[i].menu_items[j].price_large); 
                            }
                        }
                    }
                }
                // Converting the menuItemDescriptions to a Set to remove duplicates, then returning as an Array for ease of iteration
                return Array.from([...new Set(menuItemDescriptions)]);
            }
            return menuItemDescriptions;
        }
    }
})();

// Minified code:
/*
!function(){"use strict";function e(e){var t=this,n="Search Returned";t.title=n+" (0 items)",e.getMenuCategories().then(function(e){t.menuHeaderList=e}).catch(function(e){console.log("Something went wrong!",e)}),t.narrowItDown=function(){e.getMatchedMenuItems(t.searchTerm).then(function(e){t.found=e,t.title=n+" ("+t.found.length+" items)"}).catch(function(e){console.log("Something went wrong!",e)})},t.removeItem=function(r){e.removeUnwantedItem(r),console.log("Removed item at index: ",r),t.title=n+" ("+t.found.length+" items)"}}function t(e,t){var n=this,r=[];n.setMatchedItemsList=function(e){r=e},n.getMatchedItemsList=function(){return r},n.removeUnwantedItem=function(e){r.splice(e,1)},n.getMatchedMenuItems=function(r){return e({method:"GET",url:t+"/menu_items.json"}).then(function(e){return n.setMatchedItemsList(i(r,e.data)),n.getMatchedItemsList()}).catch(function(e){console.log("Something went wrong: ",e)})},n.getMenuCategories=function(){return e({method:"GET",url:t+"/menu_items.json"}).then(function(e){return o(e.data)}).catch(function(e){console.log("Something went wrong: ",e)})};var o=function(e){var t=[],n=[],r=[];Object.keys(e).forEach(r=>{t.push(r),n.push(e[r])});for(var o=0;o<t.length;o++)r.push(n[o].category.name);return r},i=function(e,t){var n=[],r=[],o=[];if(console.log("Search Term: ",e),""==!e){Object.keys(t).forEach(e=>{n.push(e),r.push(t[e])});for(var i=0;i<n.length;i++)if(r[i].category.name.toUpperCase().includes(e.toUpperCase())){console.log("Found: ",r[i].category.name,r[i].menu_items);for(var u=0;u<r[i].menu_items.length;u++)void 0===r[i].menu_items[u].price_small?o.push(r[i].menu_items[u].name+" - "+r[i].menu_items[u].description+". Large: $"+r[i].menu_items[u].price_large):o.push(r[i].menu_items[u].name+" - "+r[i].menu_items[u].description+". Small: $"+r[i].menu_items[u].price_small+". Large: $"+r[i].menu_items[u].price_large)}return Array.from([...new Set(o)])}return o}}angular.module("NarrowItDownApp",[]).controller("NarrowItDownController",e).controller("FoundItemsController",function e(){}).service("MenuSearchService",t).constant("APIBasePath","https://coursera-jhu-default-rtdb.firebaseio.com").directive("listItems",function e(){return{template:"{{item}}"}}).directive("foundItems",function e(){return{templateUrl:"foundItems.html",scope:{items:"<",title:"@",onRemove:"&"},controller:"FoundItemsController as foundItemsCtrl",bindToController:!0}}).directive("menuCategoryItems",function e(){return{restrict:"E",templateUrl:"menuCategoryItems.html"}}),e.$inject=["MenuSearchService"],t.$inject=["$http","APIBasePath"]}();
*/