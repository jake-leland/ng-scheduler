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
            hrsToPct: hrsToPct
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
    }
})();