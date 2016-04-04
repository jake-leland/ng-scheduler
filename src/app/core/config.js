(function () {
    'use strict';

    var core = angular.module('app.core');

    var schedule = {
        minTime: '7:00 am',
        maxTime: '10:00 pm'
    };

    var config = {
        schedule: schedule
    };

    core.constant('config', config);
})();