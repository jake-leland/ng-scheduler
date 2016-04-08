(function () {
    'use strict';

    angular
        .module('app.schedule')
        .controller('Schedule', Schedule);

    Schedule.$inject = ['$rootScope', '$scope', '$http', '$timeout', 'common', 'config'];

    /* @ngInject */
    function Schedule($rootScope, $scope, $http, $timeout, common, config) {
        var h = 0;

        initTable();

        $rootScope.$watchCollection('mySections', function (newVal, oldVal) {
            if (newVal) {
                updateClasses(newVal);
            }
        });

        function updateClasses(sections) {
            $scope.classes = {
                M: {},
                T: {},
                W: {},
                R: {},
                F: {}
            };

            $.each(sections, function (key, value) {
                parseSection(value);
            });

            function parseSection(section) {
                for (var i = 0; i < section.classes; i++) {
                    for (var j = 0; j < section.days[i].length; j++) {
                        if (section.time[i] != 'WEB') {
                            createClass(section.crn + '-' + i, section.days[i][j], section.time[i]);
                        }
                    }
                }

                function createClass(id, day, time) {
                    var startTime = time.split('-')[0];
                    var endTime = time.split('-')[1];
                    $scope.classes[day][id] = {
                        style: {
                            'top': h * common.timeToPct(startTime) + 'px',
                            'height': h * (common.timeToPct(endTime) - common.timeToPct(startTime)) + 5 + 'px',
                            'margin-bottom': -h * (common.timeToPct(endTime) - common.timeToPct(startTime)) - 5 + 'px'
                        },
                        title: common.toTitleCase(section.title),
                        subject: section.subject,
                        course: section.course,
                        section: section.section,
                        time: time
                    };
                }
            }
        }

        function initTable() {
            $scope.dayNames = {
                M: "Monday",
                T: "Tuesday",
                W: "Wednesday",
                R: "Thursday",
                F: "Friday"
            };

            // timeout to wait until ng-repeat finishes
            $timeout(afterNg, 0);


            function afterNg() {
                $('.sched-day').before('<md-divider></md-divider>');

                h = parseInt($('#sched-times').css('height'));
                $rootScope.times = [];
                $rootScope.lines = [];
                for (var i = Math.ceil(common.timeToHrs(config.schedule.minTime)); i <= Math.floor(common.timeToHrs(config.schedule.maxTime)); i++) {
                    $rootScope.times.push({
                        style: {
                            // -6px assumes font size 10px
                            'top': h * common.hrsToPct(i) - 6 + 'px'
                        },
                        text: common.hrsToTime(i)
                    });
                    $rootScope.lines.push({
                        style: {
                            'top': h * common.hrsToPct(i) + 'px'
                        }
                    });
                }
            }
        }
    }
})();
