(function () {
    'use strict';

    angular
        .module('app')
        .controller('Inspect', Inspect);

    Inspect.$inject = ['$scope', '$http'];

    /* @ngInject */
    function Inspect($scope, $http) {
        $http.get('content/tamu.json')
            .then(function (res) {
                $scope.data = res.data;
            });
    }
})();
