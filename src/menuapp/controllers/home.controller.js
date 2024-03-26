/*
Author: Morgan Reilly
Name:   home.controller.js
About:  View controller for home page
*/
(function (){
    'use strict';

    angular.module('MenuApp')
    .controller('HomePageController', HomePageController);

    HomePageController.$inject = ['$window'];
    function HomePageController($window) {
        var homePageCtrl = this;

        // Redirect links to new page from home page view
        homePageCtrl.redirectTo = function (url){
            $window.open(url, '_blank');
        }      
    }
})();