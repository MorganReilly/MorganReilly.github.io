/*
Author: Yaakov Chaikin
Name:   loadingspinner.component.js
About:  Component to handle router state transition events
*/
(function () {
  'use strict';

  angular.module('Spinner')
  .component('loadingSpinner', {
    templateUrl: 'src/spinner/templates/loadingspinner.template.html',
    controller: SpinnerController
  });

  SpinnerController.$inject = ['$rootScope']
  function SpinnerController($rootScope) {
    var $ctrl = this;
    var cancellers = [];

    // On Init
    $ctrl.$onInit = function () {

      // State Change Start
      var cancel = $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){
        $ctrl.showSpinner = true;
      });
      cancellers.push(cancel);

      // State Change Success
      cancel = $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        $ctrl.showSpinner = false;
      });
      cancellers.push(cancel);

      // State Change Error
      cancel = $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        $ctrl.showSpinner = false;
      });
      cancellers.push(cancel);
    };

    // On Destroy 
    $ctrl.$onDestroy = function () {
      cancellers.forEach(function (item) {
        item();
      });
    };
    
  };
})();
