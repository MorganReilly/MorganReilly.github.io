/*
Author: Morgan Reilly
Name:   route.js
About:  File handling all routing for application
*/
(function () {
    'use strict';

    // Configure module to use routing through .config method
    angular.module('MenuApp')
        .config(RoutesConfig);

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {
        // Redirect to home should no other URL match
        $urlRouterProvider.otherwise('/');

        // UI States
        $stateProvider
        // Home
        .state('home',{
            url: '/',
            templateUrl: 'src/menuapp/templates/home.template.html'
        })
        // Categories
        .state('categories', {
            url: '/categories',
            templateUrl: 'src/menuapp/templates/main-categories.template.html',
            controller: 'MenuDataController as mainMenuDataCtrl',
            resolve: {
                categories: ['MenuDataService', function (MenuDataService) {
                    return MenuDataService.getAllCategories(); // Immediately return promise
                }]
            }
        })
        // Items
        .state('items', {
            url: '/item/{itemId}',
            templateUrl: 'src/menuapp/templates/items-detail.template.html',
            controller: 'MenuItemController as menuItemCtrl',
            resolve: {
                // $stateParams - gives value of passed in parameter within url
                item: ['$stateParams', 'MenuDataService', 
                    function ($stateParams, MenuDataService) {
                        return MenuDataService.getItemsForCategory($stateParams['itemId'])
                        .then(function (response) {
                            return response;
                        });
                    }]
            }
        })
    }
})();