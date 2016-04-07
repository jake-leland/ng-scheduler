(function () {
    'use strict';

    angular
        .module('app.manage')
        .controller('Manage', Manage)
        .config(function ($mdIconProvider) {
            $mdIconProvider
                .icon('add', 'content/img/icons/ic_add_black_24px.svg', 24)
                .icon('clear', 'content/img/icons/ic_clear_black_24px.svg', 24);
        });

    Manage.$inject = ['$rootScope', '$scope', '$http', '$q', 'common', 'config'];

    /* @ngInject */
    function Manage($rootScope, $scope, $http, $q, common, config) {
        loadData();
        initManager();

        function loadData() {
            $rootScope.mySections = [];
            $scope.subjects = {};
            $scope.searchNames = [];

            $http.get('content/data/subjects.json')
                .then(function (res) {
                    var subjects = res.data;

                    $.each(subjects, function (index, value) {
                        getSubjectData(value);
                    });

                    function getSubjectData(subject) {
                        $http.get('content/data/subjects/' + subject + '.json')
                            .then(function (res) {
                                $scope.subjects[subject] = res.data;
                                $.each($scope.subjects[subject].courses, function (key, value) {
                                    $scope.searchNames.push({
                                        subject: subject,
                                        course: key,
                                        display: subject + " " + key + " (" + common.toTitleCase(value.title) + ")",
                                        value: angular.lowercase(subject + " " + key + " (" + value.title + ")")
                                    })
                                });
                            });
                        initAutocomplete();

                        function initAutocomplete() {
                            // list of `state` value/display objects
                            $scope.selectedCourse = null;
                            $scope.searchText = null;
                            $scope.querySearch = querySearch;
                            // ******************************
                            // Internal methods
                            // ******************************
                            /**
                             * Search for states... use $timeout to simulate
                             * remote dataservice call.
                             */
                            function querySearch(query) {
                                var results = query ? $scope.searchNames.filter(createFilterFor(query)) : $scope.searchNames;
                                var deferred = $q.defer();
                                deferred.resolve(results);
                                return deferred.promise;
                            }

                            /**
                             * Create filter function for a query string
                             */
                            function createFilterFor(query) {
                                var lowercaseQuery = angular.lowercase(query);
                                return function filterFn(course) {
                                    return (course.value.indexOf(lowercaseQuery) === 0);
                                };
                            }
                        }
                    }
                });
        }

        function initManager() {

            var tabs = [];
            $scope.tabs = tabs;
            $scope.selectedIndex = null;
            $scope.addCourse = function (course) {
                var tab = {
                    title: course.subject + " " + course.course,
                    subject: course.subject,
                    course: course.course,
                    disabled: false
                };
                if (common.indexOfObject(tabs, tab) == -1) {
                    tabs.push(tab);
                }
            };
            $scope.removeCourse = function (tab) {
                var index = tabs.indexOf(tab);
                tabs.splice(index, 1);
            };
            $scope.toggleSection = function (section) {
                var i = $rootScope.mySections.indexOf(section);
                if (i > -1) {
                    $rootScope.mySections.splice(i, 1);
                }
                else {
                    $rootScope.mySections.push(section);
                }
            }


        }
    }
})();
