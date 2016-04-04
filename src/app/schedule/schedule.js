(function () {
    'use strict';

    angular
        .module('app')
        .controller('Schedule', Schedule);

    Schedule.$inject = ['$scope'];

    var minTime = 7;
    var maxTime = 21;

    function Schedule($scope) {
        function parseSection(section) {
            for (var i = 0; i < section.instructor.length; i++) {
                for (var j = 0; j < section.days[i].length; j++) {
                    createClass(section.days[i][j], section.time[i]);
                }
            }

            function createClass(day, time) {
                time = time.split('-');
                var startTime = time[0];
                var endTime = time[1];
                var day = $('#sched-' + day);
                var h = parseInt(day.css('height'));
                var c = $('<div/>', {
                    class: 'class'
                }).css({
                    top: h * timeToPct(startTime),
                    height: h * (timeToPct(endTime) - timeToPct(startTime))
                });
                day.append(c);

                function timeToPct(time) {
                    time = time.split(/:| /);
                    var hours = parseInt(time[0].replace('12', '00'));
                    var minutes = parseInt(time[1]);
                    if (time[2] == 'pm') {
                        hours += 12;
                    }
                    return ((hours + minutes / 60) - minTime) / (maxTime - minTime);
                }
            }
        }

        $scope.$parent.$parent.parseSection = parseSection;
    }
})();
