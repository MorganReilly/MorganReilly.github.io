/*
Author: Morgan Reilly
Name:   items.component.js
About:  Component declaration - similar to DDO
*/
(function (){
    'use strict'

    angular.module('Data')
    .component('items', {
        templateUrl: 'src/menuapp/templates/items.template.html',
        bindings: {
            items: '<' // One-way binding
        }
    });
})();