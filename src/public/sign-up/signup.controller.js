(function() {
    'use strict';

    var signupController = function(MenuService) {
        var signupCtrl = this;

        signupCtrl.user = {};
        signupCtrl.favoriteDish = {};

        signupCtrl.showError = false;       // When this value is true error about the favorite dish wiil be shown
        signupCtrl.showMessage = false;     // When this value is true message about successfull signup will be shown

        signupCtrl.signup = function(form) {
            signupCtrl.showError = false;
            signupCtrl.showMessage = false;
            // If the form is not valid don't submit
            if(form.$invalid) {
                console.log('The form is not valid');
                return;
            }

            MenuService.getFavoriteDish(signupCtrl.user.favoriteDish).then(function(response) {
                signupCtrl.user.favoriteDishDetails = response.data;
                console.log(signupCtrl.favoriteDish);
                MenuService.saveUser(signupCtrl.user);
                signupCtrl.showMessage = true;
            }, function(error) {
                console.log(error);
                signupCtrl.showError = true;
            });

        }
    };


    signupController.$inject = ['MenuService'];
    angular.module('public').controller('SignupController', signupController);
})();