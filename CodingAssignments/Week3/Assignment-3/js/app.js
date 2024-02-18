(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('APIBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var narrowItDownCtrl = this;
        var menuCategoryPromise = MenuSearchService.getMenuCategories();

        // Display initial menu categories
        menuCategoryPromise.then(function (response){
            narrowItDownCtrl.menuHeaderList = response;
        }).catch(function (error){
            console.log("Something went wrong!");
        });

        // Narrow it down button and search functionality
        narrowItDownCtrl.narrowItDown = function (){
            var matchedItemsPrommise = MenuSearchService.getMatchedMenuItems(narrowItDownCtrl.searchTerm);

            matchedItemsPrommise.then(function (response){
                narrowItDownCtrl.descriptionList = response;
            }).catch(function (error){
                console.log("Something went wrong!");
            });
        }

        // Remove item button functionality
        narrowItDownCtrl.removeItem = function (itemIndex) {
            MenuSearchService.removeUnwantedItem(itemIndex);
            console.log("itemIndex", itemIndex);
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

        service.removeUnwantedItem = function (itemIndex) {
            matchedItemsList.splice(itemIndex, 1);
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
                                menuItemDescriptions.push(shortKeyValueObjects[i].menu_items[j].name + " - " + shortKeyValueObjects[i].menu_items[j].description + ". Large: $" + shortKeyValueObjects[i].menu_items[j].price_large); 
                            } else {
                                menuItemDescriptions.push(shortKeyValueObjects[i].menu_items[j].name + " - " + shortKeyValueObjects[i].menu_items[j].description + ". Small: $" + shortKeyValueObjects[i].menu_items[j].price_small + ". Large: $" + shortKeyValueObjects[i].menu_items[j].price_large); 
                            }
                            
                        }
                    }
                }
                // Converting the menuItemDescriptions to a Set to remove duplicates, then returning as an Array
                return Array.from([...new Set(menuItemDescriptions)]);
            }
            return menuItemDescriptions;
        }


    }
})();