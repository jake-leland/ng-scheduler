(function () {
    'use strict';

    angular
        .module('app')
        .controller('Inspect', Inspect);

    Inspect.$inject = ['$scope', '$http'];

    /* @ngInject */
    function Inspect($scope, $http) {
        $scope.data = {};

        $http.get('content/data/subjects.json')
            .then(function (res) {
                var subjects = res.data;

                $.each(subjects, function (index, value) {
                    getSubjectData(value);
                });

                function getSubjectData(subject) {
                    $http.get('content/data/subjects/' + subject + '.json')
                        .then(function (res) {
                            $scope.data[subject] = res.data;
                        });
                }
            });
    }
})();
