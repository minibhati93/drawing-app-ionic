angular.module('starter.services', [])

.factory('DrawService', function() {
  

  return {
    all: function() {
         var signatures = JSON.parse(window.localStorage.getItem("imgs"));
         ///console.log(JSON.stringify(signatures));
         return signatures;
    }
  };
});
