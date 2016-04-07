(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('common', common);

    common.$inject = ['config'];

    /* @ngInject */
    function common(config) {

        var service = {
            toTitleCase: toTitleCase,
            timeToPct: timeToPct,
            timeToHrs: timeToHrs,
            hrsToPct: hrsToPct,
            hrsToTime: hrsToTime,
            indexOfObject: indexOfObject
        };

        return service;
        //////////////////////

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        function timeToPct(time) {
            return hrsToPct(timeToHrs(time));
        }

        function timeToHrs(time) {
            time = time.split(/:| /);
            var hrs = parseInt(time[0].replace('12', '00'));
            var mins = parseInt(time[1]);
            if (time[2] == 'pm') {
                hrs += 12;
            }
            return hrs + mins / 60;
        }

        function hrsToPct(hrs) {
            var dayLength = timeToHrs(config.schedule.maxTime) - timeToHrs(config.schedule.minTime);
            return (hrs - timeToHrs(config.schedule.minTime)) / dayLength;
        }

        function hrsToTime(hrs) {
            var dec = hrs % 1;
            var mins = dec * 60;
            var hours = Math.floor(hrs);
            var ampm = "";

            if (hours < 12) {
                ampm = "am";
            } else {
                ampm = "pm";
                hours -= 12;
            }

            if (hours == 0) {
                hours += 12;
            }

            if (mins < 10) {
                mins = '0' + mins;
            }

            return hours + ":" + mins + " " + ampm;
        }

        function indexOfObject(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], obj)) {
                    return i;
                }
            }
            return -1;
        }
    }
})();