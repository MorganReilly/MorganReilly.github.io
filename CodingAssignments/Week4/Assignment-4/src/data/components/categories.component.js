/*
Author: Morgan Reilly
Name:   categories.component.js
About:  Component declaration - similar to DDO
*/
(function (){
    'use strict'

    angular.module('Data')
    .component('categories', {
        templateUrl: 'src/menuapp/templates/categories.template.html',
        bindings: {
            items: '<' // One-way binding
        }
    });
})();