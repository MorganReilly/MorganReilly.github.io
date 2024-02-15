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
                console.log("Main response: ", response);



            }).catch(function (error){
                console.log("Something went wrong!");
            });
        }
    }

    MenuSearchService.$inject = ['$http', 'APIBasePath'];
    function MenuSearchService($http, APIBasePath){
        var service = this;
        var MENU_ITEMS = "/menu_items.json";
        var CATEGORIES = "/categories.json";

        service.getMatchedMenuItems = function (searchTerm){
            return $http({
                method: "GET",
                url: (APIBasePath + MENU_ITEMS)
            }).then(function (response){
                var foundMenuItemObjectMaps = checkFullMenuForMatch(searchTerm, response.data);
                // console.log(foundMenuItemObjectMaps.size);

                return foundMenuItemObjectMaps;
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            });
        }

        var checkFullMenuForMatch = function(searchTerm, object) {
            console.log("Search Term: ", searchTerm);

            var shortKeys = [];
            var shortKeyValueObjects = [];
            var foundMenuItemObjectMaps = new Map();

            Object.keys(object).forEach(key => {
                var value = object[key];
                // console.log(`Key: ${key}, Value: ${value}`);

                shortKeys.push(key);
                shortKeyValueObjects.push(value);
            });

            for (var i = 0; i < shortKeys.length; i++){
                if (shortKeyValueObjects[i].category.name.toUpperCase().includes(searchTerm.toUpperCase())){
                    console.log("Found: ", shortKeyValueObjects[i].category.name, shortKeyValueObjects[i].menu_items);
                    foundMenuItemObjectMaps.set(shortKeyValueObjects[i].category.name, shortKeyValueObjects[i].menu_items);
                    // console.log("Found: ", foundMenuItemObjectMaps);
                }
            }
            // console.log(foundMenuItemObjectMaps.size);
            return foundMenuItemObjectMaps;
        }








        

        // /*
        // Below code is for Menu Categories 
        // */
        // var getMenuCategories = function(searchTerm){
        //     return $http({
        //         method: "GET",
        //         url: (APIBasePath + CATEGORIES)
        //     }).then(function (response){
        //         var matches = checkMenuCategoriesForMatch(searchTerm, response.data);
        //         return matches;
        //     }).catch(function (error){
        //         console.log("Something went wrong: ", error);
        //     });
        // }

        // // Check Entries
        // var checkMenuCategoriesForMatch = function(searchTerm, list){
        //     // searchTerm = searchTerm.toUpperCase();
        //     // console.log("service.checkEntries()");

        //     var foundShortCodes = [];
        //     for (var i = 0; i < list.length; i++){
        //         if (list[i].name.toUpperCase().includes(searchTerm.toUpperCase())){
        //             console.log("Found ", list[i].name, list[i]);
        //             foundShortCodes.push(list[i].short_name);
        //         }
        //     }
        //     // console.log(foundShortCodes);
        //     return foundShortCodes;
        // }
    }
})();