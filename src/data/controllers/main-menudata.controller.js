/*
Author: Morgan Reilly
Name:   main-menudata.controller.js
About:  View controller for available menu data
*/
(function (){
    'use strict';

    angular.module('Data')
    .controller('MenuDataController', MenuDataController);

    MenuDataController.$inject = ['categories', 'MenuDataService'];
    function MenuDataController(categories, MenuDataService) {
        var mainMenuDataCtrl = this;
        mainMenuDataCtrl.menuCategories = [];

        // Unpack map from resolve (which contains short name and name for categories)
        categories.forEach((value, key) => {
            mainMenuDataCtrl.menuCategories.push({
                short_name: key,
                name: value
            });
        })
    }
})();