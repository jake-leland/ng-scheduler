(function () {
    'use strict';

    var core = angular.module('app.core');

    var schedule = {
        minTime: '6:30 am',
        maxTime: '9:40 pm'
    };

    var config = {
        schedule: schedule
    };

    core.constant('config', config);
})();