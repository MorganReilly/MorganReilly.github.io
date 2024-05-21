(function() {
    'use strict';

    var infoController = function(MenuService, ApiPath) {
        var infoCtrl = this;
        infoCtrl.apiPath = ApiPath;

        infoCtrl.signedUp = false;

        infoCtrl.user = MenuService.getUser();
        console.log('User is', infoCtrl.user);
        if (angular.equals(infoCtrl.user, {})) {
            infoCtrl.signedUp = false;
        } else {
            infoCtrl.signedUp = true;
        }
    };

    infoController.$inject = ['MenuService', 'ApiPath'];
    angular.module('public').controller('InfoController', infoController);
})();