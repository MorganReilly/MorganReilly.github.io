(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('APIBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var narrowItDownCtrl = this;

        narrowItDownCtrl.narrowItDownButtonClick = function (){
            var promise = MenuSearchService.getMatchedMenuItems(narrowItDownCtrl.searchTerm);

            promise.then(function (response){
                narrowItDownCtrl.descriptionList = response;
            }).catch(function (error){
                console.log("Something went wrong!");
            });
        }
    }

    MenuSearchService.$inject = ['$http', 'APIBasePath'];
    function MenuSearchService($http, APIBasePath){
        var service = this;

        service.getMatchedMenuItems = function (searchTerm){
            return $http({
                method: "GET",
                url: (APIBasePath + "/menu_items.json")
            }).then(function (response){
                return checkFullMenuForMatch(searchTerm, response.data);
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            });
        }

        var checkFullMenuForMatch = function(searchTerm, object) {
            var shortKeys = [];
            var shortKeyValueObjects = [];
            var foundMenuItemObjectMaps = new Map();

            console.log("Search Term: ", searchTerm); // Verify our search term has reached here to handle

            // TODO: Null check for search term
            if (!searchTerm == ""){
                /*
                Looping through the initial promise to sort out the data
                > shortKeys - holds the initials of the item and also will be used as our loop size below
                > shortKeyValueObjects - The object which contains data to check
                */
                Object.keys(object).forEach(key => {
                    var value = object[key];
                    // console.log(`Key: ${key}, Value: ${value}`);
                    shortKeys.push(key);
                    shortKeyValueObjects.push(value);
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
                > Return the created Map(s)
                */
                var menuItemDescriptions = [];
                for (var i = 0; i < shortKeys.length; i++){
                    if (shortKeyValueObjects[i].category.name.toUpperCase().includes(searchTerm.toUpperCase())){
                        console.log("Found: ", shortKeyValueObjects[i].category.name, shortKeyValueObjects[i].menu_items);
                        for (var j = 0; j < shortKeyValueObjects[i].menu_items.length; j++){
                            menuItemDescriptions.push(shortKeyValueObjects[i].menu_items[j].name + shortKeyValueObjects[i].menu_items[j].description); 
                        }
                        // foundMenuItemObjectMaps.set(shortKeyValueObjects[i].category.name, shortKeyValueObjects[i].menu_items);
                        foundMenuItemObjectMaps.set(shortKeyValueObjects[i].category.name, menuItemDescriptions);
                    }
                }

                // for (var i = 0; i < menuItemDescriptions.length; i++){
                //     // console.log("Description: ", menuItemDescriptions[i]);
                // }

                // for (let [key, value] of  foundMenuItemObjectMaps.entries()) {
                //     console.log(key + " = " + value)
                // }

                return menuItemDescriptions;
                // return foundMenuItemObjectMaps;
            } else {
                return "No input provided";
            }
        }
    }
})();