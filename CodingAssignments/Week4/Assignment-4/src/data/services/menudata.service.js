/*
Author: Morgan Reilly
Name:   menudata.service.js
About:  Data handler and manipulation for menu data
*/
(function () {
    'use strict';

    angular.module('Data')
    .service('MenuDataService', MenuDataService)
    .constant('APIBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    MenuDataService.$inject = ['$http', 'APIBasePath'];
    function MenuDataService($http, APIBasePath){
        var service = this;

        // Get All Categories
        service.getAllCategories = function () {
            return $http({
                method: "GET",
                url: (APIBasePath + "/categories.json")
            }).then(function (response){
                return getMenuCategories(response.data);
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            })
        }

        // Get Menu Items by ID
        service.getItemsForCategory = function (categoryShortName) {
            return $http({
                method: "GET",
                url: (APIBasePath + '/menu_items' + `/${categoryShortName}.json`)
            }).then(function (response){
                return getMenuCategoryByID(response.data);
            }).catch(function (error){
                console.log("Something went wrong: ", error);
            });
        }

        // Get Menu Categories    
        var getMenuCategories = function(object) {
            const menuCategoryMap = new Map();

            // Create mapping for short_name and name to return
            for (var i = 0; i < object.length; i++){
                menuCategoryMap.set(object[i].short_name, object[i].name);
            }
            return menuCategoryMap;
        }

        // Get Menu Category Items by ID
        var getMenuCategoryByID = function(object) {
            var menuItems = [];
            for (var i = 0; i < object['menu_items'].length; i++){
                menuItems.push({
                    header: object['category'].name,
                    description: object['menu_items'][i].description,
                    large_portion_name: object['menu_items'][i].large_portion_name,
                    name: object['menu_items'][i].name,
                    price_large: object['menu_items'][i].price_large,
                    price_small: object['menu_items'][i].price_small,
                    short_name: object['menu_items'][i].short_name,
                    small_portion_name: object['menu_items'][i].small_portion_name
                });
            }
            return menuItems;
        }

        // Print contents of map object
        var printOutputOfMap = function(map)  {
            map.forEach((value, key) => {
                console.log(`${key} = ${value}`);
            })
        }
    }
})();