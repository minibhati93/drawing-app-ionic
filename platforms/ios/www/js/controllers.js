angular.module('starter.controllers', [])

.controller('PaintCtrl', function($scope, $ionicPopover, DrawService, $ionicModal, $ionicActionSheet, $timeout) {
            
            $scope.paint = { name : "Paint Activity" };
            $scope.tools = { strokeSize : '20' , strokeColor: '#000000'};
            
            var strokeColor = "#000000";
            var strokeSize = 20;
            
            $scope.updateStrokeSize = function(){
            //$scope.strokeSizeFinal = $scope.tools.strokeSize;
                strokeSize = $scope.tools.strokeSize;
            //console.log("$scope.strokeSizeFinal is: "+$scope.strokeSizeFinal)
            }
            
            $scope.selectedColorButton = function(hex){
            //$scope.strokeColorFinal = hex;
                strokeColor = hex;
            //alert($scope.strokeColorFinal);
            }

            
            
            var paintCanvas = document.getElementById('canvas');
            paintCanvas.width = window.innerWidth;
            paintCanvas.height = window.innerHeight;
            
            var useragent = navigator.userAgent.toLowerCase();
            var isAndroid = /android/i.test(useragent);
            var isiOS = (useragent.indexOf('iphone') != -1 || useragent.indexOf('ipad') != -1 || useragent.indexOf('ipod') != -1 );
            
            var mousePosition;
            if (isiOS) {
            var computemouseposition = function(e) {
            mousePosition = {x: e.pageX-paintCanvas.offsetLeft, y: e.pageY-paintCanvas.offsetTop};
            }
            var computetouchposition = function(e) {
            mousePosition = {x: e.touches[0].pageX-paintCanvas.offsetLeft, y: e.touches[0].pageY-paintCanvas.offsetTop};
            }
            var mouseisup = function(e) {
            handleMouseUp(e);
            }
            paintCanvas.onmousedown = computemouseposition;
            paintCanvas.onmousemove = computemouseposition;
            paintCanvas.ontouchstart = computetouchposition;
            paintCanvas.ontouchmove = function(e) {
            computetouchposition(e);
            handleMouseMove(e);
            }
            paintCanvas.ontouchend = mouseisup;
            document.onmouseup = mouseisup;
            document.ontouchcancel = mouseisup;
            }
            
            
            var stage = new createjs.Stage(paintCanvas);
            
            //check to see if we are running in a browser with touch support
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            var touchEnabled = createjs.Touch.enable(stage);
            if (touchEnabled && !isiOS) {
            console.log("Touch enabled");
            stage.addEventListener("stagemousedown", handlePressDown);
            stage.addEventListener("stagemouseup", handlePressUp);
            } else {
            console.log("Touch not enabled");
            stage.addEventListener("stagemousedown", handleMouseDown);
            stage.addEventListener("stagemouseup", handleMouseUp);
            }
            createjs.Ticker.setFPS(24);
            
            // set up our defaults:
            
            
            var shape;
            
            // For touch interaction
            var pointers = [];
            
            // For mouse only interaction
            var oldPoint;
            var oldMidPoint;
            
            shape = new createjs.Shape();
            stage.addChild(shape);
            
            // add handler for stage mouse events:
            function handleMouseDown(event) {
            var stagemouseX = (isiOS ? mousePosition.x : stage.mouseX);
            var stagemouseY = (isiOS ? mousePosition.y : stage.mouseY);
            oldPoint = new createjs.Point(stagemouseX, stagemouseY);
            oldMidPoint = oldPoint.clone();
            stage.addEventListener(isiOS ? "touchmove" : "stagemousemove" , handleMouseMove);
            }
            
            function handleMouseUp(event) {
            stage.removeEventListener(isiOS ? "touchmove" : "stagemousemove" , handleMouseMove);
            }
            
            function handleMouseMove(event) {
            var stagemouseX = (isiOS ? mousePosition.x : stage.mouseX);
            var stagemouseY = (isiOS ? mousePosition.y : stage.mouseY);
            var midPoint = new createjs.Point(oldPoint.x + stagemouseX>>1,
                                              oldPoint.y + stagemouseY>>1);
            
            shape.graphics.clear().setStrokeStyle(strokeSize, 'round', 'round').
            beginStroke(strokeColor).moveTo(midPoint.x, midPoint.y).
            curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
            
            oldPoint.x = stagemouseX;
            oldPoint.y = stagemouseY;
            
            oldMidPoint.x = midPoint.x;
            oldMidPoint.y = midPoint.y;
            
            stageUpdate();
            }
            
            function handlePressDown(event) {
            var pointerData = {};
            pointerData.oldPoint = new createjs.Point(event.stageX,
                                                      event.stageY);
            pointerData.oldMidPoint = pointerData.oldPoint.clone();
            pointers[event.pointerID] = pointerData;
            if (pointers.length == 1) {
            stage.addEventListener("stagemousemove" , handlePressMove);
            }
            }
            
            function handlePressUp(event) {
            pointers.splice(pointers[event.pointerID], 1);
            if (pointers.length === 0) {
            stage.removeEventListener("stagemousemove" , handlePressMove);
            }
            }
            
            function handlePressMove(event) {
            pointerData = pointers[event.pointerID];
            var midPoint = new createjs.Point(
                                              pointerData.oldPoint.x + event.stageX>>1,
                                              pointerData.oldPoint.y + event.stageY>>1);
            
            shape.graphics.clear().setStrokeStyle( strokeSize , 'round', 'round').
            beginStroke(strokeColor).moveTo(midPoint.x, midPoint.y).
            curveTo(pointerData.oldPoint.x, pointerData.oldPoint.y,
                    pointerData.oldMidPoint.x, pointerData.oldMidPoint.y);
            
            pointerData.oldPoint.x = event.stageX;
            pointerData.oldPoint.y = event.stageY;
            
            pointerData.oldMidPoint.x = midPoint.x;
            pointerData.oldMidPoint.y = midPoint.y;
            
            stageUpdate();
            }
            
            function stageUpdate() {
            stage.update();
            if (isAndroid && document.location.protocol.substr(0,4) != "http") {
            // HACK: Force redraw on Android
            paintCanvas.style.display='none';
            paintCanvas.offsetHeight;
            paintCanvas.style.display='block';
            }
            }

            
            /********** For clearing the canvas **********/
            $scope.clear = function(){
                stage.clear();
                stage.removeChild(shape);
                shape = new createjs.Shape();
                stage.addChild(shape);
                stageUpdate();
            }
            
            $scope.eraseCanvas = function(){
            
//                var canvas = document.getElementById('canvas');
//                var context = canvas.getContext('2d');
//                context.beginPath();
//                context.strokeStyle = "rgba(0,0,0,1)";
//                context.globalCompositeOperation="destination-out";
            
            };

            
            
            /************************** Popvers *****************************/
            
            $scope.colors= [{name: 'Blue',hex: '#387ef5'},{name: 'Green' ,hex :'#309090'}, {name: 'Black' ,hex :'#000000'},  {name: 'Red' ,hex :'#ef473a'},  {name: 'Violet' ,hex :'#886aea'}];
            
            
            $ionicPopover.fromTemplateUrl('templates/tools-color.html', {
                                          scope: $scope,
                                          }).then(function(popover) {
                                                  $scope.colorPopover = popover;
                                                  });
            
            $ionicPopover.fromTemplateUrl('templates/tools-stroke.html', {
                                          scope: $scope,
                                          }).then(function(popover) {
                                                  $scope.strokePopover = popover;
                                                  });
            
            
            $ionicPopover.fromTemplateUrl('templates/tools-edit.html', {
                                          scope: $scope,
                                          }).then(function(popover) {
                                                  $scope.popover = popover;
                                                  });
            
            $scope.openEditPopver = function($event) {
            $scope.popover.show($event);
            };
            
            $scope.openColorPopver = function($event) {
            $scope.colorPopover.show($event);
            };
            
            $scope.openStrokePopver = function($event) {
            $scope.strokePopover.show($event);
            };
            
            
            $scope.paintActivity = {'name': $scope.paint.name};
            
            $scope.changeTitle = function(){
            $scope.paint.name = $scope.paintActivity.name;
            };
            
            
            /********** For saving the canvas **********/
            
            $scope.save = function(){
            
            // alert($scope.sign.name);
            if(!window.localStorage.getItem("imgs")){
            var arr = new Array();
            var image = serializeCanvas(paintCanvas);
            arr.push({"file": $scope.paint.name, "src": image});
            window.localStorage.setItem("imgs",JSON.stringify(arr));
            //console.log(JSON.stringify(arr));
            showToast("Image saved!");
            }
            else{
            var arr = JSON.parse(window.localStorage.getItem("imgs"));
            var image = serializeCanvas(paintCanvas);
            for(var i in arr){
            if(arr[i].file == $scope.paint.name){
            arr[i].src = image;
            window.localStorage.setItem("imgs",JSON.stringify(arr));
            //console.log(JSON.stringify(arr));
            showToast("Image saved!");
            return;
            
            }
            }
            arr.push({"file": $scope.paint.name, "src": image});
            window.localStorage.setItem("imgs",JSON.stringify(arr));
            //console.log(JSON.stringify(arr));
            }
            showToast("Image saved!");
            
            
            };
            
            /************************** For the list of images *****************************/
            
            
            $scope.images = DrawService.all();
            //alert(JSON.stringify($scope.images));
            
            $ionicModal.fromTemplateUrl('templates/journal.html', {
                                        scope: $scope
                                        }).then(function(modal) {
                                                $scope.modal = modal;
                                                });
            
            
            $scope.openModal = function(){
            $scope.modal.show();
            };
            
            
            $scope.closeModal = function(){
            $scope.modal.hide();
            
            };
            
            $scope.doRefresh = function(){
            console.log("Refreshing!");
            $scope.images = DrawService.all();
            $scope.$broadcast('scroll.refreshComplete');
            
            };
            
            
            
            $scope.view = function(file){
            var img = new Image();
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // alert(file);
            var images = JSON.parse(window.localStorage.getItem("imgs"));
            for(var i in images){
            if(images[i].file == file){
            // alert("match");
            img.onload = function() {
            ctx.drawImage(img,0,0);
            $scope.paint.name = images[i].file;
            $scope.closeModal();
            };
            img.src = images[i].src;
            return;
            }
            }
            
            };
            
            
            $scope.download = function(name){
            
            var imgs = JSON.parse(window.localStorage.getItem("imgs"));
            for(i in imgs){
            if(imgs[i].file == name){
            
            var image =  imgs[i].src;
            image = deserializeCanvas(image,paintCanvas);
            $timeout(function(){
                     saveImage();
                     showToast("Image saved!");
                     $scope.closeModal();
                     
                     
                     },100);
            
            
            }
            }
            };
            
            $scope.share = function(name){
            
            var imgs = JSON.parse(window.localStorage.getItem("imgs"));
            for(i in imgs){
            if(imgs[i].file == name){
            
            var image =  imgs[i].src;
            $timeout(function(){
                     shareImage(image);
                     $scope.closeModal();
                     
                     
                     },100);
            }
            }
            };

            
            $scope.delete = function(file){
            //alert(file);
            var images = JSON.parse(window.localStorage.getItem("imgs"));
            for(var i in images){
            if(images[i].file == file){
            images.splice(i,1);
            window.localStorage.setItem("imgs", JSON.stringify(images));
            $scope.images = DrawService.all();
            }
            }
            
            $scope.clear();
            $scope.paint.name = "Paint Activity";
            $scope.closeModal();
            
            };


            
            
            $scope.showActionsheet = function(name){
            $ionicActionSheet.show({
                                   titleText: 'More Options',
                                   buttons: [
                                             { text: '<i class="icon ion-edit"></i>View' },
                                             { text: '<i class="icon ion-share"></i>Share' },
                                             { text: '<i class="icon ion-ios-download-outline"></i>Download' },
                                             { text: '<i class="icon ion-ios-cloud-upload-outline"></i>Save' },
                                             ],
                                   destructiveText: '<i class="icon ion-ios-trash"></i>Delete',
                                   cancelText: 'Cancel',
                                   cancel: function() {
                                   console.log('CANCELLED');
                                   },
                                   buttonClicked: function(index) {
                                   console.log('BUTTON CLICKED',index);
                                   if(index == 0){
                                   $scope.view(name);
                                   
                                   }
                                   else if(index == 1){
                                   $scope.share(name);
                                   }
                                   else if(index == 2){
                                   $scope.download(name);
                                   }
                                   else if(index == 3){
                                   $scope.saveToS3(name);
                                   }
                                   return true;
                                   },
                                   destructiveButtonClicked: function() {
                                   console.log('DESTRUCT');
                                   $scope.delete(name);
                                   return true;
                                   }
                                   });
            };




            

            
});
