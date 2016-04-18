(function () {
    'use strict';

    angular
        .module('app.manage')
        .controller('Manage', Manage);

    Manage.$inject = ['$rootScope', '$scope', '$http', '$q', '$timeout', 'common', 'config'];

    /* @ngInject */
    function Manage($rootScope, $scope, $http, $q, $timeout, common, config) {
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
                            $scope.selectedCourse = null;
                            $scope.searchText = null;
                            $scope.querySearch = querySearch;


                            function querySearch(query) {
                                var results = query ? $scope.searchNames.filter(createFilterFor(query)) : $scope.searchNames;
                                var deferred = $q.defer();
                                deferred.resolve(results);
                                return deferred.promise;
                            }

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

            function getSectionListing(subject, course) {
                var list = {};
                $.each($scope.subjects[subject].courses[course].sections, function (key, value) {
                    if (!list[value.title]) {
                        list[value.title] = {};
                    }
                    if (!list[value.title][value.instructor[0]]) {
                        list[value.title][value.instructor[0]] = {};
                    }
                    list[value.title][value.instructor[0]][value.section] = value;
                });

                return list;
            }

            $timeout(afterNg, 0);

            // position remove button
            function afterNg() {
                $('md-tabs-wrapper').wrap('<div id="custom-tab-top" class="layout-row"></div>');
                $('md-tabs-wrapper').addClass('flex');
                $('#custom-tab-top').append($('#remove'));
            }

            $scope.addCourse = function (course) {
                if(!$scope.showClose) {
                    $scope.showClose = true;
                }
                var tab = {
                    title: course.subject + " " + course.course,
                    subject: course.subject,
                    course: course.course,
                    sectionListing: getSectionListing(course.subject, course.course),
                    disabled: false
                };
                if (common.indexOfObject(tabs, tab) == -1) {
                    tabs.push(tab);
                }
            };
            $scope.removeCourse = function (tab) {
                var index = tabs.indexOf(tab);
                tabs.splice(index, 1);
                var matchingSections = $.grep($rootScope.mySections, function (section) {
                    return (section.subject == tab.subject && section.course == tab.course);
                });
                $.each(matchingSections, function (index, value) {
                    var i = $rootScope.mySections.indexOf(value);
                    $rootScope.mySections.splice(i, 1);
                });
                if(tabs.length == 0) {
                    $scope.showClose = false;
                }
            };
            $scope.toggleSection = function (section) {
                var i = $rootScope.mySections.indexOf(section);
                if (i > -1) {
                    $rootScope.mySections.splice(i, 1);
                }
                else {
                    $rootScope.mySections.push(section);
                }
            };
        }
    }
})();
