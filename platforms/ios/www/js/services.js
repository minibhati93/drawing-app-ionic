angular.module('starter.services', [])

.factory('DrawService', function() {
  

  return {
    all: function() {
         var signatures = JSON.parse(window.localStorage.getItem("imgs"));
         ///console.log(JSON.stringify(signatures));
         return signatures;
    }
  };
})
.factory('s3Service', function($http){
         
         return{
         
         connection:function(){
         alert("connection function..");
         
         return $http.get("http://aspiringapps.com:8888/uploadImage");
         }
         };
         
});
