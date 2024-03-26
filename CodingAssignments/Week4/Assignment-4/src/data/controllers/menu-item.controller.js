/*
Author: Morgan Reilly
Name:   menu-item.controller.js
About:  Controller to handle found menu item display
*/
(function (){

    angular.module('Data')
    .controller('MenuItemController', MenuItemController);

    MenuItemController.$inject = ['item'];
    function MenuItemController(item) {
        var menuItemCtrl = this;
        menuItemCtrl.menuItems = [];
        
        // Unpack item (response) from resolve
        for (var i = 0; i < item.length; i++){
            menuItemCtrl.menuItems.push({
                header: item[i].header,
                description: item[i].description,
                large_portion_name: item[i].large_portion_name,
                name: item[i].name,
                price_large: item[i].price_large,
                price_small: item[i].price_small,
                short_name: item[i].short_name,
                small_portion_name: item[i].small_portion_name
            });
        }
        menuItemCtrl.menuHeader = menuItemCtrl.menuItems[0].header;
    }
})();