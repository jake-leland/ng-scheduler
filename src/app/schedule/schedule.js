(function () {
    'use strict';

    angular
        .module('app')
        .controller('Schedule', Schedule);

    Schedule.$inject = ['$scope', 'common', 'config'];

    /* @ngInject */
    function Schedule($scope, common, config) {
        var h = parseInt($('#sched-times').css('height'));

        $scope.times = [];
        $scope.lines = [];
        for (var i = Math.ceil(common.timeToHrs(config.schedule.minTime)); i <= Math.floor(common.timeToHrs(config.schedule.maxTime)); i++) {
            $scope.times.push({
                style: {
                    // -7px assumes font size 10px
                    'top': h * common.hrsToPct(i) - 7 + 'px'
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
    }
})();
