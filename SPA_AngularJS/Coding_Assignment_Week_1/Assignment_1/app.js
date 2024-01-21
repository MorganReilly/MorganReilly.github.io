(function (){
'use strict';

angular.module('LunchCheck', [])
.controller('LunchCheckController', LunchCheckController);

LunchCheckController.$inject = ['$scope'];
function LunchCheckController($scope){
    // ng-click check entry functionality
    $scope.check = function () {

        // Check that entry insn't an empty string
        if (!$scope.dishes == ""){
            var dishList = $scope.dishes.split(','); // Split elements by comma: ','
            console.log("dishList = [", dishList.toString(), "]");
            
            var emptyCount = 0;
            for (var i = 0; i < dishList.length; i++){
                dishList[i] = dishList[i].trim(); // Trim whitespace in each entry
                // Check for empty element in list
                if (dishList[i] == ""){
                    emptyCount++;
                }
            }

            // Include empty elements in count to get correct number of entriesi
            var totalDishes = dishList.length - emptyCount;
            console.log(totalDishes);

            // Display response based on number of entries
            if (totalDishes <= 3 && totalDishes > 0){
                $scope.response = "Enjoy!";
                console.log($scope.response);
            } else if (totalDishes > 3) {
                $scope.response = "Too much!";
                console.log($scope.response);
            }
        } else {
            $scope.response = "Please enter data first!";
        }
    }
}
}
)();

// Minified code:
// !function(){"use strict";function e(e){e.check=function(){if(""==!e.dishes){var o=e.dishes.split(",");console.log("dishList = [",o.toString(),"]");for(var s=0,n=0;n<o.length;n++)o[n]=o[n].trim(),""==o[n]&&s++;var r=o.length-s;console.log(r),r<=3&&r>0?(e.response="Enjoy!",console.log(e.response)):r>3&&(e.response="Too much!",console.log(e.response))}else e.response="Please enter data first!"}}angular.module("LunchCheck",[]).controller("LunchCheckController",e),e.$inject=["$scope"]}();