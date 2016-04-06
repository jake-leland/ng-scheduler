(function () {
    'use strict';

    angular
        .module('app')
        .controller('Scheduler', Scheduler)
        .config(function ($mdIconProvider) {
            $mdIconProvider
                .icon('add', 'content/img/icons/ic_add_black_24px.svg', 24)
                .icon('clear', 'content/img/icons/ic_clear_black_24px.svg', 24);
        });

    Scheduler.$inject = ['$scope', '$http', 'common', 'config'];

    /* @ngInject */
    function Scheduler($scope, $http, common, config) {

        $scope.data = {};
        $scope.names = {};

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
                            for (var course in res.data) {
                                if (res.data.hasOwnProperty(course)) {
                                    $scope.names[subject + course] = {
                                        subject: subject,
                                        course: course,
                                        display: subject + " " + course
                                    }
                                }
                            }
                        });
                }
            });

        function getMatches(searchTexts) {
            var items = [];
            var searchPatt = new RegExp("^" + searchTexts.toUpperCase().replace(/ |-/, ''));
            $.each($scope.names, function (key, value) {
                if (searchPatt.test(key)) {
                    items.push(value);
                }
            });
            return items;
        }

        $scope.savedCourses = {};

        function addCourse(selectedName) {
            $scope.savedCourses[selectedName.subject + selectedName.course] = $scope.names[selectedName.subject + selectedName.course];
        }

        function removeCourse(course) {
            delete $scope.savedCourses[course.subject + course.course];
        }

        var h = parseInt($('#sched-times').css('height'));

        $scope.times = [];
        $scope.lines = [];
        for (var i = Math.ceil(common.timeToHrs(config.schedule.minTime)); i <= Math.floor(common.timeToHrs(config.schedule.maxTime)); i++) {
            $scope.times.push({
                style: {
                    // -7px assumes font size 10px
                    'top': h * common.hrsToPct(i) - 6 + 'px'
                },
                text: common.hrsToTime(i)
            });
            $scope.lines.push({
                style: {
                    'top': h * common.hrsToPct(i) + 'px'
                }
            });
        }

        $scope.classes = {};
        $scope.classes.M = {};
        $scope.classes.T = {};
        $scope.classes.W = {};
        $scope.classes.R = {};
        $scope.classes.F = {};

        function parseSection(section) {
            for (var i = 0; i < section.classes; i++) {
                for (var j = 0; j < section.days[i].length; j++) {
                    createClass(section.crn + '-' + i, section.days[i][j], section.time[i]);
                }
            }

            function createClass(id, day, time) {
                time = time.split('-');
                var startTime = time[0];
                var endTime = time[1];
                $scope.classes[day][id] = {
                    style: {
                        'top': h * common.timeToPct(startTime) + 'px',
                        'height': h * (common.timeToPct(endTime) - common.timeToPct(startTime)) + 'px',
                        'margin-bottom': -h * (common.timeToPct(endTime) - common.timeToPct(startTime)) + 'px'
                    },
                    title: common.toTitleCase(section.title),
                    subject: section.subject,
                    course: section.course,
                    section: section.section

                };
            }
        }

        $scope.$parent.$parent.parseSection = parseSection;
        $scope.$parent.$parent.getMatches = getMatches;
        $scope.$parent.$parent.addCourse = addCourse;
        $scope.$parent.$parent.removeCourse = removeCourse;
    }
})();
