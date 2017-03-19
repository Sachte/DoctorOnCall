/// <reference path="../templates/tab-dash-join-modal.html" />
/// <reference path="../templates/tab-dash-join-modal.html" />
/// <reference path="../templates/error-connection.html" />
/// <reference path="../templates/error-connection.html" />

angular.module('starter.controllers', [])
.controller('ErrorConnectionCtrl', ['$scope','$rootScope', '$http', '$state', '$cordovaDevice', '$q', '$ionicLoading', '$ionicHistory', '$ionicPopup', 'applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', function ($scope,$rootScope, $http, $state, cordovaDevice, $q, $ionicLoading, $ionicHistory, $ionicPopup, applicationConfig, MobileValidation, Account, SignalRSvc) {
        $rootScope.$on("deviceOnline", function (e, message) {
            $scope.$apply(function () {
                $state.go('tab.account');
            });
        });


    }])
.controller('MainCtrl', ['$state','$rootScope', '$scope', function ($state,$rootScope,$scope ) {
    //console.log('HomeTabCtrl');
    this.onTabSelected = function (_scope) {
        console.log("onTabSelected - main");
        // if we are selectng the home title then 
        // change the state back to the top state
        if (_scope.title === 'Use Carpools') {
            setTimeout(function () {
                $state.go('tab.dash', {});
            }, 20);
        }
    }
    this.isProvider = function (_scope){
        return localStorage.getItem('isProvider')=='true';
    }
        this.isNotProvider = function (_scope){
        return localStorage.getItem('isProvider')!='true';
    }
    this.True = function (_scope){
        return true;
    }

    
    this.onTabDeselected = function () {
        console.log("onTabDeselected -  main");

    }

    this.onSearchTabSelected = function () {
        console.log("onSearchTabSelected -  main");
        $rootScope.$broadcast('SerachTabSelected');

    }


    this.onAccountTabSelected = function (_scope) {
        console.log("onTabSelected - main");
        // if we are selectng the home title then 
        // change the state back to the top state
        if (_scope.title === 'My Account') {
            setTimeout(function () {
                $state.go('tab.account', {});
            }, 20);
        }
        $rootScope.$broadcast('AccountTabSelected');
    }
    this.onAccountTabDeselected = function () {
        console.log("onTabDeselected -  main");

    }
    
    this.onVideoConsulationTabSelected = function (_scope) {
        console.log("onVideoConsulationTabSelected -  main");
        if (_scope.title === 'Video Consultation') {
            setTimeout(function () {
                $state.go('tab.provider.videoSessions', {});
            }, 20);
        }
        $rootScope.$broadcast('ProviderTabSelected');

    }
    this.onVideoConsulationTabDeselected = function () {
        console.log("onTabDeselected -  main");
        $rootScope.$broadcast('ProviderTabDeselected');

    }



    this.onAppointmentsTabSelected = function (_scope) {
        console.log("onAppointmentsTabSelected -  main");
        if (_scope.title === 'Appointments') {
            setTimeout(function () {
                $state.go('tab.provider.providerAppointments', {});
            }, 20);
        }
        $rootScope.$broadcast('ProviderTabSelected');

    }
    this.onAppointmentsTabDeselected = function () {
        console.log("onTabDeselected -  main");
        $rootScope.$broadcast('ProviderTabDeselected');

    }

    $scope.$on('cloud:push:notification', function(event, data) {
        var msg = data.message;
        alert(msg.title + ': ' + msg.text);
    });



}])
.controller('NavCtrl', function ($scope, $ionicSideMenuDelegate) {

    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
})
.controller('DashCtrl', function ($scope, Account, $state, $ionicModal, $stateParams, $ionicHistory, $ionicLoading, $ionicPopup, $ionicActionSheet, $timeout, Carpool, Ride, Expense, ConnectivityMonitor) {
    
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');

    }
    else {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();


        $scope.data = [];
        $scope.data.ridedate = new Date(yyyy, mm, dd);

        $scope.datepickerObject = {
            titleLabel: 'Ride Date',  //Optional            
            inputDate: $scope.data.ridedate,  //Optional           
            callback: function (val) {  //Mandatory
                //datePickerCallback(val);
                if (val != undefined && val != null) {
                    $scope.data.ridedate = val;
                    $scope.datepickerObject.inputDate = val;
                    $scope.refreshdata();
                }
               
            }
          
        };
        //$scope.data.selectedCarpool = [];
        $scope.data.selectedRide = [];
        $scope.data.workBoundJoinFlag = true;
        $scope.data.homeBoundJoinFlag = true;

        $scope.showMenu = function () {
            $ionicActionSheet.show({
                titleText: 'Carpool Actions',
                buttons: [
                {
                    text: '<i class="icon ion-share"></i> New Carpool'
                },
                {
                    text: '<i class="icon ion-arrow-move"></i> Manage Carpools'
                },
                ],

                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },

                buttonClicked: function (index) {
                    switch (index) {
                        case 0: {
                            $state.go('tab.dash.newcarpool');
                            break;

                        }
                        case 1: {
                            $state.go('tab.dash.carpools');
                            break;
                        }
                    }
                    console.log('BUTTON CLICKED', index);
                    return true;

                },

            });

        }

        $scope.$on('$ionicView.beforeEnter', function () {
            //  $ionicHistory.clearCache();
            //  $ionicHistory.clearHistory();
            // $ionicNavBarDelegate.showBackButton(false);
            console.log($ionicHistory.viewHistory());
        });


        $scope.slots = {
            inputEpochTime: 27000,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slots.inputEpochTime = val == undefined ? $scope.slots.inputEpochTime : val;

            }
        };


        $scope.slotsHomebound = {
            inputEpochTime: 63000,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                $scope.slotsHomebound.inputEpochTime = val == undefined ? $scope.slotsHomebound.inputEpochTime : val;
            }
        };

        $scope.setETAJoinStatus = function (ride) {
            localStorage.setItem('dashboard_lastsSelected_rideId', ride.Id);
            var temp = new Date($scope.data.ridedate).toDateString();
            $scope.data.selectedRide = ride;
            Ride.GetByIdTypeAndDate({ id: ride.Id, type: ride.Type, rideDate: new Date(temp).toDateString() }).$promise
                    .then(
                         function (data) {
                             for (i = 0; i < data.length; i++) {
                                 data[i].LoggedInCustomerID = localStorage.getItem("customerid");
                                 if (data[i].JourneyDirection == 'Workbound') {
                                     $scope.workBoundRide = data[i];

                                     if ($scope.workBoundRide.RidePassengers != null) {



                                         $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                             return obj.CustomerID == localStorage.getItem("customerid");
                                         })[0];

                                         $scope.slots.callback($scope.data.workBoundDriver.ETA);
                                         $scope.data.workBoundJoinFlag = $scope.data.workBoundDriver.isJoining == "False" ? false : true;

                                         $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);
                                         //$scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
                                         //$scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;


                                     }
                                 }
                                 else if (data[i].JourneyDirection == 'Homebound') {
                                     $scope.homeBoundRide = data[i];
                                     // $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                     if ($scope.homeBoundRide.RidePassengers != null) {


                                         $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                             return obj.CustomerID == localStorage.getItem("customerid");
                                         })[0];

                                         $scope.slotsHomebound.callback($scope.data.homeBoundDriver.ETA);
                                         $scope.data.homeBoundJoinFlag = $scope.data.homeBoundDriver.isJoining == "False" ? false : true;

                                         $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                         //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
                                         //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;



                                     }

                                 }

                             }

                         },
                         function (error) {

                         }
                      );
        }

        $scope.RideCarpoolSelected = function (callback) {
            $scope.setETAJoinStatus($scope.data.selectedRide);
        }
        $scope.refreshdata = function () {
            $ionicLoading.show({
                template: 'loading'
            });
            var temp = new Date($scope.data.ridedate).toDateString();

            if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '') {
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                    $ionicLoading.hide();
                    if (info.email == null ) {
                        $state.go('tab.account.emaillogin', {}, { reload: true });

                    }
                    else if (info.PlatformAccountBillingID == null) {
                                               if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); return true;
                        }
                        else{$state.go('tab.CustInfo');}

                    }
                    $scope.customer = info;
                    $scope.data.email = $scope.customer.email;
                    if ($scope.customer.email == null ) $state.go('tab.account.emailLogin', {}, { reload: true });
                    else if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") 
                    {
                     if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); return true;
                        }
                        else{$state.go('tab.CustInfo');}
                    }
                    else {
                        Ride.GetByCustomerIDAndDate({ customerID: localStorage.getItem("customerid"), rideDate: new Date(temp).toDateString() }).$promise.then(function (data) {
                            $scope.memberRides = data;
                            //Try and set the last selected Carpool.
                            var flagSetLastSelectedRide = false;
                            var lastSelectedRide = {};
                            if (localStorage.getItem("dashboard_lastsSelected_rideId") != undefined && localStorage.getItem("dashboard_lastsSelected_rideId") != null) {
                                lastSelectedRide = data.filter(function (obj) {
                                    return obj.Id == localStorage.getItem("dashboard_lastsSelected_rideId");
                                })[0];
                                if (lastSelectedRide != null && lastSelectedRide != undefined) {
                                    $scope.data.selectedRide = lastSelectedRide;
                                    flagSetLastSelectedRide = true;

                                }
                            }

                            if (!flagSetLastSelectedRide) $scope.data.selectedRide = data[0];
                            $scope.setETAJoinStatus($scope.data.selectedRide);
                        }, function (error) {


                        });
                    }

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );

            }
            else {
                $ionicLoading.hide();
                $state.go('tab.account.mobilelogin');



            }
        }

        $scope.refreshdata();


        $scope.gotoMessaging = function () {
            //  alert($scope.selectedCarpool.CarpoolID);
            $state.go('tab.messaging', { "carpoolid": $scope.data.selectedCarpool.CarpoolID });
        }

        $scope.gotoJoinETA = function (joinFlag) {

            $ionicLoading.show({
                template: 'Saving your Preference...'
            });
            //Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.data.selectedCarpool.CarpoolID, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
            //    if (data.length == 0) $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });
            //    else if (data.length == 1 && data[0].ReturnJourney == 'True') $state.go('tab.edit-ride', { "rideid": data[0].Id });
            //    else $state.go('tab.rides', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });

            //});


            //Ride.GetByIdTypeAndDate({ "id": $scope.data.selectedRide.Id, "type": $scope.data.selectedRide.Type, rideDate: $scope.data.ridedate.toDateString() }).$promise
            //     .then(
            //          function (data) {
            //              for (i = 0; i < data.length; i++) {
            //                  data[i].LoggedInCustomerID = localStorage.getItem("customerid");
            //                  if (data[i].JourneyDirection == 'Workbound') {
            //                      $scope.workBoundRide = data[i];

            //                      if ($scope.workBoundRide.RidePassengers != null) {

            //                          $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
            //                              return obj.isDriverForTheRide == true;
            //                          })[0];

            //                          if ($scope.data.workBoundDriver == undefined) {
            //                              $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
            //                                  return obj.CustomerID == localStorage.getItem("customerid");
            //                              })[0];
            //                          }
            //                          $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);


            //                          $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
            //                          $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;


            //                      }
            //                  }
            //                  else if (data[i].JourneyDirection == 'Homebound') {
            //                      $scope.homeBoundRide = data[i];
            //                      $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
            //                      if ($scope.homeBoundRide.RidePassengers != null) {
            //                          $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
            //                              return obj.isDriverForTheRide == true;
            //                          })[0];

            //                          if ($scope.data.homeBoundDriver == undefined) {
            //                              $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
            //                                  return obj.CustomerID == localStorage.getItem("customerid");
            //                              })[0];

            //                          }
            //                          $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);

            //                          $scope.homeBoundRide.RidePassengers[ $scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
            //                          $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;

            //                      }

            //                  }

            //              }
            //              if($scope.data.selectedRide.Type=='Carpool' || $scope.data.selectedRide.Type=='Customer' )
            //              {
            //                  saveRide();
            //              }
            //              else
            //              {
            //                  updateRide();
            //              }

            //          },
            //          function (error) {

            //          }
            //       );

            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;


            if ($scope.data.selectedRide.Type == 'Carpool' || $scope.data.selectedRide.Type == 'Customer') {
                saveRide();
            }
            else {
                updateRide();
            }


        }
        function saveRide() {
            $scope.workBoundRide.$save().then(function (info) {

                $scope.homeBoundRide.$save().then(function (info) {
                    $ionicLoading.hide();

                    PopUpMessage = 'Thank you for the Heads Up!';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        // console.log("After Ride Save");
                        // $scope.ride.CarpoolMembers = [];
                        // $scope.data.contacts = [];
                        //// $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.ride.CarpoolID, "usagedate": $scope.ride.RideDate });
                        ;

                    });
                }, function (error) {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'Error Saving your homebound Preference. Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        //console.log("After Ride Save");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        //$state.go($ionicHistory.backView().stateName);

                    });

                });


            }, function (error) {
                $ionicLoading.hide();
                var PopUpMessage = '';

                PopUpMessage = 'Error Saving your Preference. Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Ride!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    //console.log("After Ride Save");
                    //$scope.ride.CarpoolMembers = [];
                    //$scope.data.contacts = [];
                    //$state.go($ionicHistory.backView().stateName);

                });

            });
        }
        function updateRide() {
            $scope.workBoundRide.$update().then(function (info) {
                $scope.homeBoundRide.$update().then(function (info) {
                    $ionicLoading.hide();

                    PopUpMessage = 'Thank you for the Heads Up!';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        // console.log("After Ride Save");
                        // $scope.ride.CarpoolMembers = [];
                        // $scope.data.contacts = [];
                        //// $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.ride.CarpoolID, "usagedate": $scope.ride.RideDate });
                        ;

                    });


                }, function (error) {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'Error Saving your Homebound Preference. Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        //console.log("After Ride Save");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        //$state.go($ionicHistory.backView().stateName);

                    });

                });
            }, function (error) {
                $ionicLoading.hide();
                var PopUpMessage = '';

                PopUpMessage = 'Error Saving your Preference. Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Ride!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    //console.log("After Ride Save");
                    //$scope.ride.CarpoolMembers = [];
                    //$scope.data.contacts = [];
                    //$state.go($ionicHistory.backView().stateName);

                });

            });
        }
        $scope.gotodriverrideusage = function () {


            $state.go('tab.dash.attendance', { "id": $scope.data.selectedRide.Id, "type": $scope.data.selectedRide.Type, "usagedate": $scope.data.ridedate.toDateString(), "mode": "Attendance" });



        }
        $scope.gotoexpense = function () {

            Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.selectedCarpool.CarpoolID, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
                if (data.length == 0) $state.go('tab.new-expense', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });
                    // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
                else $state.go('tab.expenses', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });

            });

        }
        $scope.gotocarpoolmap = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('tab.carpoolmap', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID });

        }

    }

})
.controller('DashNewCtrl', function ($scope, Account, $state, $ionicModal, $stateParams, $ionicHistory, $ionicLoading, $ionicPopup, $ionicActionSheet, $timeout, Carpool, Ride, Expense, ConnectivityMonitor) {

    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');

    }
    else {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();


        $scope.data = [];
        $scope.data.ridedate = new Date(yyyy, mm, dd);

        $scope.datepickerObject = {
            titleLabel: 'Ride Date',  //Optional            
            inputDate: $scope.data.ridedate,  //Optional           
            callback: function (val) {  //Mandatory
                //datePickerCallback(val);
                if (val != undefined && val != null) {
                    $scope.data.ridedate = val;
                    $scope.datepickerObject.inputDate = val;
                    $scope.refreshdata();
                }

            }

        };
        //$scope.data.selectedCarpool = [];
        $scope.data.selectedRide = [];
        $scope.data.workBoundJoinFlag = true;
        $scope.data.homeBoundJoinFlag = true;

        $scope.showMenu = function () {
            $ionicActionSheet.show({
                titleText: 'Carpool Actions',
                buttons: [
                {
                    text: '<i class="icon ion-share"></i> New Carpool'
                },
                {
                    text: '<i class="icon ion-arrow-move"></i> Manage Carpools'
                },
                ],

                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },

                buttonClicked: function (index) {
                    switch (index) {
                        case 0: {
                            $state.go('tab.dash.newcarpool');
                            break;

                        }
                        case 1: {
                            $state.go('tab.dash.carpools');
                            break;
                        }
                    }
                    console.log('BUTTON CLICKED', index);
                    return true;

                },

            });

        }

        $scope.$on('$ionicView.beforeEnter', function () {
            //  $ionicHistory.clearCache();
            //  $ionicHistory.clearHistory();
            // $ionicNavBarDelegate.showBackButton(false);
            console.log($ionicHistory.viewHistory());
        });


        $scope.slots = {
            inputEpochTime: 27000,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slots.inputEpochTime = val == undefined ? $scope.slots.inputEpochTime : val;

            }
        };


        $scope.slotsHomebound = {
            inputEpochTime: 63000,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                $scope.slotsHomebound.inputEpochTime = val == undefined ? $scope.slotsHomebound.inputEpochTime : val;
            }
        };

        $scope.setETAJoinStatus = function (ride) {
            localStorage.setItem('dashboard_lastsSelected_rideId', ride.Id);
            var temp = new Date($scope.data.ridedate).toDateString();
            $scope.data.selectedRide = ride;
            Ride.GetByIdTypeAndDate({ id: ride.Id, type: ride.Type, rideDate: new Date(temp).toDateString() }).$promise
                    .then(
                         function (data) {
                             for (i = 0; i < data.length; i++) {
                                 data[i].LoggedInCustomerID = localStorage.getItem("customerid");
                                 if (data[i].JourneyDirection == 'Workbound') {
                                     $scope.workBoundRide = data[i];

                                     if ($scope.workBoundRide.RidePassengers != null) {



                                         $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                             return obj.CustomerID == localStorage.getItem("customerid");
                                         })[0];

                                         $scope.slots.callback($scope.data.workBoundDriver.ETA);
                                         $scope.data.workBoundJoinFlag = $scope.data.workBoundDriver.isJoining == "False" ? false : true;

                                         $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);
                                         //$scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
                                         //$scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;


                                     }
                                 }
                                 else if (data[i].JourneyDirection == 'Homebound') {
                                     $scope.homeBoundRide = data[i];
                                     // $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                     if ($scope.homeBoundRide.RidePassengers != null) {


                                         $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                             return obj.CustomerID == localStorage.getItem("customerid");
                                         })[0];

                                         $scope.slotsHomebound.callback($scope.data.homeBoundDriver.ETA);
                                         $scope.data.homeBoundJoinFlag = $scope.data.homeBoundDriver.isJoining == "False" ? false : true;

                                         $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                         //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
                                         //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;



                                     }

                                 }

                             }

                         },
                         function (error) {

                         }
                      );
        }

        $scope.RideCarpoolSelected = function (callback) {
            $scope.setETAJoinStatus($scope.data.selectedRide);
        }
        $scope.refreshdata = function () {
            $ionicLoading.show({
                template: 'loading'
            });
            var temp = new Date($scope.data.ridedate).toDateString();

            if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '') {
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                    $ionicLoading.hide();
                    if (info.email == null ) {
                        $state.go('tab.account.emaillogin', {}, { reload: true });

                    }
                    else if (info.PlatformAccountBillingID == null) {
                        if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); 
                        }
                        else{$state.go('tab.CustInfo');}

                    }
                    $scope.customer = info;
                    $scope.data.email = $scope.customer.email;
                    if ($scope.customer.email == null) $state.go('tab.account.emailLogin', {}, { reload: true });
                    else if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") 
                    {
                                                if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); 
                        }
                        else{$state.go('tab.CustInfo');}
                    }
                    else {
                        Ride.GetByCustomerIDAndDate({ customerID: localStorage.getItem("customerid"), rideDate: new Date(temp).toDateString() }).$promise.then(function (data) {
                            $scope.memberRides = data;
                            //Try and set the last selected Carpool.
                            var flagSetLastSelectedRide = false;
                            var lastSelectedRide = {};
                            if (localStorage.getItem("dashboard_lastsSelected_rideId") != undefined && localStorage.getItem("dashboard_lastsSelected_rideId") != null) {
                                lastSelectedRide = data.filter(function (obj) {
                                    return obj.Id == localStorage.getItem("dashboard_lastsSelected_rideId");
                                })[0];
                                if (lastSelectedRide != null && lastSelectedRide != undefined) {
                                    $scope.data.selectedRide = lastSelectedRide;
                                    flagSetLastSelectedRide = true;

                                }
                            }

                            if (!flagSetLastSelectedRide) $scope.data.selectedRide = data[0];
                            $scope.setETAJoinStatus($scope.data.selectedRide);
                        }, function (error) {


                        });
                    }

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );

            }
            else {
                $ionicLoading.hide();
                $state.go('tab.account.mobilelogin');



            }
        }

        $scope.refreshdata();


        $scope.gotoMessaging = function () {
            //  alert($scope.selectedCarpool.CarpoolID);
            $state.go('tab.messaging', { "carpoolid": $scope.data.selectedCarpool.CarpoolID });
        }

        $scope.gotoJoinETA = function (joinFlag) {

            $ionicLoading.show({
                template: 'Saving your Preference...'
            });
            //Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.data.selectedCarpool.CarpoolID, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
            //    if (data.length == 0) $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });
            //    else if (data.length == 1 && data[0].ReturnJourney == 'True') $state.go('tab.edit-ride', { "rideid": data[0].Id });
            //    else $state.go('tab.rides', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });

            //});


            //Ride.GetByIdTypeAndDate({ "id": $scope.data.selectedRide.Id, "type": $scope.data.selectedRide.Type, rideDate: $scope.data.ridedate.toDateString() }).$promise
            //     .then(
            //          function (data) {
            //              for (i = 0; i < data.length; i++) {
            //                  data[i].LoggedInCustomerID = localStorage.getItem("customerid");
            //                  if (data[i].JourneyDirection == 'Workbound') {
            //                      $scope.workBoundRide = data[i];

            //                      if ($scope.workBoundRide.RidePassengers != null) {

            //                          $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
            //                              return obj.isDriverForTheRide == true;
            //                          })[0];

            //                          if ($scope.data.workBoundDriver == undefined) {
            //                              $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
            //                                  return obj.CustomerID == localStorage.getItem("customerid");
            //                              })[0];
            //                          }
            //                          $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);


            //                          $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
            //                          $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;


            //                      }
            //                  }
            //                  else if (data[i].JourneyDirection == 'Homebound') {
            //                      $scope.homeBoundRide = data[i];
            //                      $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
            //                      if ($scope.homeBoundRide.RidePassengers != null) {
            //                          $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
            //                              return obj.isDriverForTheRide == true;
            //                          })[0];

            //                          if ($scope.data.homeBoundDriver == undefined) {
            //                              $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
            //                                  return obj.CustomerID == localStorage.getItem("customerid");
            //                              })[0];

            //                          }
            //                          $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);

            //                          $scope.homeBoundRide.RidePassengers[ $scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
            //                          $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;

            //                      }

            //                  }

            //              }
            //              if($scope.data.selectedRide.Type=='Carpool' || $scope.data.selectedRide.Type=='Customer' )
            //              {
            //                  saveRide();
            //              }
            //              else
            //              {
            //                  updateRide();
            //              }

            //          },
            //          function (error) {

            //          }
            //       );

            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isJoining = $scope.data.workBoundJoinFlag;
            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].ETA = $scope.slots.inputEpochTime;
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isJoining = $scope.data.homeBoundJoinFlag;
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].ETA = $scope.slotsHomebound.inputEpochTime;


            if ($scope.data.selectedRide.Type == 'Carpool' || $scope.data.selectedRide.Type == 'Customer') {
                saveRide();
            }
            else {
                updateRide();
            }


        }
        function saveRide() {
            $scope.workBoundRide.$save().then(function (info) {

                $scope.homeBoundRide.$save().then(function (info) {
                    $ionicLoading.hide();

                    
                }, function (error) {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'Error Saving your homebound Preference. Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        //console.log("After Ride Save");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        //$state.go($ionicHistory.backView().stateName);

                    });

                });


            }, function (error) {
                $ionicLoading.hide();
                var PopUpMessage = '';

                PopUpMessage = 'Error Saving your Preference. Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Ride!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    //console.log("After Ride Save");
                    //$scope.ride.CarpoolMembers = [];
                    //$scope.data.contacts = [];
                    //$state.go($ionicHistory.backView().stateName);

                });

            });
        }
        function updateRide() {
            $scope.workBoundRide.$update().then(function (info) {
                $scope.homeBoundRide.$update().then(function (info) {
                    $ionicLoading.hide();

                    


                }, function (error) {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'Error Saving your Homebound Preference. Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        //console.log("After Ride Save");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        //$state.go($ionicHistory.backView().stateName);

                    });

                });
            }, function (error) {
                $ionicLoading.hide();
                var PopUpMessage = '';

                PopUpMessage = 'Error Saving your Preference. Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Ride!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    //console.log("After Ride Save");
                    //$scope.ride.CarpoolMembers = [];
                    //$scope.data.contacts = [];
                    //$state.go($ionicHistory.backView().stateName);

                });

            });
        }
        $scope.gotodriverrideusage = function () {


            $state.go('tab.dash.attendance', { "id": $scope.data.selectedRide.Id, "type": $scope.data.selectedRide.Type, "usagedate": $scope.data.ridedate.toDateString(), "mode": "Attendance" });



        }
        $scope.gotoexpense = function () {
            if ($scope.data.selectedRide.Type == 'Carpool') {
                Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.selectedRide.Id, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
                    if (data.length == 0) $state.go('tab.dash.new-expense', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedRide.Id, "usagedate": $scope.data.ridedate });
                        // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
                    else $state.go('tab.dash.expenses', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedRide.Id, "usagedate": $scope.data.ridedate });

                });
            }

        }
        $scope.gotocarpoolmap = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('tab.carpoolmap', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID });

        }
        $ionicModal.fromTemplateUrl('./templates/tab-dash-join-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        }, function (error) {
            console.log(error);
        })
       
        $scope.openJoinStatusModal = function () {
            $scope.modal.show()
        }

        $scope.closeJoinStatusModal = function () {
            $scope.gotoJoinETA(true);

            $scope.modal.hide();
        };

    }

})
.controller('AttendanceCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride, CustomerPaymentMethod, CustomerPayment, ConnectivityMonitor,applicationConfig) {

    
   
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.data = {
            rideDate: new Date($stateParams.usagedate).toDateString(),
            id: $stateParams.id,
            usagedate: $stateParams.usagedate,
            type: $stateParams.type,
            displayname: $stateParams.displayname,
            mode: $stateParams.mode,
            isLoggedInUserStandby: true,
            workBoundDrivers:{},
            rides: []

        };
        if (($stateParams.id != "" && $stateParams.id != undefined) && $stateParams.usagedate != "") {

           
            var temp = new Date($scope.data.usagedate).toDateString();
           
            Ride.GetByIdTypeAndDate({ id: $scope.data.id, type: $scope.data.type, rideDate: $scope.data.usagedate }).$promise
               .then(
                    function (data) {
                        for (i = 0; i < data.length; i++) {
                            data[i].LoggedInCustomerID = localStorage.getItem("customerid");
                            if (data[i].JourneyDirection == 'Workbound') {
                                $scope.workBoundRide = data[i];
                                $scope.calculateFees();
                                if ($scope.workBoundRide.RidePassengers != null) {

                                    $scope.data.loggedInRider = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                        return obj.CustomerID == localStorage.getItem("customerid");
                                    })[0];

                                    $scope.data.isLoggedInUserStandby = $scope.data.loggedInRider == undefined ? true : $scope.data.loggedInRider.isStandBy;

                                    $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                        return obj.isDriverForTheRide == true;
                                    })[0];

                                    if ($scope.data.workBoundDriver == undefined && $scope.data.isLoggedInUserStandby == false) {
                                        $scope.data.workBoundDriver = $scope.data.loggedInRider;
                                    }
                                    if ($scope.data.workBoundDriver == undefined) {
                                        $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers[0];
                                    }
                                   // $scope.data.workBoundDrivers = $scope.data.workBoundDriver; //Workaround for Autocomplete Control
                                    $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);
                                    $scope.updateWorkBoundDriver();

                                }
                            }
                            else if (data[i].JourneyDirection == 'Homebound') {
                                $scope.homeBoundRide = data[i];
                                $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                if ($scope.homeBoundRide.RidePassengers != null) {
                                    $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                        return obj.isDriverForTheRide == true;
                                    })[0];

                                    if ($scope.data.homeBoundDriver == undefined && $scope.data.isLoggedInUserStandby == false) {
                                        $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                            return obj.CustomerID == localStorage.getItem("customerid");
                                        })[0];

                                    }
                                    if ($scope.data.homeBoundDriver == undefined) {
                                        $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers[0];
                                    }

                                    $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                    // $scope.updateHomeBoundDriver();
                                    //Dont Uncomment Above - This is not required - updateHomeboundDriver is called from updateWorkboundDriver
                                }

                            }

                        }

                    }, function (error) {
                        $ionicLoading.hide();
                        if (error.data == null) {
                            $ionicPopup.alert({
                                title: applicationConfig.errorPopupTitle,
                                templateUrl: 'templates/error-appserverunavailable.html'
                            })
                          .then(function (res) {
                              $state.go('security');
                              return true;

                          });

                        }
                        else {
                            $ionicPopup.alert({
                                title: applicationConfig.errorPopupTitle,
                                templateUrl: 'templates/error-application.html'
                            })
                          .then(function (res) {
                              return true;
                          });

                        }
                        console.log(error);

                    }
                 );



        }

        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.workBoundRide.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.workBoundRide.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.workBoundRide.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.workBoundRide.PlatformFeePerRide) + parseFloat($scope.workBoundRide.CostPerRide);
            $scope.workBoundRide.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }
        $scope.AcceptWorkbound = function (item) {
            var costPerRide = 0;

            if ($scope.workBoundRide.CostPerRide != '' && $scope.workBoundRide.CostPerRide != undefined) {
                try {
                    costPerRide = parseFloat($scope.workBoundRide.CostPerRide).toFixed(2);
                    //  platformFee = parseFloat($scope.workBoundRide.PlatformFeePerRide).toFixed(2);
                    //costPerRide = costPerRide + parseFloat($scope.homeBoundRide.CostPerRide).toFixed(2);
                } catch (ex) {
                    console.log(ex);

                }
            }
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == item.CustomerID;
                })[0];
            }
            if (costPerRide > 0) {
                var myPopup = $ionicPopup.confirm({
    
                    title: 'Confirm Credit Card Charge',
                    subTitle: 'For the Ride',
                    template: 'Please Confirm that you want to accept the request for ride and charge the riders credit card', // String (optional). The html template to place in the popup body.
                    scope: $scope,
                    cancelText: 'No - Do not charge the Customer', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                    okText: 'Confirmed - Charge the customer', // String (default: 'OK'). The text of the OK button.
                    okType: '' // String (default: 'button-positive'). The type of the OK button.

                });
                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                    if (res == true) {
                        $ionicLoading.show({
                            template: 'Processing Payment...'
                        });

                        var customerPayment = new CustomerPayment({
                            FromCustomerID: item.CustomerID,
                            ToCustomerID: $scope.workBoundRide.CustomerID,
                            RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                            PaymentDate: $scope.data.usagedate,
                            CostPerRide: $scope.workBoundRide.CostPerRide,
                            PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                            TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                            PaymentStatus: 'Pending'
                        });

                        
                        customerPayment.$save().then(function (data) {
                            $ionicLoading.hide();
                            item.Status = "Accepted";
                            item.isPassenger = false;


                            $scope.data.homeBoundRider.Status = "Accepted";
                            $scope.data.homeBoundRider.isPassenger = false;

                            // $scope.save();

                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Credit Card Declined!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Credit Card Save");
                                //  $scope.ride.CarpoolMembers = [];

                            });
                        });


                    }

                });
            }
            else {
                $ionicLoading.hide();
                item.Status = "Accepted";
                item.isPassenger = false;

                $scope.data.homeBoundRider.Status = "Accepted";
                $scope.data.homeBoundRider.isPassenger = false;

                $scope.save();

            }


        };
        $scope.RejectWorkbound = function (item) {
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == item.CustomerID;
                })[0];
            }
            var myPopup = $ionicPopup.confirm({

                title: 'Confirm Reject',
                subTitle: 'For the Ride',
                template: 'Please Confirm that you want to reject the request for ride. The Requster will be removed from the wait list and will be notified ', // String (optional). The html template to place in the popup body.
                scope: $scope,
                cancelText: 'No - Do not REject the request for the ride', // String (default: 'Cancel'). The text of the Cancel button.
                cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                okText: 'Confirmed - Reject the request for the Ride', // String (default: 'OK'). The text of the OK button.
                okType: '' // String (default: 'button-positive'). The type of the OK button.

            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
                if (res == true) {
                    item.Status = "Declined";
                    item.isPassenger = false;

                    $scope.data.homeBoundRider.Status = "Declined";
                    $scope.data.homeBoundRider.isPassenger = false;

                    $scope.save();
                }

            });

        };
        var chargePassenger = function (passenger) {


            var customerPayment = new CustomerPayment({
                Id: passenger.CustomerID,
                FromCustomerID: passenger.CustomerID,
                ToCustomerID: $scope.workBoundRide.CustomerID,
                RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                CostPerRide: $scope.workBoundRide.CostPerRide,
                PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                PaymentDate: $scope.data.usagedate,
                PaymentStatus: 'Pending'
            });


            customerPayment.$update().then(function (data) {
                $ionicLoading.hide();
                passenger.isPassenger = true;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;
                passenger.isUsageCommitted = true;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isUsageCommitted = true;


                // $scope.save();

            }, function (error) {
                $ionicLoading.hide();
                passenger.isPassenger = false;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;
                PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Credit Card Declined!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    console.log("After Credit Card Save");
                    //  $scope.ride.CarpoolMembers = [];

                });
            });
        }
        $scope.passengerSelected = function (passenger) {
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == passenger.CustomerID;
                })[0];
            }
            if ($scope.workBoundRide.RidePassengers != null) {
                $scope.data.workBoundRider = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == passenger.CustomerID;
                })[0];
            }
            if (passenger.isStandBy && passenger.isPassenger) {


                if ($scope.workBoundRide.TotalCostPerRide > 0) {
                    var myPopup = $ionicPopup.confirm({
                        title: 'Confirm Credit Card Charge',
                        subTitle: 'For the Ride',
                        template: 'Please Confirm that you want to charge <b>' + passenger.DisplayName + '</b>, an amount of <b>$' + $scope.workBoundRide.TotalCostPerRide + '</b> for the ride from <b>' + $scope.workBoundRide.StartAddress.formatted_address + '</b> to <b>' + $scope.workBoundRide.EndAddress.formatted_address + '</b> and back. You will not be able to undo this operation', // String (optional). The html template to place in the popup body.
                        scope: $scope,
                        cancelText: 'No - Do not charge' + passenger.DisplayName, // String (default: 'Cancel'). The text of the Cancel button.
                        cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                        okText: 'Confirmed - Charge ' + passenger.DisplayName, // String (default: 'OK'). The text of the OK button.
                        okType: '' // String (default: 'button-positive'). The type of the OK button.

                    });
                    myPopup.then(function (res) {
                        console.log('Tapped!', res);
                        if (res == true) {
                            $ionicLoading.show({
                                template: 'Processing Payment...'
                            });

                            var customerPayment = new CustomerPayment({
                                Id: passenger.CustomerID,
                                FromCustomerID: passenger.CustomerID,
                                ToCustomerID: $scope.workBoundRide.CustomerID,
                                RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                                CostPerRide: $scope.workBoundRide.CostPerRide,
                                PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                                TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                                PaymentDate: $scope.data.usagedate,
                                PaymentStatus: 'Pending'
                            });


                            customerPayment.$update().then(function (data) {
                                $ionicLoading.hide();
                                passenger.isPassenger = true;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;
                                passenger.isUsageCommitted = true;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isUsageCommitted = true;


                                $scope.save();

                            }, function (error) {
                                $ionicLoading.hide();
                                passenger.isPassenger = false;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;
                                PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Credit Card Declined!',
                                    template: PopUpMessage
                                });
                                alertPopup.then(function (res) {
                                    console.log("After Credit Card Save");
                                    //  $scope.ride.CarpoolMembers = [];

                                });
                            });



                        }

                    });
                }
                else {
                    $ionicLoading.hide();
                    passenger.Status = "Accepted";

                    var myPopup = $ionicPopup.confirm({
                        title: 'Confirm No Fees',
                        subTitle: 'For the Ride',
                        template: 'Please note that a fee has not been set for this ride.Confirm that you do not want to charge <b>' + passenger.DisplayName + ' for the ride from <b>' + $scope.workBoundRide.StartAddress.formatted_address + '</b> to <b>' + $scope.workBoundRide.EndAddress.formatted_address + '</b> and back.', // String (optional). The html template to place in the popup body.
                        scope: $scope,
                        cancelText: 'No - I want to charge' + passenger.DisplayName, // String (default: 'Cancel'). The text of the Cancel button.
                        cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                        okText: 'Confirmed - This is a free ride for ' + passenger.DisplayName, // String (default: 'OK'). The text of the OK button.
                        okType: '' // String (default: 'button-positive'). The type of the OK button.

                    });
                    myPopup.then(function (res) {
                        console.log('Tapped!', res);
                        if (res == true) {
                            passenger.isPassenger = true;
                            if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;

                        }
                        else {
                            passenger.isPassenger = false;
                            if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;

                        }
                    });




                    // $scope.data.homeBoundRider.Status = "Accepted";


                    // $scope.save();

                }


            }

        }
        
        $scope.searchApprovedRiders = function (item) {
            if (item == null) return false;
            else if (item.Status == 'Pending' || item.Status == 'Declined')
                return false;
            else
                return true;

        }
        $scope.searchPendingRiders = function (item) {

            if (item == null) return false;
            else if (item.Status == 'Pending' || item.Status == 'Declined')
                return true;
            else
                return false;

        }
        $scope.isActiveDriver = function (item) {
            if ($scope.workBoundRide.Type == 'Carpool' && item.RegistrationStatus == 'Active' && item.isStandBy == false) return true;
            else if ($scope.workBoundRide.Type == 'Customer' && item.isStandBy == false) return true;
            else return false;
        }
        $scope.gotodriverrideusage = function () {
            //  alert($scope.selectedCarpool.CarpoolID);
            $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.rideDate });

        }

        $scope.updateWorkBoundDriver = function () {
            if ($scope.data.workBoundDriver != null && $scope.data.workBoundDriver != undefined) {
                if ($scope.data.workBoundDriverIndex != null && $scope.data.workBoundDriverIndex != undefined && $scope.data.workBoundDriverIndex!= -1)
                  $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = false;

                $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);

                $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = true;
                $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isPassenger = true;


                if ($scope.homeBoundRide != null && $scope.homeBoundRide != undefined) {
                    var homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                        return obj.CustomerID == $scope.data.workBoundDriver.CustomerID;
                    })[0];
                    if (homeBoundDriver != null && homeBoundDriver != undefined) {
                        $scope.data.homeBoundDriver = homeBoundDriver;
                        homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                        if (homeBoundDriverIndex >= 0) {
                            //$scope.data.homeBoundDriverIndex = homeBoundDriverIndex;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = false;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = true;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isPassenger = true;
                            $scope.updateHomeBoundDriver();
                        }

                    }

                }

            }

        }
        $scope.updateHomeBoundDriver = function () {


            if ($scope.data.homeBoundDriver != null && $scope.data.homeBoundDriver != undefined) {
                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = false;
                $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);

                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = true;
                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isPassenger = true;
            }
        }
        $scope.WorkBoundDriverSelected = function (callback) {
           
            $scope.updateWorkBoundDriver();
        }
        $scope.HomeBoundDriverSelected = function (callback) {

            $scope.updateHomeBoundDriver();
        }

        $scope.save = function () {

            // $scope.ride.RideDate = $scope.data.rideDate;


            $ionicLoading.show({
                template: 'Saving your Ride...'
            });
            if ($scope.workBoundRide.Id == '') {
                $scope.workBoundRide.$save().then(function (info) {
                    $scope.workBoundRide.Id = info.Id;
                    if ($scope.homeBoundRide.Id == '') {

                        $scope.homeBoundRide.$save().then(function (info) {
                            $scope.homeBoundRide.Id = info.Id;
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });



                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Workbound  Ride Was saved! There was an error saving the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.ride.CarpoolID, "usagedate": $scope.data.rideDate });

                            });


                        });

                    }
                    else // if $scope.homeBoundRide.Id != ''
                    {
                        // WorkBound Save - HomeBound Update 
                        $scope.homeBoundRide.$update().then(function (info) {
                            $ionicLoading.hide();
                            PopUpMessage = 'You Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        }, function (error) {

                            // Error block for  $scope.homeBoundRide.$update()
                            $ionicLoading.hide();

                            PopUpMessage = 'You  Workbound  Ride Was saved! There was an error updating the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        });

                    } ////  End of Else statement - if $scope.homeBoundRide.Id != ''

                }, function (error) {
                    // Error Block for  $scope.workBoundRide.$save()
                    $ionicLoading.hide();

                    PopUpMessage = 'You  Workbound  Ride could not be saved!  Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("After Ride Save");
                        //   $scope.ride.CarpoolMembers = [];
                        $scope.data.contacts = [];
                        $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.workBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                    });



                });
            }
            else // If $scope.workBoundRide.Id != ''
            {

                $scope.workBoundRide.$update().then(function (info) {
                    if ($scope.homeBoundRide.Id == '') {

                        $scope.homeBoundRide.$save().then(function (info) {
                            $scope.homeBoundRide.Id = info.Id;
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });



                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Workbound  Ride Was updated! There was an error saving the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });


                        });

                    }
                    else // if $scope.homeBoundRide.Id != ''
                    {
                        // WorkBound Save - HomeBound Update 
                        $scope.homeBoundRide.$update().then(function (info) {

                            $ionicLoading.hide();
                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });
                        }, function (error) {

                            // Error block for  $scope.homeBoundRide.$update()
                            $ionicLoading.hide();

                            PopUpMessage = 'You  Workbound  Ride Was saved! There was an error updating the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        });

                    } ////  End of Else statement - if $scope.homeBoundRide.Id != ''

                }, function (error) {
                    // Error Block for  $scope.workBoundRide.$update()
                    $ionicLoading.hide();

                    PopUpMessage = 'You  Workbound  Ride could not be saved!  Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("After Ride Save");
                        //  $scope.ride.CarpoolMembers = [];
                        $scope.data.contacts = [];
                        $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.workBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                    });



                });


            }




        }
        $scope.addRiderAndSave = function () {
            CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined)) {
                    var joinMember = { CustomerID: localStorage.getItem('customerid'), DisplayName: $scope.data.displayname, MobileNumber: localStorage.getItem('username'), isMember: false, isCoordinator: false, isSaved: false, isPassenger: false, isJoining: true, isStandBy: true, isDriverForTheRide: false, Status: 'Pending' };
                    var existWorkboundCheck = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                        return obj.MobileNumber == localStorage.getItem('username');
                    })[0];
                    if (existWorkboundCheck == null || existWorkboundCheck == undefined)
                        $scope.workBoundRide.RidePassengers.push(joinMember);
                    var existHomeboundCheck = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                        return obj.MobileNumber == localStorage.getItem('username');
                    })[0];
                    if (existHomeboundCheck == null || existHomeboundCheck == undefined)
                        $scope.homeBoundRide.RidePassengers.push(joinMember);

                    $scope.save();

                }
                else {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can request a ride. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }, function (error) {
            });


        }

    }//end of else - If No Connection

    })
.controller('AttendanceNewCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride, CustomerPaymentMethod, CustomerPayment, ConnectivityMonitor, applicationConfig) {



    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.data = {
            rideDate: new Date($stateParams.usagedate).toDateString(),
            id: $stateParams.id,
            usagedate: $stateParams.usagedate,
            type: $stateParams.type,
            displayname: $stateParams.displayname,
            mode: $stateParams.mode,
            isLoggedInUserStandby: true,
            workBoundDrivers: {},
            rides: []

        };
        var refreshData = function () {
            if (($scope.data.id != "" && $scope.data.id != undefined) && $scope.data.usagedate != "") {


                var temp = new Date($scope.data.usagedate).toDateString();

                Ride.GetByIdTypeAndDate({ id: $scope.data.id, type: $scope.data.type, rideDate: $scope.data.usagedate }).$promise
                   .then(
                        function (data) {
                            for (i = 0; i < data.length; i++) {
                                data[i].LoggedInCustomerID = localStorage.getItem("customerid");
                                if (data[i].JourneyDirection == 'Workbound') {
                                    $scope.workBoundRide = data[i];
                                    $scope.calculateFees();
                                    if ($scope.workBoundRide.RidePassengers != null) {

                                        $scope.data.loggedInRider = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                            return obj.CustomerID == localStorage.getItem("customerid");
                                        })[0];

                                        $scope.data.isLoggedInUserStandby = $scope.data.loggedInRider == undefined ? true : $scope.data.loggedInRider.isStandBy;

                                        $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                            return obj.isDriverForTheRide == true;
                                        })[0];

                                        if ($scope.data.workBoundDriver == undefined && $scope.data.isLoggedInUserStandby == false) {
                                            $scope.data.workBoundDriver = $scope.data.loggedInRider;
                                        }
                                        if ($scope.data.workBoundDriver == undefined) {
                                            $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers[0];
                                        }
                                        // $scope.data.workBoundDrivers = $scope.data.workBoundDriver; //Workaround for Autocomplete Control
                                        $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);
                                        $scope.updateWorkBoundDriver();

                                    }
                                }
                                else if (data[i].JourneyDirection == 'Homebound') {
                                    $scope.homeBoundRide = data[i];
                                    $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                    if ($scope.homeBoundRide.RidePassengers != null) {
                                        $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                            return obj.isDriverForTheRide == true;
                                        })[0];

                                        if ($scope.data.homeBoundDriver == undefined && $scope.data.isLoggedInUserStandby == false) {
                                            $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                                                return obj.CustomerID == localStorage.getItem("customerid");
                                            })[0];

                                        }
                                        if ($scope.data.homeBoundDriver == undefined) {
                                            $scope.data.homeBoundDriver = $scope.homeBoundRide.RidePassengers[0];
                                        }

                                        $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                                        // $scope.updateHomeBoundDriver();
                                        //Dont Uncomment Above - This is not required - updateHomeboundDriver is called from updateWorkboundDriver
                                    }

                                }

                            }

                        }, function (error) {
                            $ionicLoading.hide();
                            if (error.data == null) {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-appserverunavailable.html'
                                })
                              .then(function (res) {
                                  $state.go('security');
                                  return true;

                              });

                            }
                            else {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-application.html'
                                })
                              .then(function (res) {
                                  return true;
                              });

                            }
                            console.log(error);

                        }
                     );



            }
        }
        refreshData();
        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.workBoundRide.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.workBoundRide.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.workBoundRide.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.workBoundRide.PlatformFeePerRide) + parseFloat($scope.workBoundRide.CostPerRide);
            $scope.workBoundRide.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }
        $scope.AcceptWorkbound = function (item) {
            var costPerRide = 0;

            if ($scope.workBoundRide.CostPerRide != '' && $scope.workBoundRide.CostPerRide != undefined) {
                try {
                    costPerRide = parseFloat($scope.workBoundRide.CostPerRide).toFixed(2);
                    //  platformFee = parseFloat($scope.workBoundRide.PlatformFeePerRide).toFixed(2);
                    //costPerRide = costPerRide + parseFloat($scope.homeBoundRide.CostPerRide).toFixed(2);
                } catch (ex) {
                    console.log(ex);

                }
            }
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == item.CustomerID;
                })[0];
            }
            if (costPerRide > 0) {
                var myPopup = $ionicPopup.confirm({
   
                    title: 'Confirm Credit Card Charge',
                    subTitle: 'For the Ride',
                    template: 'Please Confirm that you want to accept the request for ride and charge the riders credit card', // String (optional). The html template to place in the popup body.
                    scope: $scope,
                    cancelText: 'No - Do not charge the Customer', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                    okText: 'Confirmed - Charge the customer', // String (default: 'OK'). The text of the OK button.
                    okType: '' // String (default: 'button-positive'). The type of the OK button.

                });
                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                    if (res == true) {
                        $ionicLoading.show({
                            template: 'Processing Payment...'
                        });

                        var customerPayment = new CustomerPayment({
                            FromCustomerID: item.CustomerID,
                            ToCustomerID: $scope.workBoundRide.CustomerID,
                            WorkBoundRide: $scope.workBoundRide,
                            HomeBoundRide: $scope.workBoundRide,
                            RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                            PaymentDate: $scope.data.usagedate,
                            CostPerRide: $scope.workBoundRide.CostPerRide,
                            PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                            TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                            PaymentStatus: 'Pending'
                        });


                        customerPayment.$save().then(function (data) {
                            $ionicLoading.hide();
                            item.Status = "Accepted";
                            item.isPassenger = false;


                            $scope.data.homeBoundRider.Status = "Accepted";
                            $scope.data.homeBoundRider.isPassenger = false;

                            // $scope.save();

                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Credit Card Declined!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Credit Card Save");
                                //  $scope.ride.CarpoolMembers = [];

                            });
                        });


                    }

                });
            }
            else {
                $ionicLoading.hide();
                item.Status = "Accepted";
                item.isPassenger = false;

                $scope.data.homeBoundRider.Status = "Accepted";
                $scope.data.homeBoundRider.isPassenger = false;

                $scope.save();

            }


        };
        $scope.RejectWorkbound = function (item) {
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == item.CustomerID;
                })[0];
            }
            var myPopup = $ionicPopup.confirm({

                title: 'Confirm Reject',
                subTitle: 'For the Ride',
                template: 'Please Confirm that you want to reject the request for ride. The Requster will be removed from the wait list and will be notified ', // String (optional). The html template to place in the popup body.
                scope: $scope,
                cancelText: 'No - Do not REject the request for the ride', // String (default: 'Cancel'). The text of the Cancel button.
                cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                okText: 'Confirmed - Reject the request for the Ride', // String (default: 'OK'). The text of the OK button.
                okType: '' // String (default: 'button-positive'). The type of the OK button.

            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
                if (res == true) {
                    item.Status = "Declined";
                    item.isPassenger = false;

                    $scope.data.homeBoundRider.Status = "Declined";
                    $scope.data.homeBoundRider.isPassenger = false;

                    $scope.save();
                }

            });

        };
        var chargePassenger = function (passenger) {


            var customerPayment = new CustomerPayment({
                Id: passenger.CustomerID,
                FromCustomerID: passenger.CustomerID,
                ToCustomerID: $scope.workBoundRide.CustomerID,
                WorkBoundRide: $scope.workBoundRide,
                HomeBoundRide: $scope.workBoundRide,
                RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                CostPerRide: $scope.workBoundRide.CostPerRide,
                PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                PaymentDate: $scope.data.usagedate,
                PaymentStatus: 'Pending'
            });


            customerPayment.$update().then(function (data) {
                $ionicLoading.hide();
                passenger.isPassenger = true;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;
                passenger.isUsageCommitted = true;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isUsageCommitted = true;


                // $scope.save();

            }, function (error) {
                $ionicLoading.hide();
                passenger.isPassenger = false;
                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;
                PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                var alertPopup = $ionicPopup.alert({
                    title: 'Credit Card Declined!',
                    template: PopUpMessage
                });
                alertPopup.then(function (res) {
                    console.log("After Credit Card Save");
                    //  $scope.ride.CarpoolMembers = [];

                });
            });
        }
        $scope.passengerSelected = function (passenger) {
            if ($scope.homeBoundRide.RidePassengers != null) {
                $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == passenger.CustomerID;
                })[0];
            }
            if ($scope.workBoundRide.RidePassengers != null) {
                $scope.data.workBoundRider = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == passenger.CustomerID;
                })[0];
            }
            if (passenger.isStandBy && passenger.isPassenger) {


                if ($scope.workBoundRide.TotalCostPerRide > 0) {
                    var myPopup = $ionicPopup.confirm({
                        title: 'Confirm Credit Card Charge',
                        subTitle: 'For the Ride',
                        template: 'Please Confirm that you want to charge <b>' + passenger.DisplayName + '</b>, an amount of <b>$' + $scope.workBoundRide.TotalCostPerRide + '</b> for the ride from <b>' + $scope.workBoundRide.StartAddress.formatted_address + '</b> to <b>' + $scope.workBoundRide.EndAddress.formatted_address + '</b> and back. You will not be able to undo this operation', // String (optional). The html template to place in the popup body.
                        scope: $scope,
                        cancelText: 'No - Do not charge' + passenger.DisplayName, // String (default: 'Cancel'). The text of the Cancel button.
                        cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                        okText: 'Confirmed - Charge ' + passenger.DisplayName, // String (default: 'OK'). The text of the OK button.
                        okType: '' // String (default: 'button-positive'). The type of the OK button.

                    });
                    myPopup.then(function (res) {
                        console.log('Tapped!', res);
                        if (res == true) {
                            $ionicLoading.show({
                                template: 'Processing Payment...'
                            });

                            var customerPayment = new CustomerPayment({
                                Id: passenger.CustomerID,
                                FromCustomerID: passenger.CustomerID,
                                ToCustomerID: $scope.workBoundRide.CustomerID,
                                WorkBoundRide: $scope.workBoundRide,
                                HomeBoundRide: $scope.workBoundRide,
                                RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                                CostPerRide: $scope.workBoundRide.CostPerRide,
                                PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                                TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                                PaymentDate: $scope.data.usagedate,
                                PaymentStatus: 'Pending'
                            });


                            customerPayment.$update().then(function (data) {
                                $ionicLoading.hide();
                                passenger.isPassenger = true;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;
                                passenger.isUsageCommitted = true;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isUsageCommitted = true;
                                if ($scope.workBoundRide.Id == '' || data.WorkBoundRide.Id != '') {
                                    $scope.data.id = data.WorkBoundRide.Id;
                                }
                                refreshData();

                              //  $scope.save();

                            }, function (error) {
                                $ionicLoading.hide();
                                passenger.isPassenger = false;
                                if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;
                                PopUpMessage = 'Credit Card could not be processed.  Contact Support';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Credit Card Declined!',
                                    template: PopUpMessage
                                });
                                alertPopup.then(function (res) {
                                    console.log("After Credit Card Save");
                                    //  $scope.ride.CarpoolMembers = [];

                                });
                            });



                        }

                    });
                }
                else {
                    $ionicLoading.hide();
                    passenger.Status = "Accepted";

                    var myPopup = $ionicPopup.confirm({
                      
                        title: 'Confirm No Fees',
                        subTitle: 'For the Ride',
                        template: 'Please note that a fee has not been set for this ride.Confirm that you do not want to charge <b>' + passenger.DisplayName + ' for the ride from <b>' + $scope.workBoundRide.StartAddress.formatted_address + '</b> to <b>' + $scope.workBoundRide.EndAddress.formatted_address + '</b> and back.', // String (optional). The html template to place in the popup body.
                        scope: $scope,
                        cancelText: 'No - I want to charge' + passenger.DisplayName, // String (default: 'Cancel'). The text of the Cancel button.
                        cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                        okText: 'Confirmed - This is a free ride for ' + passenger.DisplayName, // String (default: 'OK'). The text of the OK button.
                        okType: '' // String (default: 'button-positive'). The type of the OK button.

                    });
                    myPopup.then(function (res) {
                        console.log('Tapped!', res);
                        if (res == true) {
                            passenger.isPassenger = true;
                            if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = true;

                        }
                        else {
                            passenger.isPassenger = false;
                            if ($scope.data.homeBoundRider != null || $scope.data.homeBoundRider != undefined) $scope.data.homeBoundRider.isPassenger = false;

                        }
                    });




                    // $scope.data.homeBoundRider.Status = "Accepted";


                    // $scope.save();

                }


            }

        }

        $scope.searchApprovedRiders = function (item) {
            if (item == null) return false;
            else if (item.Status == 'Pending' || item.Status == 'Declined')
                return false;
            else
                return true;

        }
        $scope.searchPendingRiders = function (item) {

            if (item == null) return false;
            else if (item.Status == 'Pending' || item.Status == 'Declined')
                return true;
            else
                return false;

        }
        $scope.isActiveDriver = function (item) {
            if ($scope.workBoundRide.Type == 'Carpool' && item.RegistrationStatus == 'Active' && item.isStandBy == false) return true;
            else if ($scope.workBoundRide.Type == 'Customer' && item.isStandBy == false) return true;
            else return false;
        }
        $scope.gotodriverrideusage = function () {
            //  alert($scope.selectedCarpool.CarpoolID);
            $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.rideDate });

        }

        $scope.updateWorkBoundDriver = function () {
            if ($scope.data.workBoundDriver != null && $scope.data.workBoundDriver != undefined) {
                if ($scope.data.workBoundDriverIndex != null && $scope.data.workBoundDriverIndex != undefined && $scope.data.workBoundDriverIndex != -1)
                    $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = false;

                $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);

                $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = true;
                $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isPassenger = true;


                if ($scope.homeBoundRide != null && $scope.homeBoundRide != undefined) {
                    var homeBoundDriver = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                        return obj.CustomerID == $scope.data.workBoundDriver.CustomerID;
                    })[0];
                    if (homeBoundDriver != null && homeBoundDriver != undefined) {
                        $scope.data.homeBoundDriver = homeBoundDriver;
                        homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
                        if (homeBoundDriverIndex >= 0) {
                            //$scope.data.homeBoundDriverIndex = homeBoundDriverIndex;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = false;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = true;
                            //$scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isPassenger = true;
                            $scope.updateHomeBoundDriver();
                        }

                    }

                }

            }

        }
        $scope.updateHomeBoundDriver = function () {


            if ($scope.data.homeBoundDriver != null && $scope.data.homeBoundDriver != undefined) {
                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = false;
                $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);

                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = true;
                $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isPassenger = true;
            }
        }
        $scope.WorkBoundDriverSelected = function (callback) {

            $scope.updateWorkBoundDriver();
        }
        $scope.HomeBoundDriverSelected = function (callback) {

            $scope.updateHomeBoundDriver();
        }

        $scope.save = function () {

            // $scope.ride.RideDate = $scope.data.rideDate;


            $ionicLoading.show({
                template: 'Saving your Ride...'
            });
            if ($scope.workBoundRide.Id == '') {
                $scope.workBoundRide.$save().then(function (info) {
                    $scope.workBoundRide.Id = info.Id;
                    if ($scope.homeBoundRide.Id == '') {

                        $scope.homeBoundRide.$save().then(function (info) {
                            $scope.homeBoundRide.Id = info.Id;
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });



                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Workbound  Ride Was saved! There was an error saving the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.ride.CarpoolID, "usagedate": $scope.data.rideDate });

                            });


                        });

                    }
                    else // if $scope.homeBoundRide.Id != ''
                    {
                        // WorkBound Save - HomeBound Update 
                        $scope.homeBoundRide.$update().then(function (info) {
                            $ionicLoading.hide();
                            PopUpMessage = 'You Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        }, function (error) {

                            // Error block for  $scope.homeBoundRide.$update()
                            $ionicLoading.hide();

                            PopUpMessage = 'You  Workbound  Ride Was saved! There was an error updating the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        });

                    } ////  End of Else statement - if $scope.homeBoundRide.Id != ''

                }, function (error) {
                    // Error Block for  $scope.workBoundRide.$save()
                    $ionicLoading.hide();

                    PopUpMessage = 'You  Workbound  Ride could not be saved!  Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("After Ride Save");
                        //   $scope.ride.CarpoolMembers = [];
                        $scope.data.contacts = [];
                        $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.workBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                    });



                });
            }
            else // If $scope.workBoundRide.Id != ''
            {

                $scope.workBoundRide.$update().then(function (info) {
                    if ($scope.homeBoundRide.Id == '') {

                        $scope.homeBoundRide.$save().then(function (info) {
                            $scope.homeBoundRide.Id = info.Id;
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });



                        }, function (error) {
                            $ionicLoading.hide();

                            PopUpMessage = 'You new Workbound  Ride Was updated! There was an error saving the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                //  $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });


                        });

                    }
                    else // if $scope.homeBoundRide.Id != ''
                    {
                        // WorkBound Save - HomeBound Update 
                        $scope.homeBoundRide.$update().then(function (info) {

                            $ionicLoading.hide();
                            PopUpMessage = 'You new Ride is saved!';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });
                        }, function (error) {

                            // Error block for  $scope.homeBoundRide.$update()
                            $ionicLoading.hide();

                            PopUpMessage = 'You  Workbound  Ride Was saved! There was an error updating the Homebound Ride. Contact Support';
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ride!',
                                template: PopUpMessage
                            });
                            alertPopup.then(function (res) {
                                console.log("After Ride Save");
                                // $scope.ride.CarpoolMembers = [];
                                $scope.data.contacts = [];
                                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.homeBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                            });

                        });

                    } ////  End of Else statement - if $scope.homeBoundRide.Id != ''

                }, function (error) {
                    // Error Block for  $scope.workBoundRide.$update()
                    $ionicLoading.hide();

                    PopUpMessage = 'You  Workbound  Ride could not be saved!  Contact Support';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ride!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("After Ride Save");
                        //  $scope.ride.CarpoolMembers = [];
                        $scope.data.contacts = [];
                        $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.workBoundRide.CarpoolID, "usagedate": $scope.data.rideDate });

                    });



                });


            }




        }
        $scope.addRiderAndSave = function () {
            CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined)) {
                    var joinMember = { CustomerID: localStorage.getItem('customerid'), DisplayName: $scope.data.displayname, MobileNumber: localStorage.getItem('username'), isMember: false, isCoordinator: false, isSaved: false, isPassenger: false, isJoining: true, isStandBy: true, isDriverForTheRide: false, Status: 'Pending' };
                    var existWorkboundCheck = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                        return obj.MobileNumber == localStorage.getItem('username');
                    })[0];
                    if (existWorkboundCheck == null || existWorkboundCheck == undefined)
                        $scope.workBoundRide.RidePassengers.push(joinMember);
                    var existHomeboundCheck = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                        return obj.MobileNumber == localStorage.getItem('username');
                    })[0];
                    if (existHomeboundCheck == null || existHomeboundCheck == undefined)
                        $scope.homeBoundRide.RidePassengers.push(joinMember);

                    $scope.save();

                }
                else {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can request a ride. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }, function (error) {
            });


        }

    }//end of else - If No Connection

})

.controller('VideoSessionsCtrl', ['$ionicPlatform', '$scope', '$http', '$state', '$stateParams', '$ionicPopup','$ionicModal', '$ionicLoading', '$interval','applicationConfig',  'Account', 'SignalRSvc','VideoCall', 'ConnectivityMonitor', 
function ($ionicPlatform,$scope, $http, $state, $stateParams, $ionicPopup,$ionicModal, $ionicLoading,$interval, applicationConfig, Account, SignalRSvc, VideoCall, ConnectivityMonitor) {
    $ionicPlatform.ready(function () {
        if (ConnectivityMonitor.isOffline()) {
            $state.go('errorconnection');
        }
        else {


         
            $scope.EncounterRequestsAppointments=[];
            $scope.EncounterRequestsWalkins=[];
            $scope.EncounterRequestsPool=[];
            $scope.ProviderID = localStorage.getItem("customerid");
            $scope.data = {};
            $scope.data.showSearch = true;
            $scope.data.toggleString = "Hide";
         
           


            $scope.showAppointments = true;
            $scope.showWalkins = false;         
            $scope.showPool = false;
            $scope.showSection = function (sec) {
                $scope.showAppointments = false;
                $scope.showWalkins = false;
                $scope.showPool = false;
                switch (sec) {
                    case 'appointments': $scope.showAppointments = true; break;
                    case 'walkins': $scope.showWalkins = true; break;
                    case 'pool': $scope.showPool = true; break;
                }

            }
           
          
            $scope.goToVideoCall=function(item)
            {
                 $state.go('tab.provider.videoSessions.videocall',{"VideoCallSessionID":item.VideoCallSessionID});
            }
           
            // Get the bounds from the map once it's loaded

            $scope.toggleShowSearch = function (flag) {
                $scope.data.showSearch = flag;
                $scope.data.toggleString = flag ? "Hide" : "Show";

            }
            $scope.close=function()
            {
                $scope.modal.hide();
                $scope.modal.remove();
            }
            $scope.getVideoSessions = function () {
                VideoCall.GetOpenVideoSessions({ publisherID:  $scope.ProviderID , subscriberID: 'na', role: 'Provider'
                   }).$promise.then(function (data) {
                    $scope.EncounterRequests = data;
                      $scope.EncounterRequestsAppointments= data.filter(function (obj) {
                          
                         return (obj.EncounterRequestType == 'Appointment');
                      });
            $scope.EncounterRequestsWalkins=data.filter(function (obj) {
                          
                         return (obj.EncounterRequestType == 'Walkin');
                      });
            $scope.EncounterRequestsPool=data.filter(function (obj) {
                          
                         return (obj.EncounterRequestType == 'Pool');
                      });

                }, function (error) {
                    $ionicLoading.hide();
                    ///// Not Displaying error to make sure interval refresh does not screw up
                    // if (error.data == null) {
                    //     $ionicPopup.alert({
                    //         title: applicationConfig.errorPopupTitle,
                    //         templateUrl: 'templates/error-appserverunavailable.html'
                    //     })
                    //   .then(function (res) {
                        
                    //       $state.go('security');
                    //       return true;

                    //   });

                    // }
                    // else {
                    //     $ionicPopup.alert({
                    //         title: applicationConfig.errorPopupTitle,
                    //         templateUrl: 'templates/error-application.html'
                    //     })
                    //   .then(function (res) {
                    //       return true;
                    //   });

                    // }
                    console.log(error);

                }

                );

            }

            $interval( function() {
               $scope.getVideoSessions();
            }, 5000);
            
              
        }
    });
  
}])

.controller('VideoChatProviderNewCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading,$timeout, $ionicModal, Account,VideoCall,Encounter,Prescription,Appointment ,CustomerEncounterPayment, ConnectivityMonitor, applicationConfig) {



    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
                $scope.$parent.$on('$ionicView.beforeLeave', function(){
// Your logic here. On page redirect
                if(opentok.session!=undefined)
                      opentok.session.disconnect();
            });
            $scope.$on("ProviderTabDeselected",function () {
                console.log('my event occurred');
                if(opentok.session!=undefined)
                 opentok.session.disconnect();
                 if(opentok.publisher!=undefined){
                     opentok.publisher.destroy();
                 }
            });
            // cordova.plugins.diagnostic.isCameraAvailable(function(available){
            //     if(!available)
            //     {
            //         cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
            //         if(!cordova.plugins.diagnostic.permissionStatus.GRANTED)
            //         {
            //             alert("Unable to get camera permission");
            //             $state.go('tab.account', {}, { reload: true });
            //         }
            // });
            //     }
            // });
        var initializeDataforNewEncounter = function(){
         $scope.data = {
           id: localStorage.getItem("customerid"),
           isLoggedInUserStandby: true,
           apiKey:undefined,
           sessionId:undefined,
           token:undefined,
           streamId:0,
           isEncounterPopupActive:false,
           connectionCount:0,
           Pool:true,
           showPrescription:false,
           Prescriptiontext:'Open Prescriptions',
           handWritePrescription:false,          
           signaturePad :undefined,
           prescriptionData:'',
           searchTerm:'',
           subscribers:[],
           encProvider:undefined,
           encCustomer:undefined,
           IsProviderConnected:false,
    


        };

        }
        initializeDataforNewEncounter();
        
         $scope.publisherOptions = {
            insertMode: "append",
            height: "100%",
            width: "100%",
            name:""
        }

         var initializeDataforNewPrescription = function(){    
         $scope.Prescription =new Prescription({
             id:undefined,
             provider:undefined,
             customer:undefined,
             isTyped:false,
             prescriptionText:'',
             imageUrl:undefined,
             refills:0

         });
        }

        initializeDataforNewPrescription();

        $scope.subscriberOptions = {
        insertMode: "append",
        height: "100%",
        width: "100%"
        }
        
        var opentok = {
                config: undefined,
                session: undefined,
                publisher: undefined,
                subscriber: undefined,
                isSubscribing: false,
                

                initializePublisher: function() {
                    opentok.publisher = OT.initPublisher('publisher',$scope.publisherOptions);
                    opentok.publisher.on('accessAllowed', opentok.onPublisherAllowed, this)
                                     .on('accessDenied',  opentok.onpublisherDenied, this);
                },

                initializeSession: function() {
                    opentok.session = OT.initSession($scope.data.apiKey, $scope.data.sessionId);
                    opentok.session.on('streamCreated', opentok.onStreamCreated);
                    opentok.session.on('streamDestroyed', opentok.onStreamDestroyed);
                    opentok.session.on('sessionDisconnected', opentok.onSessionDisconnected);
                   
                    opentok.session.on({
                            connectionCreated: function (event) {
                                $scope.data.connectionCount++;
                                if (event.connection.connectionId != opentok.session.connection.connectionId) {
                            //   console.log('Another client connected. ' + connectionCount + ' total.');
                                    if($scope.data.connectionCount>2 && angular.fromJson(opentok.session.connection.data).role =="Provider" &&angular.fromJson(event.stream.connection.data).role=="Subscriber"){
                                    opentok.session.forceDisconnect(event.connection);                                
                                    }
                                }
                            },
                            connectionDestroyed: function connectionDestroyedHandler(event) {
                                connectionCount--;
                                console.log('A client disconnected. ' + connectionCount + ' total.');
                            }
                            });
                    opentok.session.connect($scope.data.token, opentok.onSessionConnected);
                },

                onSessionConnected: function(event) {
                    console.log('onSessionConnected: ', event);
                    opentok.session.publish(opentok.publisher);
                    // $timeout(callAtTimeout, 3000);
                },
                 onSessionDisconnected: function(event) {
                    console.log('onSessiondisConnected: ', event);
                    $scope.buttonDisabled=false;   
                     $scope.data.apiKey = undefined;
                            $scope.data.sessionId = undefined;
                            $scope.data.token=undefined
                            $scope.publisherOptions.name = undefined;
                            $scope.Prescription = undefined;
                             
                },

                onStreamCreated: function(event) {

                    if (!opentok.isSubscribing ) {
                        $scope.streamconnected=true;
                        console.log('onStreamCreated: ', event);
                        opentok.subscriber = opentok.session.subscribe(event.stream, 'subscriber',$scope.subscriberOptions);
                        opentok.isSubscribing = true;
                        
                        if($scope.data.streamId!=event.stream.streamId)
                        {
                                    if(!$scope.data.isEncounterPopupActive){
                                        
                                        $scope.data.streamId=opentok.subscriber.streamId;
                                        $scope.data.isEncounterPopupActive=true;
                                            var confirmPopup = $ionicPopup.confirm({
                                            title: 'Confirm Encounter',
                                            template: 'Do you want to talk with this patient?',
                                            cancelText: 'No',
                                            okText: 'Yes'
                                        });

                                    confirmPopup.then(function(res) {
                                        $scope.data.isEncounterPopupActive=false;
                                    if(res) {
                                           
                                        var confirmPopup2 = $ionicPopup.confirm({
                                                        title: 'Confirm Pay Encounter',
                                                        template: 'Do you want charge this patient?',
                                                        cancelText: 'No',
                                                        okText: 'Yes'
                                                });

                                                confirmPopup2.then(function(res) {
                                                if(res) {
                                                       $ionicLoading.Prescription.prescriptionTextshow({
                                                            template: 'Processing Payment...'
                                                        });
                                                    Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) 
                                                    {
                                                         $scope.Prescription.provider = info;


                                                            var flatfees = parseFloat( $scope.Prescription.provider.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
                                                            var fees = parseFloat((($scope.Prescription.provider.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
                                                            $scope.Prescription.provider.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
                                                            var totalfees = parseFloat( $scope.Prescription.provider.PlatformFeePerRide) + parseFloat($scope.Prescription.provider.CostPerRide);
                                                            $scope.Prescription.provider.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
                                                       // $scope.data.encProvider=info;
                                                        ide=angular.fromJson(opentok.subscriber.stream.connection.data).userID;
                                                        Account.get({id: ide}).$promise.then(function (data) 
                                                        {
                                                            $scope.Prescription.customer = data;
                                                            $scope.Encounter=new Encounter({Provider: $scope.Prescription.provider,Subscriber:data/*,isUsageCommitted:true change TODO,PaymentId:null,PaymentAmount:null,PaymentStatus: null*/,EncounterStartTime:new Date(opentok.session.connection.creationTime)}); 
                                                            $scope.CustomerEncounterPayment = new CustomerEncounterPayment({CostPerRide:$scope.Encounter.Provider.CostPerRide,TotalCostPerRide:$scope.Encounter.Provider.TotalCostPerRide,PaymentDate:opentok.session.connection.creationTime, Encounter: $scope.Encounter})
                                                            $scope.CustomerEncounterPayment.$update({id:'1234'}).then(function (customerEncounterPayment) 
                                                                {
                                                                // $scope.Encounter=customerEncounterPayment.Encounter;
                                                                 $ionicLoading.hide();
                                                                   var alertPopup = $ionicPopup.alert({
                                                                        title: 'Payment Processing Succeeded',
                                                                        template: 'Payment processed succeessfully. Please proceed with the encounter'
                                                                    });

                                                                    alertPopup.then(function(res) {
                                                                        console.log('Payment is processed succeessfully.');                           
                                                                    });

                                                                 
                                                                }, function(error){
                                                                     $ionicLoading.hide();
                                                                   var alertPopup = $ionicPopup.alert({
                                                                        title: 'Payment Processing Failed',
                                                                        template: 'Payment processing failed. Please end the encounter'
                                                                    });

                                                                    alertPopup.then(function(res) {
                                                                        console.log('Payment is processed Failed.');                           
                                                                    });

                                                                });
                                                           
                                                        })
                                                    })
                                                } 
                                                else 
                                                {
                                                    Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) 
                                                    {
                                                        $scope.data.encProvider = info;
                                                        $scope.Prescription.provider = info;
                                                        ide=angular.fromJson(opentok.subscriber.stream.connection.data).userID;
                                                        Account.get({id: ide}).$promise.then(function (data) 
                                                        {
                                                            $scope.data.encCustomer = data;
                                                            $scope.Prescription.customer = data;
                                                            $scope.Encounter=new Encounter({Provider:$scope.data.encProvider,Subscriber:data/*,isUsageCommitted:true change TODO,PaymentId:null,PaymentAmount:null,PaymentStatus: null*/,EncounterStartTime:new Date(opentok.session.connection.creationTime)});
                                                            $scope.Encounter.$save().then(function (hi) 
                                                            {
                                                                $scope.Encounter=hi;
                                                            });
                                                        })
                                                    })
                                                }
                                            });
                                    } 
                                    else 
                                    {
                                         opentok.session.disconnect();
                                            $state.go('tab.account', {}, { reload: true });
                                        

                                    }
                                });
                        }
                        }
                    }
                },
                //end of stream created
                onStreamDestroyed: function(event) {
                    if (opentok.isSubscribing && event.stream.streamId === opentok.subscriber.stream.streamId) {
                        console.log('onStreamDestroyed: ', event);
                        opentok.session.unsubscribe(opentok.subscriber);
                        opentok.isSubscribing = false;
                        opentok.subscriber = undefined;
                        $scope.buttonDisabled=false;
                        initializeDataforNewEncounter();
                        initializeDataforNewPrescription();
                    }
                },
                // Waits to connect to the session until after the user approves access to camera and mic
                    onPublisherAllowed: function() {
                        $scope.data.waitingHardwareAccess=false;
                        $scope.data.waitingDoctor=true;
                        $scope.data.IsProviderConnected = true;
                        opentok.session.connect($scope.data.token, opentok.onSessionConnected);
                        
                    },
                    onpublisherDenied: function() {
                        alert('Camera access denied. Please reset the setting in your browser and try again.');
                        this.close();
                    }
    };
            //      $ionicModal.fromTemplateUrl('./templates/prescription.html', {
            //     scope: $scope,
            //     animation: 'slide-in-up'
            // }).then(function (modal) {
                          
   
            //       $scope.modal = modal
            // }, function (error) {
            //     console.log(error);
            // })
    $ionicModal.fromTemplateUrl('./templates/prescriptionModal.html', {
                                                            scope: $scope,
                                                            animation: 'slide-in-up'
                                                        }).then(function (modal) {
                                                            $scope.modal = modal
                                                        }, function (error) {
                                                            console.log(error);
                                                        });
       $scope.showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Prescription Cannot be Saved',
                    template: 'Please Select a Patient'
                });

                alertPopup.then(function(res) {
                    console.log('Trying to Get the Patient');
                     getProviderAndSubscriber();
                });
                };
               


      
        $scope.searchSubscriber=function(){
                if($scope.data.searchTerm.length>0){
                $scope.data.encCustomer=undefined;
        
                Appointment.GetSubsribers({searchTerm:$scope.data.searchTerm,isProvider:'true'}).$promise.then( function(data){
                    $scope.data.subscribers= data;

                }, function(err){

                }

                )
                
            }
            }    
      var getProviderAndSubscriber = function(){
           Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) 
                                                    {
                                                      //  $scope.data.encProvider=info;
                                                      $scope.Prescription.provider = info;
                                                      if(!$scope.Prescription.customer)
                                                      {
                                                        $scope.modal.show();
                                                      }
                                                    })
      }     
       $scope.prescriptionWrite = function () {    
            $scope.data.showPrescription = !$scope.data.showPrescription;
                if(! $scope.data.showPrescription )  $scope.data.Prescriptiontext="Open Prescription"; 
                else  $scope.data.Prescriptiontext="Close Prescription"; 
                  if($scope.Prescription.provider==undefined){
                   getProviderAndSubscriber(); 
          }     
       }                                   
      $scope.prescriptionSave = function () {
            
            
           
            
                                   
                 // Save prescription to Backend
                 
              

                if($scope.Prescription.provider==undefined || $scope.Prescription.customer==undefined){
                     $scope.showAlert();
                }
                else{
                if($scope.data.signaturePad!= undefined){
                 var sigImg = $scope.data.signaturePad.toDataURL();
                 $scope.signature = sigImg;
                }
                

               // $scope.Prescription=new Prescription({provider:$scope.data.encProvider,customer:$scope.data.encCustomer,isTyped:!$scope.data.handWritePrescription,prescriptionText:$scope.data.prescriptionData,imageUrl:$scope.signature}); 

                $scope.Prescription.isTyped=!$scope.data.handWritePrescription;
                $scope.Prescription.imageUrl=$scope.signature;
                if( $scope.Prescription.id==null ||  $scope.Prescription.id==undefined ||  $scope.Prescription.id=='')
                {
                    $scope.Prescription.$save().then(function (hi) 
                    {
                        // $scope.Prescription=hi;
                        $scope.Prescription.id = hi.Id;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription Saved',
                                template: 'Prescription is Saved'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');
                                $scope.data.showPrescription = !$scope.data.showPrescription;

                                $scope.data.Prescriptiontext="Open Prescription"; 
                            });
                        
                    }, function (error){
                            $scope.Prescription=undefined;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription not Saved',
                                template: 'Prescription could not be Saved. Please contact Support if this problem persists'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');                           
                            });

                    });
                }
                else
                {
                    $scope.Prescription.$update({id:$scope.Prescription.id}).then(function (hi) 
                    {
                        
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription Saved',
                                template: 'Prescription is Saved'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');
                                $scope.data.showPrescription = !$scope.data.showPrescription;

                                $scope.data.Prescriptiontext="Open Prescription"; 
                            });
                        
                    }, function (error){
                            $scope.Prescription=undefined;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription not Saved',
                                template: 'Prescription could not be Saved. Please contact Support if this problem persists'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');                           
                            });

                    });

                }

                }

            

            
           
        }
                

              $scope.togglePrescriptionMode= function(){
                   if($scope.data.handWritePrescription)
                 {
                     if( $scope.data.canvas ==null || $scope.data.canvas ==undefined){
                        $scope.data.canvas = document.getElementById('prescriptionCanvas');   
                        $scope.data.signaturePad = new SignaturePad( $scope.data.canvas );                  
                     } 
                     
                    
                 }

              }
            var refreshData = function () {

                $scope.buttonDisabled=false;
                opentok.initializePublisher();
            }


        refreshData();
        
        $scope.initiateVideoCall = function(type){
            if($scope.buttonDisabled)
             {
                 return;
             }
             if(type=='Walkin')
             {
                 if($scope.data.Pool) type='Pool';
             }
            //document.getElementById("aptbut").disabled = $scope.buttonDisabled;
            //document.getElementById("patbut").disabled = $scope.buttonDisabled;
              initializeDataforNewEncounter();
              initializeDataforNewPrescription();

              if (($scope.data.id != "" && $scope.data.id != undefined) ) {
                    
               
                VideoCall.GetSubscriberFromQueue({ publisherID: $scope.data.id,type:type}).$promise
                   .then( 
                        function (data) {
    
                         
                            if(data.sessionID)
                            {
                                 var confirmPopup = $ionicPopup.confirm({
                                    title: 'Patient Information',
                                    template: data.name,
                                    okText: 'Ok'
                                 });
                          
                            confirmPopup.then(function(res) {
                                
                                if(res) {
                            $scope.data.apiKey = data.apiKey;
                            $scope.data.sessionId = data.sessionID;
                            $scope.data.token=data.tokenID;
                            $scope.publisherOptions.name = data.name;
                            OT.setLogLevel(OT.DEBUG);                           
                            opentok.initializeSession();
                            $scope.buttonDisabled=true;
                              $scope.callAtTimeout = function() {
                                console.log("$scope.callAtTimeout - Timeout occurred");
                                if($scope.streamconnected==false)
                                {
                                    $scope.buttonDisabled = false;
                                    alert("Patient is unable to connect right now");
                                }
                            }
                            $timeout($scope.callAtTimeout, 10000);                            
                            $scope.streamconnected=false;

                            // while(!$scope.streamconnected)
                            // {
                            //     $scope.$watch('streamconnected', function(newValue, oldValue) {
                            //     });
                            //     if((new Date()).getTime()-$scope.currentTime > 10000)
                            //     {
                            //         $scope.streamconnected=true;
                            //         alert("Patient is unable to connect to call");
            
                            //         $scope.buttonDisabled=false;
                            //     }
                            // }
                                }
                            })
                            }
                            else
                            {
                                if(type=="Pool")
                                {
                                    alert("No patients available from the general queue right now, please try again later")

                                }
                                else{
                                    if(type=='Appointment')
                                    {
                                        alert("No appointments right now.")
                                    }
                                    else
                                    {
                                        alert("No walk-in patients available right now.");
                                    }
                                }
                            }
                            
                                } 

                        ), function (error) {
                            $ionicLoading.hide();
                            if (error.data == null) {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-appserverunavailable.html'
                                })
                              .then(function (res) {
                                  $state.go('security');
                                  return true;

                              });

                            }
                            else {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-application.html'
                                })
                              .then(function (res) {
                                  return true;
                              });
                            }
                            console.log(error);
                        }   
                     
            }
         }
       
         
       
        
       

  



  }//end of else - If No Connection

})

.controller('VideoChatProviderNewDeepLinkCtrl', function ($scope, $rootScope,$stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading,$timeout, $ionicModal,$ionicPopover, Account,VideoCall,Encounter,Prescription,Appointment ,CustomerEncounterPayment, ConnectivityMonitor, applicationConfig) {



    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
             // $scope.$parent.$on('$ionicView.beforeLeave', function(){
             //        if( $scope.data.EncounterRequestID!=undefined)
             //            VideoCall.GetStatusUpdate({subscriberID:$scope.data.EncounterRequestID,p1:"a",p2:"p2",p3:"p3"}).$promise.then(function (info) {

             //            });
             //    // Your logic here. On page redirect
             //    if(  $scope.webRTCClient){
                       
             //           $scope.webRTCClient.hangUp();
             //           apiRTC.disconnect();
             //    }
             //});
           
           $rootScope.apiRTCProviderSessionID=$stateParams.VideoCallSessionID;
            var initializeDataforNewEncounter = function(){
            $scope.data = {
                    id: localStorage.getItem("customerid"),                   
                    isLoggedInUserStandby: true,
                     EncounterRequestID:undefined,
                    streamId:0,
                    isEncounterPopupActive:false,
                    connectionCount:0,
                    Pool:true,
                    showPrescription:false,
                    Prescriptiontext:'Open Prescriptions',
                    handWritePrescription:false,          
                    signaturePad :undefined,
                    prescriptionData:'',
                    searchTerm:'',
                    subscribers:[],
                    encProvider:undefined,
                    encCustomer: undefined,
                    encCustomerID:undefined,
                    IsProviderConnected:false,
                };
            }
            initializeDataforNewEncounter();
        
            
            var initializeDataforNewPrescription = function(){    
                $scope.Prescription =new Prescription({
                    id:undefined,
                    provider:undefined,
                    customer:undefined,
                    isTyped:false,
                    prescriptionText:'',
                    imageUrl:undefined,
                    refills: 0,
                    PrescriptionDate: new Date(),
                    EncounterID: $scope.Encounter?$scope.Encounter.Id:""


                });
            }

            initializeDataforNewPrescription();

           
        
           
           $scope.popover=$ionicPopover.fromTemplateUrl('./templates/PrescriptionPopOver.html', {
                    
                    scope: $scope,
                    "backdropClickToClose" :false
                }).then(function(popover) {
                    $scope.popover = popover;
            });

            $scope.showPrescriptionPopOver = function($event){
                // $scope.prescriptionWrite();
                $scope.data.showPrescription = !$scope.data.showPrescription;
                $scope.popover.show($event);

            }


            $scope.openPopover = function($event) {
                $scope.popover.show($event);
            };
            $scope.closePopover = function() {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function() {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function() {
                // Execute action
            });
          

            $ionicModal.fromTemplateUrl('./templates/prescriptionModal.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal
                    }, function (error) {
                        console.log(error);
             });
            $scope.showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Prescription Cannot be Saved',
                    template: 'Please Select a Patient'
                });

                alertPopup.then(function(res) {
                    console.log('Trying to Get the Patient');
                     getProviderAndSubscriber();
                });
                };
               


      
            $scope.searchSubscriber=function(){
                    if($scope.data.searchTerm.length>0){
                    $scope.data.encCustomer=undefined;
            
                    Appointment.GetSubsribers({searchTerm:$scope.data.searchTerm,isProvider:'true'}).$promise.then( function(data){
                        $scope.data.subscribers= data;

                    }, function(err){

                    }

                    )
                    
                }
            }    
      var getProviderAndSubscriber = function(){
           Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) 
                                                    {
                                                      //  $scope.data.encProvider=info;
                                                      $scope.Prescription.provider = info;
                                                      if(!$scope.Prescription.customer)
                                                      {
                                                        $scope.modal.show();
                                                      }
                                                    })
      }     
       $scope.prescriptionWrite = function () {    
            $scope.data.showPrescription = !$scope.data.showPrescription;
                if(! $scope.data.showPrescription )  $scope.data.Prescriptiontext="Open Prescription"; 
                else  $scope.data.Prescriptiontext="Close Prescription"; 
                  if($scope.Prescription.provider==undefined){
                   getProviderAndSubscriber(); 
          }     
       }                                   
       $scope.prescriptionSave = function () {
            
            
           
            
                                   
                 // Save prescription to Backend
                 
              

                if($scope.Prescription.provider==undefined || $scope.Prescription.customer==undefined){
                     $scope.showAlert();
                }
                else{
                if($scope.data.signaturePad!= undefined){
                 var sigImg = $scope.data.signaturePad.toDataURL();
                 $scope.signature = sigImg;
                }
                

               // $scope.Prescription=new Prescription({provider:$scope.data.encProvider,customer:$scope.data.encCustomer,isTyped:!$scope.data.handWritePrescription,prescriptionText:$scope.data.prescriptionData,imageUrl:$scope.signature}); 

                $scope.Prescription.isTyped=!$scope.data.handWritePrescription;
                $scope.Prescription.imageUrl=$scope.signature;
                if( $scope.Prescription.id==null ||  $scope.Prescription.id==undefined ||  $scope.Prescription.id=='')
                {
                    $scope.Prescription.$save().then(function (hi) 
                    {
                        // $scope.Prescription=hi;
                        $scope.Prescription.id = hi.Id;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription Saved',
                                template: 'Prescription is Saved'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');
                                $scope.data.showPrescription = !$scope.data.showPrescription;

                                $scope.data.Prescriptiontext="Open Prescription"; 
                            });
                        
                    }, function (error){
                            $scope.Prescription=undefined;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription not Saved',
                                template: 'Prescription could not be Saved. Please contact Support if this problem persists'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');                           
                            });

                    });
                }
                else
                {
                    $scope.Prescription.$update({id:$scope.Prescription.id}).then(function (hi) 
                    {
                        
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription Saved',
                                template: 'Prescription is Saved'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');
                                $scope.data.showPrescription = !$scope.data.showPrescription;

                                $scope.data.Prescriptiontext="Open Prescription"; 
                            });
                        
                    }, function (error){
                            $scope.Prescription=undefined;
                        var alertPopup = $ionicPopup.alert({
                                title: 'Prescription not Saved',
                                template: 'Prescription could not be Saved. Please contact Support if this problem persists'
                            });

                            alertPopup.then(function(res) {
                                console.log('Trying to Get the Patient');                           
                            });

                    });

                }

                }

            

            
           
       }
                

       $scope.togglePrescriptionMode= function(){
                   if($scope.data.handWritePrescription)
                 {
                     if( $scope.data.canvas ==null || $scope.data.canvas ==undefined){
                        $scope.data.canvas = document.getElementById('prescriptionCanvas');   
                        $scope.data.signaturePad = new SignaturePad( $scope.data.canvas );                  
                     } 
                     
                    
                 }

       }
       $scope.initiateVideoCall = function (webRTCClient) {
             initializeDataforNewEncounter();
             initializeDataforNewPrescription();
             Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {

                 $scope.Prescription.provider = info;
                 if (($rootScope.apiRTCProviderSessionID != "" && $rootScope.apiRTCProviderSessionID != undefined)) {


                     VideoCall.get({ id: $rootScope.apiRTCProviderSessionID }).$promise
                        .then(
                             function (data) {


                                 if (data.sessionID) {
                                     var confirmPopup = $ionicPopup.confirm({
                                         title: 'Patient Information',
                                         template: data.name,
                                         okText: 'Ok'
                                     });

                                     confirmPopup.then(function (res) {

                                         if (res) {

                                             $scope.data.sessionId = data.sessionID;
                                             $scope.Prescription.customer = data.subscriber;
                                             setTimeout(refreshVideoView, 4000);
                                             webRTCClient.call(data.sessionID);
                                             $('#myMiniVideo').show();
                                             $scope.Publishername = data.name;
                                             $scope.data.EncounterRequestID = data.Id;
                                             $scope.buttonDisabled = true;
                                             $scope.callAtTimeout = function () {
                                                 console.log("$scope.callAtTimeout - Timeout occurred");
                                                 if ($scope.streamconnected == false) {
                                                     $scope.buttonDisabled = false;
                                                     alert("Patient is unable to connect right now");
                                                 }
                                             }
                                             $timeout($scope.callAtTimeout, 10000);
                                             $scope.streamconnected = false;


                                         }
                                     })
                                 }
                                 else {
                                     alert("This Patient is no longer available.")

                                 }

                             }

                             ), function (error) {
                                 $ionicLoading.hide();
                                 if (error.data == null) {
                                     $ionicPopup.alert({
                                         title: applicationConfig.errorPopupTitle,
                                         templateUrl: 'templates/error-appserverunavailable.html'
                                     })
                                   .then(function (res) {
                                       $state.go('security');
                                       return true;

                                   });

                                 }
                                 else {
                                     $ionicPopup.alert({
                                         title: applicationConfig.errorPopupTitle,
                                         templateUrl: 'templates/error-application.html'
                                     })
                                   .then(function (res) {
                                       return true;
                                   });
                                 }
                                 console.log(error);
                             }

                 }
             });//end of account get
        }

         //start apirtc
                                       function refreshVideoView() {
                                            if ((typeof device !== "undefined") && device.platform == 'iOS'){
                                                console.log("REFRESH");
                                                cordova.plugins.iosrtc.refreshVideos();
                                            }
                                        }

                                        function incomingCallHandler(e) {
                                            $("#call").hide();
                                            $("#number").hide();
                                            $("#hangup").show();
                                            $('#status').hide();
                                            setTimeout(refreshVideoView,2000);
                                        }

                                        function hangupHandler(e) {
                                            $("#call").show();
                                            $("#number").show();
                                            $("#hangup").hide();
                                            $('#status').html(e.detail.reason);
                                            $('#status').show();
                                            $ionicPopup.alert({
                                                title: 'Patient Hung Up!',
                                                template: 'Your Patient Hung Up. Select another patient from the Queue'
                                            })
                                            .then(function (res) {
                                                $('#hangup').trigger('click');
                                                return true;

                                            });
                                        }

                                        function userMediaErrorHandler(e) {
                                            $("#call").show();
                                            $("#number").show();
                                            $("#hangup").hide();
                                        }

                                        function remoteStreamAddedHandler(e) {
                                            $("#doctor-wait").hide();
                                            $scope.streamconnected = true;
                                           

                                              //  $scope.data.streamId = opentok.subscriber.streamId;
                                                $scope.data.isEncounterPopupActive = true;
                                                var confirmPopup = $ionicPopup.confirm({
                                                    title: 'Confirm Encounter',
                                                    template: 'Do you want to talk with this patient?',
                                                    cancelText: 'No',
                                                    okText: 'Yes'
                                                });

                                                confirmPopup.then(function (res) {
                                                    $scope.data.isEncounterPopupActive = false;
                                                    if (res) {

                                                        var confirmPopup2 = $ionicPopup.confirm({
                                                            title: 'Confirm Pay Encounter',
                                                            template: 'Do you want charge this patient?',
                                                            cancelText: 'No',
                                                            okText: 'Yes'
                                                        });

                                                        confirmPopup2.then(function (res) {
                                                            if (res) {
                                                                $ionicLoading.show({
                                                                    template: 'Processing Payment...'
                                                                });
                                                               


                                                                    var flatfees = parseFloat($scope.Prescription.provider.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
                                                                    var fees = parseFloat((($scope.Prescription.provider.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
                                                                    $scope.Prescription.provider.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
                                                                    var totalfees = parseFloat($scope.Prescription.provider.PlatformFeePerRide) + parseFloat($scope.Prescription.provider.CostPerRide);
                                                                    $scope.Prescription.provider.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
                                                                    // $scope.data.encProvider=info;
                                                                  //  ide = angular.fromJson(opentok.subscriber.stream.connection.data).userID;
                                                                       //  $scope.Prescription.customer = data;
                                                                    $scope.Encounter = new Encounter({ Provider: $scope.Prescription.provider, Subscriber: $scope.Prescription.customer/*,isUsageCommitted:true change TODO,PaymentId:null,PaymentAmount:null,PaymentStatus: null*/, EncounterStartTime: new Date() });
                                                                    $scope.CustomerEncounterPayment = new CustomerEncounterPayment({ CostPerRide: $scope.Encounter.Provider.CostPerRide, TotalCostPerRide: $scope.Encounter.Provider.TotalCostPerRide, PaymentDate: new Date(), Encounter: $scope.Encounter })
                                                                        $scope.CustomerEncounterPayment.$update({ id: '1234' }).then(function (customerEncounterPayment) {
                                                                            $scope.Encounter=customerEncounterPayment.Encounter;
                                                                            $ionicLoading.hide();
                                                                            var alertPopup = $ionicPopup.alert({
                                                                                title: 'Payment Processing Succeeded',
                                                                                template: 'Payment is processed succeessfully. Please proceed with the encounter'
                                                                            });

                                                                            alertPopup.then(function (res) {
                                                                                console.log('Payment is processed succeessfully.');
                                                                            });


                                                                        }, function (error) {
                                                                            $ionicLoading.hide();
                                                                            var alertPopup = $ionicPopup.alert({
                                                                                title: 'Payment Processing Failed',
                                                                                template: 'Payment processing failed. Please end the encounter'
                                                                            });

                                                                            alertPopup.then(function (res) {
                                                                                console.log('Payment is processed Failed.');
                                                                            });

                                                                        });

                                                                    
                                                                
                                                            }
                                                            else {
                                                                
                                                                  
                                                                  //  ide = angular.fromJson(opentok.subscriber.stream.connection.data).userID;
                                                                    
                                                                   
                                                                        $scope.Encounter = new Encounter({ Provider: $scope.Prescription.provider, Subscriber: $scope.Prescription.customer/*,isUsageCommitted:true change TODO,PaymentId:null,PaymentAmount:null,PaymentStatus: null*/, EncounterStartTime: new Date() });
                                                                        $scope.Encounter.$save().then(function (hi) {
                                                                            $scope.Encounter = hi;
                                                                        });
                                                                   
                                                               
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        if ($scope.data.EncounterRequestID != undefined)
                                                            VideoCall.GetStatusUpdate({ subscriberID: $scope.data.EncounterRequestID, p1: "a", p2: "p2", p3: "p3" }).$promise.then(function (info) {

                                                            });
                                                         $state.go('tab.provider.videoSessions', {});


                                                    }
                                                });
                                            //end of PAyment processing



                                            refreshVideoView();
                                            
                                        }

                                       $scope.sessionReadyHandler = function (e) {
                                           
                                            apiRTC.addEventListener("incomingCall", incomingCallHandler);
                                            apiRTC.addEventListener("userMediaError", userMediaErrorHandler);
                                            apiRTC.addEventListener("remoteStreamAdded", remoteStreamAddedHandler);
                                            apiRTC.addEventListener("hangup", hangupHandler);

                                           

                                            var webRTCClient = apiCC.session.createWebRTCClient({
                                                minilocalVideo : "myMiniVideo",
                                                remoteVideo : "myRemoteVideo"
                                            });
                                            $scope.webRTCClient = webRTCClient;
                                            $scope.initiateVideoCall(webRTCClient);
                                          //  webRTCClient.setAllowMultipleCalls(true);
                                            console.log(apiCC.session.apiCCId);
                                            
                                          
                                            $('#localNumber').html("Your local ID :<BR/>"+apiCC.session.apiCCId);
                                            $('#myMiniVideo').show();
                                            $('#status').hide();

                                            $("#call").click(function () {
                                                $("#call").hide();
                                                $("#number").hide();
                                                $("#hangup").show();
                                                $('#status').hide();

                                                destNumber = $("#number").val();
                                                console.log("send REFRESH");
                                                setTimeout(refreshVideoView,4000);
                                                webRTCClient.call(destNumber);
                                            });

                                            $("#hangup").click(function () {
                                                $("#call").show();
                                                $("#number").show();
                                                $("#hangup").hide();
                                                try{
                                                    webRTCClient.hangUp();
                                                    apiRTC.disconnect();
                                                }
                                                catch(e)
                                                {
                                                    console.log('could not hang up-' + e);
                                                }
                                                console.log('EncounterRequestID-' + $scope.data.EncounterRequestID);
                                                if ($scope.data.EncounterRequestID != undefined)
                                                    VideoCall.GetStatusUpdate({ subscriberID: $scope.data.EncounterRequestID, p1: "a", p2: "p2", p3: "p3" }).$promise.then(function (info) {

                                                    });
                                                $state.go('tab.provider.videoSessions', {});


                                            });
                                        }

                                        function onDeviceReady() {
                                           

                                            if ((typeof device !== "undefined") && device.platform == 'iOS'){
                                                cordova.plugins.iosrtc.registerGlobals();
                                            }


                                            if ((typeof device !== "undefined") && device.platform == 'Android'){
                                                var permissions = cordova.plugins.permissions;
                                                permissions.hasPermission(permissions.CAMERA, checkVideoPermissionCallback, null);
                                                permissions.hasPermission(permissions.RECORD_AUDIO, checkAudioPermissionCallback, null);

                                                function checkVideoPermissionCallback(status) {
                                                    if(!status.hasPermission) {
                                                        var errorCallback = function() {
                                                            alert('Camera permission is not turned on');
                                                        }
                                                        permissions.requestPermission(
                                                                permissions.CAMERA,
                                                                function(status) {
                                                                    if(!status.hasPermission) {
                                                                        errorCallback();
                                                                    }
                                                                },
                                                                errorCallback);
                                                    }
                                                }

                                                function checkAudioPermissionCallback(status) {
                                                    if(!status.hasPermission) {
                                                        var errorCallback = function() {
                                                            alert('Audio permission is not turned on');
                                                        }
                                                        permissions.requestPermission(
                                                                permissions.RECORD_AUDIO,
                                                                function(status) {
                                                                    if(!status.hasPermission) {
                                                                        errorCallback();
                                                                    }
                                                                },
                                                                errorCallback);
                                                    }
                                                }
                                            }
                                          if( apiCC.session) apiRTC.disconnect();
                                         
                                           apiRTC.init({
                                                apiCCId :  Math.floor((Math.random() * 10000) + 1),//localStorage.getItem("username").replace(/^(\+)/,""), // Your can overide your number
                                                onReady: $scope.sessionReadyHandler,
                                                apiKey : "myDemoApiKey"
                                            });
                                         

                                        }
                                       // if($rootScope.FiredOnce==false)
                                       

                     //end apirtc
        
                     var refreshData = function () {

                             $scope.buttonDisabled=false;
                             onDeviceReady();
                           //  $scope.initiateVideoCall();
                     }

                   var hangup = function () {
                         //if ($scope.data.EncounterRequestID != undefined)
                         //    VideoCall.GetStatusUpdate({ subscriberID: $scope.data.EncounterRequestID, p1: "a", p2: "p2", p3: "p3" }).$promise.then(function (info) {

                         //    });
                         //// Your logic here. On page redirect
                         //if ($scope.webRTCClient) {
                         //    try{
                         //        $scope.webRTCClient.hangUp();
                         //    }
                         //    catch (e) {
                         //        console.log(e);
                         //    }
                         //    apiRTC.disconnect();

                         //}
                         $state.go('tab.provider.videoSessions', {});

                     }


        refreshData();
             
     
       
         
       
        
       

  



  }//end of else - If No Connection

})
.controller('ProviderDetailsCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading,  Account,VideoCall, Appointment,CustomerPaymentMethod,ConnectivityMonitor, applicationConfig) {



    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {

           
          $scope.data = {
           providerId: $stateParams.providerId,
           appointmentDate: new Date($stateParams.appointmentDate).toDateString(),
           mode:'search',
           AppointmentType:'video',
           AppointmentAction:'video'
           
           
        };

        $scope.Appointments=[];
        $scope.datepickerObject = {
                titleLabel: 'Appointment Date',  //Optional            
                inputDate: new Date($scope.data.appointmentDate),  //Optional           
                callback: function (val) {  //Mandatory
                    //datePickerCallback(val);
                    if (val != undefined && val != null) {
                        $scope.data.appointmentDate = new Date(val).toDateString();
                        $scope.datepickerObject.inputDate = val;
                        if($scope.Provider !== undefined){
                              $scope.loadEvents();
                        }
                        
                    }

                }

            };
       
      $scope.bookAppointment = function (item,appointmentType){
            
          console.log('your Appointment Type is ' + appointmentType);
          
         
          $scope.Appointment = new Appointment({
                Id: item.Id,
                Provider:item.Provider,
                Subscriber:item.Subscriber,
                startTime: item.startTime,
                endTime:item.endTime,
                AppointmentType: appointmentType,
                AppointmentStatus:'Booked',
                startDisplayTime:item.startDisplayTime,
                endDisplayTime:item.endDisplayTime,
                title: item.Provider.LastName + '/' + item.Subscriber.LastName

            });
          
           $ionicLoading.show({
                template: 'Booking  your Appointment...'
            });
            if(item.Id==undefined || item.Id ==='' || item.Id==null){
                $scope.Appointment.$save().then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Booked!',
                    template: 'Your new appointment is booked.Please note that a valid credit card is required before you start a video encounter'
                });
                alertPopup.then(function (res) {
                   // console.log(carpool);
                    $scope.loadEvents();

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Error!',
                    template: 'Your new Appointment could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    //console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                   // $state.go('tab.dash');

                });

            });
            }
            else
            {
                $scope.Appointment.$update({id:item.Id}).then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Booked!',
                    template: 'Your new appointment is booked.Please note that a valid credit card is required before you start a video encounter'
                });
                alertPopup.then(function (res) {
                   // console.log(carpool);
                    $scope.loadEvents();

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Error!',
                    template: 'Your new Appointment could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    //console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                   // $state.go('tab.dash');

                });

            });

            }

            

        } //-end of book appointment
               
         

          
        
         $scope.initiateCallorCancelAppointment=function (item,appointmentAction){
             if(appointmentAction!=undefined && appointmentAction!='video'){
                  $scope.Appointment = new Appointment({
                        Id: item.Id,
                        Provider:item.Provider,
                        Subscriber:item.Subscriber,
                        startTime: item.startTime,
                        endTime:item.endTime,                     
                        AppointmentStatus:'Cancelled',
                        startDisplayTime:item.startDisplayTime,
                        endDisplayTime:item.endDisplayTime,
                        title: item.Provider.LastName + '/' + item.Subscriber.LastName

                    });
          
                   $ionicLoading.show({
                        template: 'Cancelling  your Appointment...'
                    });

                    $scope.Appointment.$update({id:item.Id}).then(function (info) {
                    $ionicLoading.hide();
                    //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                    var alertPopup = $ionicPopup.alert({
                        title: 'Appointment Cancelled',
                        template: 'You  appointment is Cancelled.'
                    });
                    alertPopup.then(function (res) {
                       // console.log(carpool);
                        $scope.loadEvents();

                    });

                }, function (error) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Appointment Error!',
                        template: 'Your new Appointment could not be Cancelled! Please contact Support.' + error
                    });
                    alertPopup.then(function (res) {
                        //console.log(carpool);
                        //$state.go($ionicHistory.backView().stateName);
                       // $state.go('tab.dash');

                    });

                });


            }
             else if(appointmentAction!=undefined && appointmentAction=='video'){
                $scope.initiateCall('Appointment');

            }


        }
         

       

         $scope.loadEvents = function () {
           // $scope.calendar.eventSource = createRandomEvents();
           Appointment.GetAppointmentsByProviderAndDate({providerId:$stateParams.providerId, subscriberId:localStorage.getItem("customerid"),appointmentDate:$scope.data.appointmentDate,isProvider:'false'}).$promise.then(function (data){
                        
                       // for(i=0;i<data.length;i++){
                         //   var milliseconds = Date.parse( data[i].startTime)
                            // if (!isNaN(milliseconds)) {
                            //     data[i].startTime = new Date(milliseconds);
                            // }
                            //  milliseconds = Date.parse( data[i].endTime)
                            // if (!isNaN(milliseconds)) {
                            //     data[i].endTime = new Date(milliseconds);
                            // }
                         //   data[i].startTime = new Date( data[i].startTime);
                          //  data[i].endTime = new Date( data[i].endTime);
                       // }
                        $scope.Appointments =data;
                        
                        
                    })
        };
        
        var refreshData = function () {
        //    initiateVideoCall();
                Account.get({ id: $stateParams.providerId}).$promise.then(function (info) {
                    $scope.Provider = info;
                     $scope.loadEvents()
                });
        }
        
        
        refreshData();
        $scope.initiateCall = function (typeOE){
            if($scope.Provider.TotalCostPerRide>0){
             CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined)) {
                    
                     //   initiateVideoCall();
                     //videochatsubscriberNew
                      $state.go('tab.search.videochatsubscriberNew', { "id": $stateParams.providerId,"displayname":$scope.Provider.FirstName + ' ' + $scope.Provider.LastName,"type":typeOE });


                }
                else {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can request a ride. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }, function (error) {
            });
            }
            else
            {
            // initiateVideoCall();
            $state.go('tab.search.videochatsubscriberNew', { "id": $stateParams.providerId,"displayname":$scope.Provider.FirstName + ' ' + $scope.Provider.LastName,"type":typeOE });


            }
       
        }
       
        
       

    }//end of else - If No Connection

})

.controller('ProviderAppointmentsCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading,$ionicModal,$ionicSlideBoxDelegate,  Account,VideoCall, Appointment,ConnectivityMonitor, applicationConfig) {
     

      $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function () {
          $ionicSlideBoxDelegate.previous();
       };

    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {

       var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();


          $scope.data = {
           providerId: $stateParams.providerId,
           appointmentDate: new Date(yyyy, mm, dd).toDateString()   ,
           mode:'search',
           AppointmentType:'video',
           AppointmentAction:'video',
           subscriber:undefined,
           subscribers:[],
           searchTerm:''
           
           
        };

         $scope.Appointments=[];
         $scope.datepickerObject = {
                titleLabel: 'Appointment Date',  //Optional            
                inputDate: new Date($scope.data.appointmentDate),  //Optional           
                callback: function (val) {  //Mandatory
                    //datePickerCallback(val);
                    if (val != undefined && val != null) {
                        $scope.data.appointmentDate = new Date(val).toDateString();
                        $scope.datepickerObject.inputDate = val;
                        if($scope.Provider !== undefined){
                              $scope.loadEvents();
                        }
                        
                    }

                }

            };

             $ionicModal.fromTemplateUrl('./templates/tab-providerAppointments-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal
            }, function (error) {
                console.log(error);
            })
        
          
            $scope.searchSubscriber=function(){
                if($scope.data.searchTerm.length>0){
                $scope.data.subscriber=undefined;
                Appointment.GetSubsribers({searchTerm:$scope.data.searchTerm,isProvider:'true'}).$promise.then( function(data){
                    $scope.data.subscribers= data;

                }, function(err){

                }

                )
            }
            }

       
            $scope.bookAppointment = function (item){
            $scope.data.selectedItem = item;
             $scope.modal.show();
            }
            
        $scope.saveAppointment = function(result) {
            console.log('your Appointment Type is ' + result);
            if(result!=undefined){
         
          $scope.Appointment = new Appointment({
                Id:  $scope.data.selectedItem.Id,
                Provider: $scope.data.selectedItem.Provider,
                Subscriber:$scope.data.subscriber,
                startTime:  $scope.data.selectedItem.startTime,
                endTime: $scope.data.selectedItem.endTime,
                AppointmentType:result,
                AppointmentStatus:'Booked',
                startDisplayTime: $scope.data.selectedItem.startDisplayTime,
                endDisplayTime: $scope.data.selectedItem.endDisplayTime,
                title:  $scope.data.selectedItem.Provider.LastName + '/' + $scope.data.subscriber.LastName

            });
          
           $ionicLoading.show({
                template: 'Booking  your Appointment...'
            });
            if($scope.data.selectedItem.Id==undefined || $scope.data.selectedItem.Id ==='' || $scope.data.selectedItem.Id==null){
                $scope.Appointment.$save().then(function (info) {
                $scope.data.searchTerm ='';
                $scope.data.subscriber = undefined;
                $scope.data.subscribers=[];
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Booked!',
                    template: 'Your new appointment is booked.Please note that a valid credit card is required before you start a video encounter'
                });
                alertPopup.then(function (res) {
                   // console.log(carpool);
                    $scope.loadEvents();   
                    if($ionicSlideBoxDelegate.currentIndex()==2)             
                    $scope.previous();

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Error!',
                    template: 'Your new Appointment could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    //console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                   // $state.go('tab.dash');

                });

            });
            }
            else
            {
                $scope.Appointment.$update({id:$scope.data.selectedItem.Id}).then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Booked!',
                    template: 'Your new appointment is booked.Please note that a valid credit card is required before you start a video encounter'
                });
                alertPopup.then(function (res) {
                   // console.log(carpool);
                    $scope.loadEvents();
                     if($ionicSlideBoxDelegate.currentIndex()==2)   
                      $scope.previous();

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Error!',
                    template: 'Your new Appointment could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    //console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                   // $state.go('tab.dash');

                });

            });

            }
                $scope.modal.hide()

            }

        }
        $scope.ManageAppointment = function (item){
             if(item.AppointmentStatus=='Booked'){
                 $scope.initiateCallorCancelAppointment(item);
             }
             else{
                 $scope.bookAppointment(item);
             }
         }

         $scope.initiateCallorCancelAppointment=function (item){
                   var popup = $ionicPopup.show({
            'templateUrl': 'templates/appointmentActions.html',
            'title': 'Appointment Actions',
            'subTitle': 'Please pick an Action',
            'scope': $scope,
            'buttons': [
                {
                    'text': '',
                    'type': 'button-assertive icon ion-close-round'
                },
                {
                    'text': '',
                    'type': 'button-balanced icon ion-checkmark-round',
                    'onTap': function(event) {
                        console.log($scope.data.AppointmentAction);
                        return $scope.data.AppointmentAction;
                    }
                }
            ]
        });

        popup.then(function(result) {
            console.log('your Appointment Action is ' + result);
            if(result!=undefined && result!='video'){
          $scope.Appointment = new Appointment({
                Id: item.Id,
                Provider:item.Provider,
                Subscriber:item.Subscriber,
                startTime: item.startTime,
                endTime:item.endTime,
                AppointmentType:result,
                AppointmentStatus:'Cancelled',
                startDisplayTime:item.startDisplayTime,
                endDisplayTime:item.endDisplayTime,
                title: item.Provider.LastName + '/' + item.Subscriber.LastName

            });
          
           $ionicLoading.show({
                template: 'Cancelling  your Appointment...'
            });

                $scope.Appointment.$update({id:item.Id}).then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Cancelled',
                    template: 'You  appointment is Cancelled.'
                });
                alertPopup.then(function (res) {
                   // console.log(carpool);
                    $scope.loadEvents();

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Appointment Error!',
                    template: 'Your new Appointment could not be Cancelled! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    //console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                   // $state.go('tab.dash');

                });

            });


            }
            else if(result!=undefined && result=='video'){
                $scope.initiateCall();

            }


        });
         }

         

         $scope.loadEvents = function () {
              $ionicLoading.show({
                template: 'Loading Appointments...'
            });
           // $scope.calendar.eventSource = createRandomEvents();
           Appointment.GetAppointmentsByProviderAndDate({providerId:localStorage.getItem("customerid"), subscriberId:localStorage.getItem("customerid"),appointmentDate:$scope.data.appointmentDate,isProvider:'true'}).$promise.then(function (data){
                        
                       // for(i=0;i<data.length;i++){
                         //   var milliseconds = Date.parse( data[i].startTime)
                            // if (!isNaN(milliseconds)) {
                            //     data[i].startTime = new Date(milliseconds);
                            // }
                            //  milliseconds = Date.parse( data[i].endTime)
                            // if (!isNaN(milliseconds)) {
                            //     data[i].endTime = new Date(milliseconds);
                            // }
                         //   data[i].startTime = new Date( data[i].startTime);
                          //  data[i].endTime = new Date( data[i].endTime);
                       // }
                         $ionicLoading.hide();
                        $scope.Appointments =data;
                        
                        
                    })
        };
        
        var refreshData = function () {
        //    initiateVideoCall();
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                    $scope.Provider = info;
                     $scope.loadEvents()
                });
        }
        
         var initiateVideoCall = function(){
              if (($scope.data.id != "" && $scope.data.id != undefined) ) {

                    
              
                VideoCall.get({ id: $scope.data.id}).$promise
                   .then(
                        function (data) {
                           
                            $scope.data.apiKey = data.apiKey;
                            $scope.data.sessionId = data.sessionID;
                            $scope.data.token=data.tokenID;
                            OT.setLogLevel(OT.DEBUG);
                            opentok.initializePublisher();
                            opentok.initializeSession();

                            // // Initialize Session Object
                            // var session = OT.initSession(data.apiKey, data.sessionID);
                            
                            // // Connect to the Session
                            // session.connect(data.tokenID, function (error) {

                            //     // If the connection is successful, initialize a publisher and publish to the session
                            //     if (!error) {
                            //         var publisher = OT.initPublisher('publisher');

                            //         session.publish(publisher);
                            //     } else {
                            //         console.log('There was an error connecting to the session:', error.code, error.message);
                            //     }
                            // });

                        }, function (error) {
                            $ionicLoading.hide();
                            if (error.data == null) {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-appserverunavailable.html'
                                })
                              .then(function (res) {
                                  $state.go('security');
                                  return true;

                              });

                            }
                            else {
                                $ionicPopup.alert({
                                    title: applicationConfig.errorPopupTitle,
                                    templateUrl: 'templates/error-application.html'
                                })
                              .then(function (res) {
                                  return true;
                              });

                            }
                            console.log(error);

                        }
                     );



            }
             
         }
        refreshData();
        $scope.initiateCall = function (){
            if($scope.Provider.TotalCostPerRide>0){
             CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined)) {
                    
                     //   initiateVideoCall();
                      $state.go('tab.search.videochatsubscriberNew', { "id": $stateParams.providerId,"displayname":$scope.Provider.FirstName + ' ' + $scope.Provider.LastName ,"type":'Appointment'});


                }
                else {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can request a ride. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }, function (error) {
            });
            }
            else
            {
            // initiateVideoCall();
            $state.go('tab.search.videochatsubscriberNew', { "id": $stateParams.providerId,"displayname":$scope.Provider.FirstName + ' ' + $scope.Provider.LastName,"type":'Appointment' });


            }
       
        }
       
        
       

    }//end of else - If No Connection

})




.controller('VideoChatSubscriberNewCtrl', function ($scope,$rootScope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading,  Account,VideoCall, ConnectivityMonitor, applicationConfig) 
{           
    if (ConnectivityMonitor.isOffline()) {
           $state.go('errorconnection');
    }      
    else   {
             $scope.$parent.$on('$ionicView.beforeLeave', function(){
                    if( $scope.EncounterRequestID!=undefined)
                        VideoCall.GetStatusUpdate({subscriberID:$scope.EncounterRequestID,p1:"a",p2:"p2",p3:"p3" }).$promise.then(function (info) {

                        });
                // Your logic here. On page redirect
                if(  $scope.webRTCClient){
                       
                       $scope.webRTCClient.hangUp();
                       apiRTC.disconnect();
                }
            });

             $scope.EncounterRequestID=undefined;
             $rootScope.VideoChatSubscriberNewCtrlpublisherID = $stateParams.id;
             $rootScope.VideoChatSubscriberNewCtrlType = $stateParams.type;
            // $rootScope.VideoChatSubscriberNewCtrlisWaiting = true;

                   
         //localStorage.getItem("username")
         //start apirtc
                                     function refreshVideoView() {
                                            if ((typeof device !== "undefined") && device.platform == 'iOS'){
                                                console.log("REFRESH");
                                                cordova.plugins.iosrtc.refreshVideos();
                                            }
                                     }

                                        function incomingCallHandler(e) {
                                            $("#call").hide();
                                            $("#number").hide();
                                            $("#hangup").show();
                                            $('#status').hide();
                                            setTimeout(refreshVideoView,2000);
                                        }

                                        function hangupHandler(e) {
                                            $("#call").show();
                                            $("#number").show();
                                            $("#hangup").hide();
                                            $('#status').html(e.detail.reason);
                                            $('#status').show();
                                            $ionicPopup.alert({
                                                title: 'Provider Hung Up!',
                                                template: 'Your Provider Hung Up..'
                                            })
                                            .then(function (res) {
                                                $('#hangup').trigger('click');
                                                return true;

                                            });
                                        }

                                        function userMediaErrorHandler(e) {
                                            $("#call").show();
                                            $("#number").show();
                                            $("#hangup").hide();
                                        }

                                        function remoteStreamAddedHandler(e) {
                                            $("#doctor-wait").hide();
                                         //   $rootScope.VideoChatSubscriberNewCtrlisWaiting = false;
                                            refreshVideoView();
                                            
                                        }

                                        function sessionReadyHandler(e) {
                                           
                                            apiRTC.addEventListener("incomingCall", incomingCallHandler);
                                            apiRTC.addEventListener("userMediaError", userMediaErrorHandler);
                                            apiRTC.addEventListener("remoteStreamAdded", remoteStreamAddedHandler);
                                            apiRTC.addEventListener("hangup", hangupHandler);

                                           

                                            var webRTCClient = apiCC.session.createWebRTCClient({
                                                minilocalVideo : "myMiniVideo",
                                                remoteVideo : "myRemoteVideo"
                                            });

                                            $("#call").click(function () {
                                                $("#call").hide();
                                                $("#number").hide();
                                                $("#hangup").show();
                                                $('#status').hide();

                                                destNumber = $("#number").val();
                                                console.log("send REFRESH");
                                                setTimeout(refreshVideoView, 4000);
                                                webRTCClient.call(destNumber);
                                            });

                                            $("#hangup").click(function () {
                                                $("#call").show();
                                                $("#number").show();
                                                // $("#hangup").hide(); 
                                             
                                                $("#call").show();
                                                $("#number").show();
                                                // $("#hangup").hide();

                                                console.log('EncounterRequestI-' + $scope.EncounterRequestID);
                                                try{
                                                    if (webRTCClient) webRTCClient.hangUp();
                                                    apiRTC.disconnect();

                                                } catch (e) {
                                                    console.log('Cannot HAng up ' + e);
                                                }
                                                if ($scope.EncounterRequestID != undefined)
                                                    VideoCall.GetStatusUpdate({ subscriberID: $scope.EncounterRequestID, p1: "a", p2: "p2", p3: "p3" }).$promise.then(function (info) {

                                                    });
                                                console.log('before going to search');
                                                $state.go('tab.search', {}, { reload: true });
                                                console.log('After going to search');
                                            });
                                          //  webRTCClient.setAllowMultipleCalls(true);
                                            console.log(apiCC.session.apiCCId);
                                            $('#localNumber').html("Your local ID :<BR/>"+apiCC.session.apiCCId);
                                            $('#myMiniVideo').show();
                                            $('#status').hide();
                                            VideoCall.GetVideoNew({ publisherID:$rootScope.VideoChatSubscriberNewCtrlpublisherID,subscriberID:localStorage.getItem("customerid"),role:'Subscriber',videoSessionID:apiCC.session.apiCCId,type: $rootScope.VideoChatSubscriberNewCtrlType}).$promise
                                            .then(
                                                    function (data) {
                                                        $scope.EncounterRequestID = data.Id;                                                       
                                            
                                                    }, function (error) {
                                                        $ionicLoading.hide();
                                                        if (error.data == null) {
                                                            $ionicPopup.alert({
                                                                title: applicationConfig.errorPopupTitle,
                                                                templateUrl: 'templates/error-appserverunavailable.html'
                                                            })
                                                        .then(function (res) {
                                                            $state.go('security');
                                                            return true;

                                                        });

                                                        }
                                                        else {
                                                            $ionicPopup.alert({
                                                                title: applicationConfig.errorPopupTitle,
                                                                templateUrl: 'templates/error-application.html'
                                                            })
                                                        .then(function (res) {
                                                            return true;
                                                        });

                                                        }
                                                        console.log(error);

                                                    }
                                                );



                                        }
                                          

                                           
                                        

                                        function onDeviceReady() {
                                           

                                            if ((typeof device !== "undefined") && device.platform == 'iOS'){
                                                cordova.plugins.iosrtc.registerGlobals();
                                            }


                                            if ((typeof device !== "undefined") && device.platform == 'Android'){
                                                var permissions = cordova.plugins.permissions;
                                                permissions.hasPermission(permissions.CAMERA, checkVideoPermissionCallback, null);
                                                permissions.hasPermission(permissions.RECORD_AUDIO, checkAudioPermissionCallback, null);

                                                function checkVideoPermissionCallback(status) {
                                                    if(!status.hasPermission) {
                                                        var errorCallback = function() {
                                                            alert('Camera permission is not turned on');
                                                        }
                                                        permissions.requestPermission(
                                                                permissions.CAMERA,
                                                                function(status) {
                                                                    if(!status.hasPermission) {
                                                                        errorCallback();
                                                                    }
                                                                },
                                                                errorCallback);
                                                    }
                                                }

                                                function checkAudioPermissionCallback(status) {
                                                    if(!status.hasPermission) {
                                                        var errorCallback = function() {
                                                            alert('Audio permission is not turned on');
                                                        }
                                                        permissions.requestPermission(
                                                                permissions.RECORD_AUDIO,
                                                                function(status) {
                                                                    if(!status.hasPermission) {
                                                                        errorCallback();
                                                                    }
                                                                },
                                                                errorCallback);
                                                    }
                                                }
                                            }
                                           if( apiCC.session) apiRTC.disconnect();
                                          
                                           apiRTC.init({
                                              
                                                apiCCId : Math.floor((Math.random() * 10000) + 1),//localStorage.getItem("username").replace(/^(\+)/,""), // Your can overide your number
                                                onReady: sessionReadyHandler,
                                                apiKey : "myDemoApiKey"
                                            });
                                         

                                        }
                                       // if($rootScope.FiredOnce==false)
                                        onDeviceReady();

                                   //end apirtc
        
    
           
                                        $scope.hangup = function () {
                                            if ($scope.EncounterRequestID != undefined)
                                                VideoCall.GetStatusUpdate({ subscriberID: $scope.EncounterRequestID, p1: "a", p2: "p2", p3: "p3" }).$promise.then(function (info) {

                                                });
                                            // Your logic here. On page redirect
                                            if ($scope.webRTCClient) {

                                                $scope.webRTCClient.hangUp();
                                                apiRTC.disconnect();
                                               
                                            }
                                            $state.go('tab.search', {}, { reload: true });

                                        }
                    

      
    }//end of else - If No Connection
})





.controller('CarpoolsCtrl', function ($scope, $state, $ionicActionSheet, $ionicHistory, Account, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {

        $scope.selectedType = 'NA';
        $scope.membercarpools = '';
        $scope.Customer = {};
        $scope.showInvitations = false;
        $scope.carpoolHeight = '100%';

        $scope.$on('$ionicView.beforeEnter', function () {
            // $ionicHistory.clearCache();
            // $ionicHistory.clearHistory();
            //$ionicNavBarDelegate.showBackButton(false);
            console.log($ionicHistory.viewHistory());
        });

        if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != "") {
            refreshMemberCarpools();
        }
        else {
            $state.go('tab.dash.mobilelogin');
        }

        $scope.gotonewcarpool = function () {
            $state.go('tab.newcarpool', { "customerid": localStorage.getItem("customerid") });

        }

        function refreshMemberCarpools() {
            Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
                if (data.email == null  && data.isProvider) $state.go('tab.account.emailLogin', {}, { reload: true });
                else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000")
                {

                      if(data.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true });
                        }
                        else{alert($state.go('tab.CustInfo'))}
                }
                else if (data.CustomerCarpools != null)
                    //$scope.membercarpools = data.CustomerCarpools;
                    $scope.Customer = data;
                var len = data.CustomerCarpools.filter(function (obj) {
                    return (obj.RegistrationStatus != 'Active');

                }).length;
                if (len > 0) {
                    $scope.showInvitations = true;
                    $scope.carpoolHeight = "50%";

                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );

        }
        $scope.showActionsheet = function () {

            $ionicActionSheet.show({
                titleText: 'Carpool Actions',
                buttons: [
                {
                    text: '<i class="icon ion-share"></i> Find & Subscribe'
                },
                {
                    text: '<i class="icon ion-arrow-move"></i> Create a New Carpool'
                },
                ],

                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },

                buttonClicked: function (index) {
                    switch (index) {
                        case 0:;
                        case 1: {
                            $state.go('tab.newcarpool', { "customerid": localStorage.getItem("customerid") });
                        }
                    }
                    console.log('BUTTON CLICKED', index);
                    return true;

                },

            });
        };

    }

})
.controller('NewCarpoolSlideCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory, $ionicModal, Account, Contacts, ContactsService, BillingFrequencies, Carpool, Geo, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $ionicLoading.show({
            template: 'loading'
        })
        Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
            $scope.customer = data;

            $scope.carpool = new Carpool({
                Type: 'carPool', //required for preselecting
                Name: data.FirstName == undefined ? localStorage.getItem("username") : data.FirstName + ' Carpool',
                CoordinatorName: data.FirstName,
                Capacity: 5,
                Distance: data.Distance,
                CostPerRide: data.CostPerRide,
                PlatformFeePerRide: data.PlatformFeePerRide,
                TotalCostPerRide: data.TotalCostPerRide,
                TrackReturnRidesSeparately: false,
                FixedCost: '',
                DriverCredit: '',
                ApproximateFuelCosts: 0.0,
                BillingStartDate: '',
                BillingFrequency: 'Monthly',
                StartAddress: data.HomeLocation == undefined ? '' : data.HomeLocation,
                EndAddress: data.EndLocation == undefined ? '' : data.EndLocation,

                WorkboundDepartureTime: data.CustomerSchedule == undefined || data.CustomerSchedule.WorkboundDepartureTime == undefined ? 27000 : data.CustomerSchedule.WorkboundDepartureTime,
                WorkboundArrivalTime: data.CustomerSchedule == undefined || data.CustomerSchedule.WorkboundArrivalTime == undefined ? 30600 : data.CustomerSchedule.WorkboundArrivalTime,
                HomeboundDepartureTime: data.CustomerSchedule == undefined || data.CustomerSchedule.HomeboundDepartureTime == undefined ? 63000 : data.CustomerSchedule.HomeboundDepartureTime,
                HomeboundArrivalTime: data.CustomerSchedule == undefined || data.CustomerSchedule.HomeboundArrivalTime == undefined ? 66600 : data.CustomerSchedule.HomeboundArrivalTime,
                Sunday: data.CustomerSchedule == undefined || data.CustomerSchedule.Sunday == undefined ? false : data.CustomerSchedule.Sunday,
                Monday: data.CustomerSchedule == undefined || data.CustomerSchedule.Monday == undefined ? true : data.CustomerSchedule.Monday,
                Tuesday: data.CustomerSchedule == undefined || data.CustomerSchedule.Tuesday == undefined ? true : data.CustomerSchedule.Tuesday,
                Wednesday: data.CustomerSchedule == undefined || data.CustomerSchedule.Wednesday == undefined ? true : data.CustomerSchedule.Wednesday,
                Thursday: data.CustomerSchedule == undefined || data.CustomerSchedule.Thursday == undefined ? true : data.CustomerSchedule.Thursday,
                Friday: data.CustomerSchedule == undefined || data.CustomerSchedule.Friday == undefined ? true : data.CustomerSchedule.Friday,
                Saturday: data.CustomerSchedule == undefined || data.CustomerSchedule.Saturday == undefined ? false : data.CustomerSchedule.Saturday,
                CarpoolMembers: data.Contacts == undefined ? [] : data.Contacts


            });
            for (var i in $scope.carpool.CarpoolMembers) {
                $scope.carpool.CarpoolMembers[i].isSaved = false;
            }
            $scope.calculateFees();
            $scope.slotsWorkboundDepartrure.inputEpochTime = $scope.carpool.WorkboundDepartureTime;
            $scope.slotsWorkboundArrival.inputEpochTime = $scope.carpool.WorkboundArrivalTime;
            $scope.slotsHomeboundDepartrure.inputEpochTime = $scope.carpool.HomeboundDepartureTime;
            $scope.slotsHomeboundArrival.inputEpochTime = $scope.carpool.HomeboundArrivalTime;




            addSignedInUserAsMember();
            $ionicLoading.hide()
        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }


        );

        $scope.slotsWorkboundDepartrure = {
            inputEpochTime: 27000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsWorkboundDepartrure.inputEpochTime : val;
                $scope.carpool.WorkboundDepartureTime = $scope.slotsWorkboundDepartrure.inputEpochTime;

            }
        };
        $scope.slotsWorkboundArrival = {
            inputEpochTime: 30600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundArrival.inputEpochTime = val == undefined ? $scope.slotsWorkboundArrival.inputEpochTime : val;
                $scope.carpool.WorkboundArrivalTime = $scope.slotsWorkboundArrival.inputEpochTime;

            }
        };

        $scope.slotsHomeboundDepartrure = {
            inputEpochTime: 63000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsHomeboundDepartrure.inputEpochTime : val;
                $scope.carpool.HomeboundDepartureTime = $scope.slotsHomeboundDepartrure.inputEpochTime;

            }
        };

        $scope.slotsHomeboundArrival = {
            inputEpochTime: 66600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundArrival.inputEpochTime = val == undefined ? $scope.slotsHomeboundArrival.inputEpochTime : val;
                $scope.carpool.HomeboundArrivalTime = $scope.slotsHomeboundArrival.inputEpochTime;

            }
        };



        $scope.selectedType = 'NA';
        $scope.membercarpools = '';
        $ionicModal.fromTemplateUrl('./templates/newCarpool/contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })

        $scope.openModal = function () {
            $scope.modal.show()
        }

        $scope.closeModal = function () {
            // $scope.data.contacts.push(contact);
            //if ($scope.contact.MobileNumber.charAt(0) === '+') {
            //    //Mobile Number is manually entered
            //    $scope.contact.MobileNumber = $scope.contact.MobileNumber.substr(1);
            //    $scope.contact.MobileExists = true;
            //}
            //if ($scope.contact.MobileNumber.length == 10) {
            //    //Add Default Country code 1
            //    $scope.contact.MobileNumber = '1'+$scope.contact.MobileNumber;
            //    $scope.contact.MobileExists = true;
            //}

            if ($scope.contact.isSaved == false) {
                var index = $scope.carpool.CarpoolMembers.indexOf($scope.contact); // Change to filter by DisplayNAme +mobileNumber only.

                if (index < 0) {
                    if ($scope.contact.MobileExists || ($scope.contact.MobileNumber != undefined && $scope.contact.MobileNumber != '')) {
                        $scope.carpool.CarpoolMembers.push($scope.contact);
                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Mobile Number is Required!',
                            template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
                        });

                    }
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Selected Contact is already a member!',
                        template: 'Changes Saved. If you wish to un-enroll this contact from the carpool, please remove from the members list'
                    });

                }
            }

            $scope.modal.hide();
        };

        $scope.editContact = function (contact) {
            $scope.contact = contact;
            $scope.openModal();
        }

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });



        $scope.data = {
            numViewableSlides: 0,
            slideIndex: 0,
            slides: [
            {
                'template': './templates/newCarpool/carpool-name-type.html',
                'viewable': false
            },

             {
                 'template': './templates/newCarpool/carpool-cost.html',
                 'viewable': true
             },
             {
                 'template': './templates/newCarpool/carpool-address.html',
                 'viewable': true
             },
              {
                  'template': './templates/newCarpool/carpool-schedule-time.html',
                  'viewable': true
              },
               {
                   'template': './templates/newCarpool/carpool-schedule-dow.html',
                   'viewable': true
               },
             {
                 'template': './templates/newCarpool/carpool-billing.html',
                 'viewable': false
             },

            {
                'template': './templates/newCarpool/carpool-membersinvite.html',
                'viewable': true
            }
            ],
            contacts: [],
            members: [],
            billingFrequencies: [],
            newContactDisplayName: '',
            newContactMobileNumber: '',
            ContactSearchStr: '',
            showDelete: false
        };
        var countSlides = function () {
            $scope.data.numViewableSlides = 0;

            angular.forEach($scope.data.slides, function (slide) {
                if (slide.viewable == true) $scope.data.numViewableSlides++;
            })

            console.log($scope.data.numViewableSlides + " viewable slides");

        }

        countSlides();
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };
        // Called each time the slide changes
        $scope.slideChanged = function (index) {

            $scope.data.slideIndex = index;

        };

        var billingFrequecies = function () {
            $scope.data.billingFrequencies = BillingFrequencies.fetch();
        }
        billingFrequecies();


        $scope.updateChoice = function (str) {
            $scope.selectedType = str;
            // $scope.data.contacts = Contacts.fetch('sanjeev');
        }


        var addSignedInUserAsMember = function () {
            var displayName = '';
            displayName = $scope.customer.FirstName == undefined || $scope.customer.FirstName == null ? displayName : $scope.customer.FirstName;
            displayName = $scope.customer.LastName == undefined || $scope.customer.LastName == null ? displayName : displayName + ' ' + $scope.customer.LastName;
            if (displayName == '') displayName = 'Me';
            var member = { DisplayName: displayName, MobileNumber: localStorage.getItem("username"), MobileExists: true, isMember: false, isCoordinator: true, isSaved: false, RegistrationStatus: 'Open' };
            $scope.carpool.CarpoolMembers.push(member);

        }


        $scope.carpoolSave = function (carpool) {



            if ($scope.carpool.StartAddress != undefined) {
                try {
                    //  $scope.carpool.StartAddress.geometry.location.lat = $scope.carpool.StartAddress.geometry.location.lat();
                    //  $scope.carpool.StartAddress.geometry.location.lng = $scope.carpool.StartAddress.geometry.location.lng();
                }
                catch (e) {
                    console.log('Start Address not defined/Changed');
                }
            }
            if ($scope.carpool.EndAddress != undefined) {
                try {
                    //   $scope.carpool.EndAddress.geometry.location.lat = $scope.carpool.EndAddress.geometry.location.lat();
                    //   $scope.carpool.EndAddress.geometry.location.lng = $scope.carpool.EndAddress.geometry.location.lng();
                }
                catch (e) {
                    console.log('End Address not defined/Changed');

                }
            }
            console.log($scope.carpool);
            $ionicLoading.show({
                template: 'Updating your Carpool...'
            });
            $scope.carpool.$save().then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Carpool Updated!',
                    template: 'You new Carpool is Updated! SMS messages will be sent to new members for confirmation.'
                });
                alertPopup.then(function (res) {
                    console.log(carpool);
                    // $scope.carpool.CarpoolMembers = [];
                    // $scope.data.contacts = [];
                    // $state.go($ionicHistory.backView().stateName);
                    $state.go('tab.dash');

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Carpool Error!',
                    template: 'You new Carpool could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);
                    $state.go('tab.dash');

                });

            });



        }


        $scope.onMemberDelete = function (member) {

            if (member.isCoordinator) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Co-ordinator cannot be removed!',
                    template: 'Carpool coordinator cannot be removed from the members list!'
                });
            }

            else if (member.isSaved) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Member will be Terminated',
                    template: 'Are you sure you want to terminate this member? Termination cannot be undone.Press OK to confirm'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                        // Call Deactivate service
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

            else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Member will be Removed',
                    template: 'Are you sure you want to remove this member? Press OK to confirm.'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        var index = $scope.carpool.CarpoolMembers.indexOf(member);
                        if (index >= 0)
                            $scope.carpool.CarpoolMembers.splice(index, 1);

                        index = $scope.data.contacts.indexOf(member);
                        if (index >= 0)
                            $scope.data.contacts[index].isMember = false;
                        console.log('You are sure');
                        // Call Deactivate service
                    } else {
                        console.log('You are not sure');
                    }
                });

            }


        }


        $scope.pickContact = function () {

            ContactsService.pickContact().then(
                function (con) {

                    var contact = {};
                    console.log('In  Contact');

                    console.log('DisplayName-' + con.displayName);
                    contact.DisplayName = con.displayName;
                    contact.DisplayName = contact.DisplayName.replace("undefined", "");

                    contact.MobileExists = false;
                    if (con.emails != null && con.emails.length > 0)
                        contact.Email = con.emails[0].value;

                    if (con.photos != null && con.photos.length > 0)
                        contact.Photo = con.photos[0].value;
                    contact.isSaved = false;
                    if ((con.phones != null && con.phones.length > 0)) {
                        contact.Phone = con.phones[0].value;
                        angular.forEach(con.phones, function (pn) {
                            console.log('In  Phone');
                            if (pn.type == 'mobile') {
                                console.log('Found Mobile');
                                contact.MobileExists = true;
                                contact.MobileNumber = pn.value;
                                if (pn.pref == true) return false;//similar to continue
                            }
                        })
                    }
                    if (contact.MobileExists) {
                        // convert to international format
                        // if (contact.MobileNumber.length == 10) contact.MobileNumber = '1' + contact.MobileNumber;
                        contact.MobileNumber = intlTelInputUtils.formatNumberByType(contact.MobileNumber, "US");
                    }
                    // $scope.data.contacts.push(contact);
                    $scope.contact = contact;
                    $scope.openModal();
                    //var index = $scope.carpool.CarpoolMembers.indexOf(contact); // Change to filter by DisplayNAme +mobileNumber only.

                    //if (index < 0) {
                    //    if (contact.MobileExists) {
                    //        $scope.carpool.CarpoolMembers.push(contact);
                    //    }
                    //    else {

                    //        var alertPopup = $ionicPopup.alert({
                    //            title: 'Mobile Number is Required!',
                    //            template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
                    //        });

                    //    }
                    //}
                    //else {
                    //    var alertPopup = $ionicPopup.alert({
                    //        title: 'Selected Contact is already a member!',
                    //        template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
                    //    });

                    //}

                },
                function (failure) {

                    console.log("Bummer. Failed to pick a contact");
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bummer',
                        template: 'Failed to pick a contact. You can manually enter your contact'
                    });
                    alertPopup.then(function (res) {
                        console.log('Failed to pick a contact. You can manually enter your contact');
                        $scope.contact = { CustomerID: '', DisplayName: '', MobileNumber: '', isMember: false, isCoordinator: false, isAccountant: false, isSaved: false, isPassenger: false, isStandBy: true, isDriverForTheRide: false, RegistrationStatus: 'Pending' };
                        $scope.openModal();
                    });
                }
            );


        };

        $scope.calculateDistance = function (changedLocation) {
            try {
                var fromLat = isNaN($scope.carpool.StartAddress.geometry.location.lat) ? $scope.carpool.StartAddress.geometry.location.lat() : $scope.carpool.StartAddress.geometry.location.lat;
                var fromLng = isNaN($scope.carpool.StartAddress.geometry.location.lng) ? $scope.carpool.StartAddress.geometry.location.lng() : $scope.carpool.StartAddress.geometry.location.lng;

                var toLat = isNaN($scope.carpool.EndAddress.geometry.location.lat) ? $scope.carpool.EndAddress.geometry.location.lat() : $scope.carpool.EndAddress.geometry.location.lat;
                var toLng = isNaN($scope.carpool.EndAddress.geometry.location.lat) ? $scope.carpool.EndAddress.geometry.location.lng() : $scope.carpool.EndAddress.geometry.location.lng;
                if (fromLat != 0 && fromLng != 0 && toLat != 0 && toLng != 0) {
                    var distance = Geo.getDistance(fromLat, fromLng, toLat, toLng, 'M');
                    $scope.carpool.Distance = (parseFloat(distance).toFixed(2)) / 1;
                    if ($scope.carpool.CostPerRide == 0) {
                        $scope.carpool.CostPerRide = (parseFloat($scope.carpool.Distance / 4).toFixed(2)) / 1;
                        $scope.calculateFees();
                    }


                }

            }
            catch (ex) {
                console.log('Distance could not be set');
            }
        }
        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.carpool.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.carpool.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.carpool.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.carpool.PlatformFeePerRide) + parseFloat($scope.carpool.CostPerRide);
            $scope.carpool.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }


    }

})
.controller('EditCarpoolSlideCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory, $ionicModal, Account, Contacts, ContactsService, BillingFrequencies, Carpool, Geo, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.slotsWorkboundDepartrure = {
            inputEpochTime: 27000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsWorkboundDepartrure.inputEpochTime : val;
                $scope.carpool.WorkboundDepartureTime = $scope.slotsWorkboundDepartrure.inputEpochTime;

            }
        };
        $scope.slotsWorkboundArrival = {
            inputEpochTime: 30600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundArrival.inputEpochTime = val == undefined ? $scope.slotsWorkboundArrival.inputEpochTime : val;
                $scope.carpool.WorkboundArrivalTime = $scope.slotsWorkboundArrival.inputEpochTime;

            }
        };

        $scope.slotsHomeboundDepartrure = {
            inputEpochTime: 63000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsHomeboundDepartrure.inputEpochTime : val;
                $scope.carpool.HomeboundDepartureTime = $scope.slotsHomeboundDepartrure.inputEpochTime;

            }
        };

        $scope.slotsHomeboundArrival = {
            inputEpochTime: 66600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundArrival.inputEpochTime = val == undefined ? $scope.slotsHomeboundArrival.inputEpochTime : val;
                $scope.carpool.HomeboundArrivalTime = $scope.slotsHomeboundArrival.inputEpochTime;

            }
        };
        $ionicModal.fromTemplateUrl('./templates/newCarpool/contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })

        $scope.openModal = function () {
            $scope.modal.show()
        }

        $scope.closeModal = function () {
            // $scope.data.contacts.push(contact);
            //if ($scope.contact.MobileNumber.charAt(0) === '+') {
            //    //Mobile Number is manually entered
            //    $scope.contact.MobileNumber = $scope.contact.MobileNumber.substr(1);
            //    $scope.contact.MobileExists = true;
            //}
            //if ($scope.contact.MobileNumber.length == 10) {
            //    //Add Default Country code 1
            //    $scope.contact.MobileNumber = '1' + $scope.contact.MobileNumber;
            //    $scope.contact.MobileExists = true;
            //}

            if ($scope.contact.isSaved == false) {
                var index = $scope.carpool.CarpoolMembers.indexOf($scope.contact); // Change to filter by DisplayNAme +mobileNumber only.

                if (index < 0) {
                    if ($scope.contact.MobileExists || ($scope.contact.MobileNumber != undefined && $scope.contact.MobileNumber != '')) {
                        $scope.carpool.CarpoolMembers.push($scope.contact);
                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Mobile Number is Required!',
                            template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
                        });

                    }
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Selected Contact is already a member!',
                        template: 'Changes Saved. If you wish to un-enroll this contact from the carpool, please remove from the members list'
                    });

                }
            }

            $scope.modal.hide();
        };


        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        $scope.editContact = function (contact) {
            $scope.contact = contact;
            $scope.openModal();
        }
        Carpool.get({ id: $stateParams.carpoolId }).$promise.then(function (data) {
            //if (data.Name != null) {
            //    $scope.carpoolName = data.Name;
            //}
            $scope.carpool = data;
            $scope.selectedType = data.Type;
            $scope.carpool.BillingStartDate = new Date(data.BillingStartDate);
            $scope.calculateFees();
            $scope.slotsWorkboundDepartrure.inputEpochTime = $scope.carpool.WorkboundDepartureTime;
            $scope.slotsWorkboundArrival.inputEpochTime = $scope.carpool.WorkboundArrivalTime;
            $scope.slotsHomeboundDepartrure.inputEpochTime = $scope.carpool.HomeboundDepartureTime;
            $scope.slotsHomeboundArrival.inputEpochTime = $scope.carpool.HomeboundArrivalTime;


        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }


        );


        $scope.selectedType = 'NA';
        $scope.membercarpools = '';
        $scope.slots = {
            epochTime: 27000, format: 12, step: 1
        };
        $scope.timePickerCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
            }
        };

        $scope.data = {
            numViewableSlides: 0,
            slideIndex: 0,
            slides: [
            {
                'template': './templates/carpool/carpool-name-type.html',
                'viewable': false
            },

             {
                 'template': './templates/carpool/carpool-cost.html',
                 'viewable': true
             },
             {
                 'template': './templates/carpool/carpool-address.html',
                 'viewable': true
             },
              {
                  'template': './templates/carpool/carpool-schedule-time.html',
                  'viewable': true
              },
               {
                   'template': './templates/carpool/carpool-schedule-dow.html',
                   'viewable': true
               },
             {
                 'template': './templates/carpool/carpool-billing.html',
                 'viewable': false
             },

            {
                'template': './templates/carpool/carpool-membersinvite.html',
                'viewable': true
            }
            ],
            contacts: [],
            members: [],
            billingFrequencies: [],
            newContactDisplayName: '',
            newContactMobileNumber: '',
            ContactSearchStr: '',
            showDelete: false
        };
        var countSlides = function () {
            $scope.data.numViewableSlides = 0;

            angular.forEach($scope.data.slides, function (slide) {
                if (slide.viewable == true) $scope.data.numViewableSlides++;
            })

            console.log($scope.data.numViewableSlides + " viewable slides");

        }

        countSlides();
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };
        // Called each time the slide changes
        $scope.slideChanged = function (index) {

            $scope.data.slideIndex = index;

        };

        var billingFrequecies = function () {
            $scope.data.billingFrequencies = BillingFrequencies.fetch();
        }
        billingFrequecies();


        $scope.updateChoice = function (str) {
            $scope.selectedType = str;
            // $scope.data.contacts = Contacts.fetch('sanjeev');
        }

        $scope.carpoolSave = function (carpool) {


            if ($scope.carpool.StartAddress != undefined) {
                try {
                    //   $scope.carpool.StartAddress.geometry.location.lat = $scope.carpool.StartAddress.geometry.location.lat();
                    //   $scope.carpool.StartAddress.geometry.location.lng = $scope.carpool.StartAddress.geometry.location.lng();
                }
                catch (e) {
                    console.log('Start Address not defined/Changed');
                }
            }
            if ($scope.carpool.EndAddress != undefined) {
                try {
                    //  $scope.carpool.EndAddress.geometry.location.lat = $scope.carpool.EndAddress.geometry.location.lat();
                    //  $scope.carpool.EndAddress.geometry.location.lng = $scope.carpool.EndAddress.geometry.location.lng();
                }
                catch (e) {
                    console.log('End Address not defined/Changed');

                }
            }

            console.log($scope.carpool);
            $ionicLoading.show({
                template: 'Updating your Carpool...'
            });
            $scope.carpool.$update().then(function (info) {
                $ionicLoading.hide();
                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                var alertPopup = $ionicPopup.alert({
                    title: 'Carpool Updated!',
                    template: 'You new Carpool is Updated! SMS messages will be sent to new members for confirmation.'
                });
                alertPopup.then(function (res) {
                    console.log(carpool);
                    // $scope.carpool.CarpoolMembers = [];
                    // $scope.data.contacts = [];
                    // $state.go($ionicHistory.backView().stateName);

                });

            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Carpool Error!',
                    template: 'You new Carpool could not be created! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    console.log(carpool);
                    //$state.go($ionicHistory.backView().stateName);

                });

            });



        }

        $scope.onMemberDelete = function (member) {

            if (member.isCoordinator) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Co-ordinator cannot be removed!',
                    template: 'Carpool coordinator cannot be removed from the members list!'
                });
            }

            else if (member.isSaved) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Member will be Terminated',
                    template: 'Are you sure you want to terminate this member? Termination cannot be undone.Press OK to confirm'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                        // Call Deactivate service
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

            else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Member will be Removed',
                    template: 'Are you sure you want to remove this member? Press OK to confirm.'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        var index = $scope.carpool.CarpoolMembers.indexOf(member);
                        if (index >= 0)
                            $scope.carpool.CarpoolMembers.splice(index, 1);

                        index = $scope.data.contacts.indexOf(member);
                        if (index >= 0)
                            $scope.data.contacts[index].isMember = false;
                        console.log('You are sure');
                        // Call Deactivate service
                    } else {
                        console.log('You are not sure');
                    }
                });

            }


        }
        $scope.onMemberEdit = function (member) {
            ;
        }

        $scope.pickContact = function () {

            ContactsService.pickContact().then(
                function (con) {

                    var contact = {};
                    console.log('In  Contact');

                    console.log('DisplayName-' + con.displayName);
                    contact.DisplayName = con.displayName;
                    contact.DisplayName = contact.DisplayName.replace("undefined", "");

                    contact.MobileExists = false;
                    if (con.emails != null && con.emails.length > 0)
                        contact.Email = con.emails[0].value;

                    if (con.photos != null && con.photos.length > 0)
                        contact.Photo = con.photos[0].value;
                    contact.isSaved = false;
                    if ((con.phones != null && con.phones.length > 0)) {
                        contact.Phone = con.phones[0].value;
                        angular.forEach(con.phones, function (pn) {
                            console.log('In  Phone');
                            if (pn.type == 'mobile') {
                                console.log('Found Mobile');
                                contact.MobileExists = true;
                                contact.MobileNumber = pn.value;
                                if (pn.pref == true) return false;//similar to continue
                            }
                        })
                    }
                    if (contact.MobileExists) {
                        // convert to international format
                        //if (contact.MobileNumber.length == 10) contact.MobileNumber = '1' + contact.MobileNumber;
                        contact.MobileNumber = intlTelInputUtils.formatNumberByType(contact.MobileNumber, "US");
                    }
                    $scope.contact = contact;
                    $scope.openModal();



                },
                function (failure) {
                    console.log("Bummer.  Failed to pick a contact");
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bummer',
                        template: 'Failed to pick a contact. Please enter the contact manually'
                    });
                    alertPopup.then(function (res) {
                        console.log('Failed to pick a contact');
                        $scope.contact = { CustomerID: '', DisplayName: '', MobileNumber: '', isMember: false, isCoordinator: false, isAccountant: false, isSaved: false, isPassenger: false, isStandBy: true, isDriverForTheRide: false, RegistrationStatus: 'Pending' };
                        $scope.openModal();

                    });
                }
            );

        };
        $scope.calculateDistance = function (changedLocation) {
            try {
                var fromLat = isNaN($scope.carpool.StartAddress.geometry.location.lat) ? $scope.carpool.StartAddress.geometry.location.lat() : $scope.carpool.StartAddress.geometry.location.lat;
                var fromLng = isNaN($scope.carpool.StartAddress.geometry.location.lng) ? $scope.carpool.StartAddress.geometry.location.lng() : $scope.carpool.StartAddress.geometry.location.lng;

                var toLat = isNaN($scope.carpool.EndAddress.geometry.location.lat) ? $scope.carpool.EndAddress.geometry.location.lat() : $scope.carpool.EndAddress.geometry.location.lat;
                var toLng = isNaN($scope.carpool.EndAddress.geometry.location.lat) ? $scope.carpool.EndAddress.geometry.location.lng() : $scope.carpool.EndAddress.geometry.location.lng;
                if (fromLat != 0 && fromLng != 0 && toLat != 0 && toLng != 0) {
                    var distance = Geo.getDistance(fromLat, fromLng, toLat, toLng, 'M');
                    $scope.carpool.Distance = (parseFloat(distance).toFixed(2)) / 1;
                    if ($scope.carpool.CostPerRide == 0) {
                        $scope.carpool.CostPerRide = (parseFloat($scope.carpool.Distance / 4).toFixed(2)) / 1;
                        $scope.calculateFees();
                    }


                }

            }
            catch (ex) {
                console.log('Distance could not be set');
            }
        }
        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.carpool.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.carpool.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.carpool.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.carpool.PlatformFeePerRide) + parseFloat($scope.carpool.CostPerRide);
            $scope.carpool.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }

    }



})
.controller('CarpoolDetailSlideCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicHistory, Carpool, CarpoolActivate, Ride, BillingFrequencies, CustomerPaymentMethod, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.isCoordinator = false;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.data = {
            slides: [
            {
                'template': './templates/carpoolDetails/carpool-name-type.html',
                'text': 'Name & Type',
                'viewable': false
            },

             {
                 'template': './templates/carpoolDetails/carpool-cost.html',
                 'text': 'Name & Cost',
                 'viewable': true
             },
             {
                 'template': './templates/carpoolDetails/carpool-address.html',
                 'text': 'Location',
                 'viewable': true
             },
              {
                  'template': './templates/carpoolDetails/carpool-schedule-time.html',
                  'text': 'Schedule-Time',
                  'viewable': true
              },
               {
                   'template': './templates/carpoolDetails/carpool-schedule-dow.html',
                   'text': 'Schedule-Days',
                   'viewable': true
               },
             {
                 'template': './templates/carpoolDetails/carpool-billing.html',
                 'text': 'Billing',
                 'viewable': false
             },

            {
                'template': './templates/carpoolDetails/carpool-membersinvite.html',
                'text': 'Members',
                'viewable': true
            }
            ]
        };

        var countSlides = function () {
            $scope.data.numViewableSlides = 0;

            angular.forEach($scope.data.slides, function (slide) {
                if (slide.viewable == true) $scope.data.numViewableSlides++;
            })

            console.log($scope.data.numViewableSlides + " viewable slides");

        }
        countSlides();
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };
        // Called each time the slide changes
        $scope.slideHasChanged = function (data) {

            $scope.data.slideIndex = data.index;

        };

        $scope.data.ridedate = new Date(yyyy, mm, dd);

        var buttonDetails = [
            { text: '<i class="icon ion-share"></i> New Ride' },
            { text: '<i class="icon ion-arrow-move"></i> New Expense' },
            { text: '<i class="icon ion-arrow-move"></i> Message' },
            { text: '<i class="icon ion-arrow-move"></i> Invoice & Payments' }
        ];
        $scope.slotsWorkboundDepartrure = {
            inputEpochTime: 27000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsWorkboundDepartrure.inputEpochTime : val;
                $scope.carpool.WorkboundDepartureTime = $scope.slotsWorkboundDepartrure.inputEpochTime;

            }
        };
        $scope.slotsWorkboundArrival = {
            inputEpochTime: 30600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsWorkboundArrival.inputEpochTime = val == undefined ? $scope.slotsWorkboundArrival.inputEpochTime : val;
                $scope.carpool.WorkboundArrivalTime = $scope.slotsWorkboundArrival.inputEpochTime;

            }
        };

        $scope.slotsHomeboundDepartrure = {
            inputEpochTime: 63000,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundDepartrure.inputEpochTime = val == undefined ? $scope.slotsHomeboundDepartrure.inputEpochTime : val;
                $scope.carpool.HomeboundDepartureTime = $scope.slotsHomeboundDepartrure.inputEpochTime;

            }
        };

        $scope.slotsHomeboundArrival = {
            inputEpochTime: 66600,  //Optional           
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.slotsHomeboundArrival.inputEpochTime = val == undefined ? $scope.slotsHomeboundArrival.inputEpochTime : val;
                $scope.carpool.HomeboundArrivalTime = $scope.slotsHomeboundArrival.inputEpochTime;

            }
        };


        Carpool.get({
            id: $stateParams.carpoolId
        }).$promise.then(function (data) {
            //if (data.Name != null) {
            //    $scope.carpoolName = data.Name;
            //}
            $scope.carpool = data;
            $scope.selectedType = data.Type;
            // $scope.carpool.BillingStartDate = new Date(data.BillingStartDate);
            var cpm = data.CarpoolMembers.filter(function (obj) {
                return (obj.isCoordinator == true && obj.MobileNumber == localStorage.getItem("username"));

            })[0];
            if (cpm != null) {
                $scope.isCoordinator = true;
                buttonDetails.push({ text: '<i class="icon ion-arrow-move"></i> Edit & Manage' });
            }
            $scope.data.loggedInRider = data.CarpoolMembers.filter(function (obj) {
                return obj.CustomerID == localStorage.getItem("customerid");
            })[0];

            $scope.data.isLoggedInUserStandby = $scope.data.loggedInRider == undefined ? true : $scope.data.loggedInRider.isStandBy;


            $scope.slotsWorkboundDepartrure.inputEpochTime = $scope.carpool.WorkboundDepartureTime;
            $scope.slotsWorkboundArrival.inputEpochTime = $scope.carpool.WorkboundArrivalTime;
            $scope.slotsHomeboundDepartrure.inputEpochTime = $scope.carpool.HomeboundDepartureTime;
            $scope.slotsHomeboundArrival.inputEpochTime = $scope.carpool.HomeboundArrivalTime;
        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }


        );

        $scope.Action = $stateParams.action;
        var billingFrequecies = function () {
            $scope.data.billingFrequencies = BillingFrequencies.fetch();
        }
        billingFrequecies();

        console.log(buttonDetails);
        $scope.showActionsheet = function () {

            $ionicActionSheet.show({
                titleText: 'Carpool Actions',
                buttons: buttonDetails,

                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },
                buttonClicked: function (index) {
                    console.log('BUTTON CLICKED', index);
                    switch (index) {
                        case 0: {
                            Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.carpool.Id, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
                                if (data.length == 0) $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.carpool.Id, "usagedate": $scope.data.ridedate.toDateString() });
                                else if (data.length == 1 && data[0].ReturnJourney == 'True') $state.go('tab.edit-ride', { "rideid": data[0].Id });
                                else $state.go('tab.rides', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate.toDateString() });

                            });

                        }
                        case 1:;
                        case 2:;
                        case 3:;
                        case 4: $state.go('tab.editcarpool', { "carpoolId": $scope.carpool.Id });


                    }
                    return true;
                },

            });


        };
        $scope.carpoolActivate = function (carpool) {
            $ionicLoading.show({
                template: 'Activating your Carpool...'
            });
            CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined) || !$scope.data.isLoggedInUserStandby) {
                    var cme = $scope.carpool.CarpoolMembers.filter(function (obj) {
                        return obj.CustomerID == $stateParams.customerId;
                    })[0];
                    var cmeIndex = $scope.carpool.CarpoolMembers.indexOf(cme);
                    $scope.carpool.CarpoolMembers[cmeIndex].RegistrationStatus = 'Active';

                    //  CarpoolActivate = $.extend(true, {},$scope.carpool);
                    var carpoolActivate = new CarpoolActivate({ CustomerID: localStorage.getItem("customerid"), Carpool: $scope.carpool })
                    //  alert('before save');
                    carpoolActivate.$save().then(function (info) {
                        $ionicLoading.hide();
                        //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

                        var alertPopup = $ionicPopup.alert({
                            title: 'Carpool Created!',
                            template: 'You Carpool is now Activated!'
                        });
                        alertPopup.then(function (res) {
                            console.log(carpool);
                            $scope.carpool.CarpoolMembers = [];
                            $scope.data.contacts = [];
                            $state.go($ionicHistory.backView().stateName);

                        });

                    }, function (error) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Carpool Error!',
                            template: 'You new Carpool could not be Activate! Please contact Support.' + error
                        });
                        alertPopup.then(function (res) {
                            console.log(carpool);
                            //  $state.go($ionicHistory.backView().stateName);

                        });

                    });


                }
                else {
                    $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can join the carppol. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Carpool Error!',
                    template: 'You new Carpool could not be Activate! Please contact Support.' + error
                });
                alertPopup.then(function (res) {
                    console.log(carpool);
                    // $state.go($ionicHistory.backView().stateName);

                });
            });
        }
    }
    })
.controller('CarpoolActionsCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicHistory, Carpool, CarpoolActivate, Ride, BillingFrequencies, ConnectivityMonitor) {

    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.isCoordinator = false;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.CarpoolID = $stateParams.carpoolId;
        $scope.CustomerID = localStorage.getItem("customerid");
        $scope.showEdit = false;
        $scope.data = {};
        $scope.data.ridedate = new Date(yyyy, mm, dd);

        Carpool.get({
            id: $stateParams.carpoolId
        }).$promise.then(function (data) {
            //if (data.Name != null) {
            //    $scope.carpoolName = data.Name;
            //}
            $scope.carpool = data;
            $scope.selectedType = data.Type;
            $scope.carpool.BillingStartDate = new Date(data.BillingStartDate);
            var cpm = data.CarpoolMembers.filter(function (obj) {
                return (obj.isCoordinator == true && obj.MobileNumber == localStorage.getItem("username"));

            })[0];
            if (cpm != null) {
                $scope.isCoordinator = true;
                $scope.showEdit = true;
            }
        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }

        );

        $scope.gotoRides = function () {
            Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.carpool.Id, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
                if (data.length == 0) $state.go('tab.new-carpool-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.carpool.Id, "usagedate": $scope.data.ridedate.toDateString(), "from": "carpool" });
                else if (data.length == 1 && data[0].ReturnJourney == 'True') $state.go('tab.edit-ride', { "rideid": data[0].Id });
                else $state.go('tab.rides', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.carpool.Id, "usagedate": $scope.data.ridedate.toDateString() });

            });

        };

    }
       
    })
.controller('emailLoginCtrl', ['$scope', '$http', '$state', '$cordovaDevice', '$q', '$ionicLoading', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'ConnectivityMonitor', function ($scope, $http, $state, cordovaDevice, $q, $ionicLoading, applicationConfig, EmailValidation, Account, SignalRSvc, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {

        $scope.email = '';
        $scope.loginUser = function (email) {

            $scope.email = email;
            $ionicLoading.show({
                template: 'Validating email...'
            });
            var ind = email.indexOf('@');
            var provider = email.substring(ind + 1);
            provider = encodeURIComponent(provider);
            $scope.provider = provider;
            $ionicLoading.hide();
            EmailValidation.getByEmail({ email: $scope.email, customerId: localStorage.getItem("customerid") }).$promise.then(function (data) {

                if (data.IsFreeEmail) {
                    $scope.showAlert = function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Public Email Service Detected',
                            template: 'Please enter your email that is issued by your school or company. If you do and still receive this message, please contact the developers.'
                        });
                    }
                }
                else {

                    $state.go('securityemailverification', { email: $scope.email, emailverificationCode: data.verificationCode, provider: $scope.provider });
                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );
        }
    }
    }])
.controller('LoginCtrl', ['$ionicPlatform', '$scope', '$http', '$state', '$cordovaDevice', '$q', '$ionicLoading', '$ionicHistory', '$ionicPopup', '$ionicPush', 'applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', 'ConnectivityMonitor', function ($ionicPlatform,$scope, $http, $state, cordovaDevice, $q, $ionicLoading, $ionicHistory, $ionicPopup,$ionicPush,  applicationConfig, MobileValidation, Account, SignalRSvc, ConnectivityMonitor) {
    $ionicPlatform.ready(function () {
        if (ConnectivityMonitor.isOffline()) {
            $state.go('errorconnection');
        }
        else {

            $scope.mobilenumber = "";
            $scope.data = {};
            $scope.data.mobilenumber = "";
            $scope.data.isProvider = false;
            $scope.account = "";
            $scope.data.loginClicked = false;
            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                console.log($ionicHistory.viewHistory());
            });
            $scope.loginUser = function (mobilenumber) {
                $scope.data.loginClicked = true;
                // $scope.mobilenumber = mobilenumber;
                // $scope.data.mobilenumber = mobilenumber;
                $ionicLoading.show({
                    template: 'Validating Mobile Number...'
                });
                var deviceid = ''
                try {
                      deviceid= $cordovaDevice.device.uuid;
                }
                catch (e) {
                    console.log(e);

                }
                // if ($scope.data.mobilenumber.charAt(0) === '+') $scope.data.mobilenumber = $scope.data.mobilenumber.substr(1);
                console.log($scope.data.mobilenumber);
                $scope.data.mobilenumber = intlTelInputUtils.formatNumberByType($scope.data.mobilenumber, "US");
                MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.data.mobilenumber, deviceid).success(function (data) {

                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("username", $scope.data.mobilenumber);
                    Account.getByMobileNumber({ mobileNumber: $scope.data.mobilenumber, type: 'verified' }).$promise.then(function (data) {

                        $ionicLoading.hide();

                        if (data.Id == null || data.Id == 'undefined') {
                            $scope.data.loginClicked = false;
                            console.log("Something ad happened on server. Index is stale");
                           
                                 $ionicPopup.alert({
                                    title: 'Server Timeout',
                                    template: 'Please try again later'
                                });

                            
                        }
                        else {
                            localStorage.setItem("customerid", data.Id);
                            localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                            localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                             localStorage.setItem("isProvider", data.isProvider);     
                            SignalRSvc.initialize();

                                //Start Push Notification
                                       $ionicPush.register().then(function(t) {
                                            return $ionicPush.saveToken(t);
                                            }).then(function(t) {
                                            console.log('Token is:', t.token);
                                                        var acc = data;
                                                        acc.DeviceToken= t.token;
                                                        acc.$update().then(function (info) {
                                                                console.log("My Device token is Saved:",t.token);
                                                            });
                                            });

                                        

                                   //End of Push Notification
                            if (data.email == null && data.isProvider  ) $state.go('securityemaillogin', {}, { reload: true })
                            else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") 
                            {
                                if(data.isProvider)
                                     $state.go('securitycustomeredit', {}, { reload: true });
                                else
                                     $state.go('tab.CustInfo', {}, { reload: true });

                            }
                            else $state.go('tab.account', {}, { reload: true });

                        }

                    });


                })
                .error(function (error) {
                    $ionicLoading.hide();
                    if (error == null) {
                        $scope.data.loginClicked = false;
                        console.log('application server not available');
                        $ionicPopup.alert({
                            title: 'Error Message!',
                            template: 'application server not available. contact support'
                        });
                    }
                    else if (error.error_description == "The user name or password is incorrect.") {
                       
                        Account.getByMobileNumber({ mobileNumber: $scope.data.mobilenumber, type: 'unverified' }).$promise.then(function (data) {

                            if (data.Id == undefined || data.Id == null) {
                                var myPopup = $ionicPopup.confirm({
                                    title: 'Confirm new registration',
                                    subTitle: 'Registration',
                                    template: 'A text message with a verification code  will be sent to ' + $scope.data.mobilenumber + '. \n Please confirm that you have access to the device, and that you want to register.', // String (optional). The html template to place in the popup body.
                                    scope: $scope,
                                    cancelText: 'No - I will re-enter my correct mobile number', // String (default: 'Cancel'). The text of the Cancel button.
                                    cancelType: 'button button-assertive', // String (default: 'button-default'). The type of the Cancel button.
                                    okText: 'Yes - Register me! ', // String (default: 'OK'). The text of the OK button.
                                    okType: '' // String (default: 'button-positive'). The type of the OK button.

                                });
                                myPopup.then(function (res) {
                                    if (res == true) {
                                                var confirmPopup = $ionicPopup.confirm({
                                                title: 'Doctor or Patient',
                                                template: 'Are you a doctor?',
                                                cancelText: 'No I am a patient',
                                                okText: 'Yes I am a doctor'
                                                });

                                            confirmPopup.then(function(res) {
                                            if(res) {
                                                $scope.data.isProvider=true;
                                                saveUser();
                                                // Save Provider Choice
                                                } else {
                                                $scope.data.isProvider=false;
                                                saveUser();
                                            
                                            }

                                    });

                                       
                                    }
                                    else
                                    {
                                        $scope.data.loginClicked = false;

                                    }
                                });
                            }
                            else
                            {
                                saveUser();

                            }
                            
                            
                        }, function (error) {
                            //wild guess - MAybe everything is ok and we save.
                            saveUser();

                        });

                                               
                    }

                })

            }

             var saveUser = function () {
              
                    console.log("getting device info");

                    var device = '';
                    var cordova = '';
                    var model = '';
                    var platform = '';
                    var uuid = '';
                    var version = '';

                    try {
                        device = cordovaDevice.device.manufacturer;
                        cordova = cordovaDevice.device.cordova;
                        model = cordovaDevice.device.model;
                        platform = cordovaDevice.device.platform;
                        uuid = cordovaDevice.device.uuid;
                        version = cordovaDevice.device.version;
                    }
                    catch (e) {
                        console.log('Not a Mobile Device' + e);
                        try {
                            device = navigator.appCodeName;
                            cordova = navigator.platform;
                            model = navigator.appVersion;
                            platform = navigator.product;
                            version = navigatorf.appVersionnavigator.userAgent;

                        }
                        catch (ex) {
                            console.log('Not a Mobile Device and Not a Browser' + ex);

                        }

                    }


                    $scope.Account = new Account({ MobileNumber: $scope.data.mobilenumber, DeviceID: uuid, DeviceName: device, DeviceModel: model, DevicePlatform: platform, DeviceVersion: version,isProvider:$scope.data.isProvider  });
                    $scope.Account.$save().then(function (info) {
                        $scope.Account = info;
                        //$state.go('tab.Organization');
                        if ($scope.Account.isNew){  
                
                              $state.go('securityregistration', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber });
                

                        }  
                        else
                            $state.go('securitymobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber });


                    });
                

            }
        }
    });
}])

.controller('VideoSessionLinkCtrl', ['$ionicPlatform', '$scope', '$http', '$state', '$stateParams','$cordovaDevice', '$q', '$ionicLoading', '$ionicHistory', '$ionicPopup', 'applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', 'ConnectivityMonitor', function ($ionicPlatform,$scope, $http, $state,$stateParams, cordovaDevice, $q, $ionicLoading, $ionicHistory, $ionicPopup, applicationConfig, MobileValidation, Account, SignalRSvc, ConnectivityMonitor) {
    $ionicPlatform.ready(function () {
        

            $scope.videSessionID = $stateParams.videSessionID;           
            
              

           
        
    });
}])

.controller('emailVerificationCodeCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'Organization', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, applicationConfig, EmailValidation, Account, SignalRSvc, Organization, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.emailverificationcode = "";
       // $scope.verificationCode = $stateParams.emailverificationCode; // ???
        var x = $stateParams.provider;
        $scope.verifyCode = function (emailverificationcode) {
            $scope.emailverificationcode = emailverificationcode;

            if ($scope.emailverificationcode == $stateParams.emailverificationCode) {
                Organization.getByProvider({ provider: x, p: 1 }).$promise.then(function (data) {
                    if (data.Id == null) {
                        //$state.go('tab.Organization', { provider: x });
                    }
                    else {
                        $state.go('tab.Customer', { "orgID": data.Id })
                    }

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );
            }

        }
    }
}])
.controller('VerificationCodeCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$cordovaDevice', '$ionicHistory', '$ionicLoading','$ionicPush', 'applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $cordovaDevice, $ionicHistory, $ionicLoading,$ionicPush,  applicationConfig, MobileValidation, Account, SignalRSvc, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.mobileverificationcode = "";
        $scope.mobilenumber = $stateParams.mobileNumber;
        $scope.data = {};
        $scope.data.disableLogin = false;
        $scope.data.mobileverificationcode = ""
        $scope.customerID = $stateParams.customerID;
       // $scope.verificationCode = $stateParams.verificationCode;
        $scope.$on('$ionicView.beforeEnter', function () {
            // $ionicHistory.clearCache();
            // $ionicHistory.clearHistory();
            //$ionicNavBarDelegate.showBackButton(false);
            // console.log($ionicHistory.viewHistory());
        });

        $scope.verifyCode = function (mobileverificationcode) {
            $ionicLoading.show({
                template: 'Validating Mobile Code...'
            });
            $scope.mobileverificationcode = $scope.data.mobileverificationcode;
           
                $scope.Account = new Account({ Id: $scope.customerID, MobileNumber: $scope.mobilenumber, VerificationCode: $scope.mobileverificationcode, isVerified: true, CostPerRide: -1 });
               // Verification Code is checked on server In Account Controller PUT
                $scope.Account.$update().then(function (info) {
                    if (info.isVerified == true) {
                        $scope.mobilenumber = info.MobileNumber;
                        var deviceid = $scope.mobileverificationcode;

                    MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.mobilenumber, deviceid).success(function (data) {
                            
                            localStorage.setItem("access_token", data.access_token);
                            localStorage.setItem("username", $scope.mobilenumber);
                            Account.getByMobileNumber({ mobileNumber: $scope.mobilenumber, type: 'verified' }).$promise.then(function (data) {
                                $ionicLoading.hide();
                                $scope.data.disableLogin = false;
                                if (data.Id == null || data.Id == 'undefined') {
                                    console.log("Something bad happened on server. Index is stale");
                                  
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Server Timeout',
                                            template: 'Sorry for the inconvenienve, please try again later'
                                        });
                                        alertPopup.then(function (res) {
                                            console.log('Server Timeout alerted');
                                        });

                                    
                                }
                                else {
                                    localStorage.setItem("customerid", data.Id);
                                    localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                                    localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                                      localStorage.setItem("isProvider", data.isProvider);     

                                    SignalRSvc.initialize();
                                     //Start Push Notification
                                       
                                        $ionicPush.register().then(function(t) {
                                            return $ionicPush.saveToken(t);
                                            }).then(function(t) {
                                            console.log('Token is:', t.token);
                                                        var acc = data;
                                                        acc.DeviceToken= t.token;
                                                        acc.$update().then(function (info) {
                                                                console.log("My Device token is Saved:",t.token);
                                                            });
                                            });

                                        

                                   //End of Push Notification
                                    if (data.email == null && data.isProvider )
                                    {
                                        PopUpMessage = 'Just a few more steps before you can using the app! Let us finish up your Registration!';
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Registration Incomplete!',
                                            template: PopUpMessage
                                        });
                                        alertPopup.then(function (res) {
                                            console.log("After Credit Card Save");
                                            //  $scope.ride.CarpoolMembers = [];
                                               $state.go('securityemaillogin', {}, { reload: true });
                                        });

                                        
                                    }                                        
                                    else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") {
                                        PopUpMessage = 'Just a few more steps before you can using the app! Let us finish up your Registration!';
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Registration Incompete!',
                                            template: PopUpMessage
                                        });
                                        alertPopup.then(function (res) {
                                            console.log("After Credit Card Save");
                                            //  $scope.ride.CarpoolMembers = [];
                                            if(data.isProvider)
                                            {                                          
                                            $state.go('securitycustomeredit', {}, { reload: true });
                                            }
                                            else
                                            {
                                                $state.go('tab.CustInfo', {}, { reload: true });
                                            }
                                        });
                                       
                                    }
                                    else $state.go('tab.account', {}, { reload: true });


                                    // $state.go('tab.account', {}, { reload: true });
                                    //$state.go('tab.email-Verification', {  email: "bob@yahoo.com", verificationCode: $scope.EmailValidation.v });
                                }


                            }, function (error) {
                                $ionicLoading.hide();
                                $scope.data.disableLogin = false;
                                if (error.data == null) {
                                    $ionicPopup.alert({
                                        title: applicationConfig.errorPopupTitle,
                                        templateUrl: 'templates/error-appserverunavailable.html'
                                    })
                                  .then(function (res) {
                                      $state.go('security');
                                      return true;

                                  });

                                }
                                else {
                                    $ionicPopup.alert({
                                        title: applicationConfig.errorPopupTitle,
                                        templateUrl: 'templates/error-application.html'
                                    })
                                  .then(function (res) {
                                      return true;
                                  });

                                }
                                console.log(error);

                            }

                            );


                        })
                    .error(function (error) {
                        $ionicLoading.hide();
                        //alert('Could not login');
                        $scope.data.disableLogin = false;
                        if (error.error_description == "The user name or password is incorrect.") {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error Message!',
                                template: 'Could not Authenticate. Retry Authentication by Validating after a few seconds'
                            });
                            alertPopup.then(function (res) {

                                console.log('Could not Authenticate');
                                $scope.data.disableLogin = false;

                            });


                        }

                    });
                        return false;

                    }
                    else
                    {
                        $ionicLoading.hide();
                        $scope.data.disableLogin = false;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Warning Message!',
                            template: 'Invalid Code. Please re-enter the Correct validation code'
                        });
                        alertPopup.then(function (res) {
                            $scope.data.disableLogin = false;

                        });

                    }
                }, function (error) {
                    $ionicLoading.hide();
                    $scope.data.disableLogin = false;
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );
            
            
        }

        $scope.resendVerificationCode = function (mobileverificationcode,VerificationCodeChannel) {
            $scope.Account = new Account({ MobileNumber: $scope.mobilenumber, VerificationCodeChannel: VerificationCodeChannel });
            $scope.Account.$save().then(function (info) {
                $scope.Account = info;
                //  $scope.verificationCode = info.VerificationCode;
                var title = "";
                var template = "";
                if (VerificationCodeChannel=="voice") {
                    title = "We are placing a call to your number - " + $scope.mobilenumber;
                    template = "Please receive the phone call and note down the verification code , enter it on the app and validate !";
                }
                else
                {
                    title= 'Verification Code Resent!',
                    template= 'A new verification was sent to your phone -' + $scope.mobilenumber + '. Please enter the  validation code and validate.'

                }
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template:template
                });
                alertPopup.then(function (res) {
                    //$state.go('tab.account.mobilelogin.mobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });
                    $scope.data.disableLogin = false;

                });
                //$state.go('tab.account-verification', { mobileNumber: $scope.Account.MobileNumber});

            });

        }
    }

}])
.controller('OrganizationCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'Organization', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, applicationConfig, EmailValidation, Account, SignalRSvc, Organization, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        var domain = $stateParams.provider;
        $scope.data = { OrganizationLocation: '', OrganizationEmailDomain: domain };
        $scope.organization = new Organization({
            Id: '',
            OrganizationName: '',
            OrganizationLocation: [],
            OrganizationEmailDomain: []
        });
        $scope.organizationSave = function (org) {

            if (org.$valid) {

                $scope.organization.OrganizationLocation.splice(0, 0, $scope.data.OrganizationLocation);
                $scope.organization.OrganizationEmailDomain.splice(0, 0, $scope.data.OrganizationEmailDomain);
                $scope.organization.$save().then(function (info) {

                    $state.go('tab.Customer', { "orgID": info.Id })
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );
            }
        }
    }
  }])
.controller('RegistartionSlideCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', '$ionicModal', '$ionicPush',  'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB', 'Geo', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, $ionicModal,$ionicPush, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB, Geo, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }

    else {
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        });
        $scope.mobileverificationcode = "";
        $scope.mobilenumber = $stateParams.mobileNumber;
        $scope.customerID = $stateParams.customerID;
        //$scope.verificationCode = $stateParams.verificationCode;
        //$scope.slots = {
        //    epochTime: 27000, format: 12, step: 1
        //};

        //$scope.timePickerCallback = function (val) {
        //    if (typeof (val) === 'undefined') {
        //        console.log('Time not selected');
        //    } else {
        //        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
        //    }
        //};
        $scope.data = {
            email: '',
            mobileverificationcode: '',
            emailverificationcode: '',
            skipEmailVerification: false,
            OrganizationLocation: '',
            OrganizationEmailDomain: '',
            selectedContacts: [],
            showDelete: false,
            skipButtonDisabled: false,
            isProvider:false,

        }
         $scope.datepickerObject = {
                titleLabel: 'Date of Birth',  //Optional       

                inputDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),  //Optional           
                callback: function (val) {  //Mandatory
                    //datePickerCallback(val);
                    if (val != undefined && val != null) {
                        $scope.customer.dob = val;
                        $scope.datepickerObject.inputDate = val;
                        
                    }

                }

            };
        $scope.Schedule = {

            WorkboundDepartureTime: 27000,
            WorkboundArrivalTime: 30600,
            HomeboundDepartureTime: 63000,
            HomeboundArrivalTime: 66600,
            Sunday: false,
            Monday: true,
            Tuesday: true,
            Wednesday: true,
            Thursday: true,
            Friday: true,
            Saturday: false
        }

        $scope.slotsWorkboundDeparture = {
            inputEpochTime: $scope.Schedule.WorkboundDepartureTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                $scope.Schedule.WorkboundDepartureTime = val;
            }
        };
        $scope.slotsWorkboundArrival = {
            inputEpochTime: $scope.Schedule.WorkboundArrivalTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                $scope.Schedule.WorkboundArrivalTime = val;
            }
        };
        $scope.slotsHomeboundDeparture = {
            inputEpochTime: $scope.Schedule.HomeboundDepartureTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                $scope.Schedule.HomeboundDepartureTime = val;
            }
        };
        $scope.slotsHomeboundArrival = {
            inputEpochTime: $scope.Schedule.HomeboundArrivalTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                $scope.Schedule.HomeboundArrivalTime = val;
            }
        };

        $scope.calculateDistance = function (changedLocation) {
            try {
                var fromLat = isNaN($scope.customer.HomeLocation.geometry.location.lat) ? $scope.customer.HomeLocation.geometry.location.lat() : $scope.customer.HomeLocation.geometry.location.lat;
                var fromLng = isNaN($scope.customer.HomeLocation.geometry.location.lng) ? $scope.customer.HomeLocation.geometry.location.lng() : $scope.customer.HomeLocation.geometry.location.lng;

                var toLat = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lat() : $scope.customer.EndLocation.geometry.location.lat;
                var toLng = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lng() : $scope.customer.EndLocation.geometry.location.lng;
                if (fromLat != 0 && fromLng != 0 && toLat != 0 && toLng != 0) {
                    var distance = Geo.getDistance(fromLat, fromLng, toLat, toLng, 'M');
                    $scope.customer.Distance = parseFloat(distance).toFixed(2);
                    if ($scope.customer.CostPerRide == 0) {
                        $scope.customer.CostPerRide = (parseFloat($scope.customer.Distance / 4).toFixed(2)) / 1;
                        $scope.calculateFees();
                    }


                }

            }
            catch (ex) {
                console.log('Distance could not be set');
            }
        }
        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.customer.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.customer.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.customer.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.customer.PlatformFeePerRide) + parseFloat($scope.customer.CostPerRide);
            $scope.customer.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }

        $scope.verifyCode = function (mobileverificationcode) {
            $ionicLoading.show({
                template: 'Validating Mobile Code...'
            });

                $scope.Account = new Account({ Id: $scope.customerID, MobileNumber: $scope.mobilenumber, VerificationCode: $scope.data.mobileverificationcode, isVerified: true });
                $scope.Account.$update().then(function (info) {
                    if (info.isVerified == true) {
                        $scope.mobilenumber = info.MobileNumber;
                        var deviceid = info.VerificationCode;

                        MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.mobilenumber, deviceid).success(function (data) {

                            localStorage.setItem("access_token", data.access_token);
                            localStorage.setItem("username", $scope.mobilenumber);
                            Account.getByMobileNumber({ mobileNumber: $scope.mobilenumber, type: 'verified' }).$promise.then(function (data) {
                                $ionicLoading.hide();
                                if (data.Id == null || data.Id == 'undefined') {
                                    console.log("Something bad happened on server. Index is stale");

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Server Timeout',
                                        template: 'Sorry for the inconvenienve, please try again later'
                                    });
                                    alertPopup.then(function (res) {
                                        console.log('Server Timeout');
                                    });


                                }
                                else {
                                    localStorage.setItem("customerid", data.Id);
                                    localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                                    localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                                    localStorage.setItem("isProvider", data.isProvider);     
                                    $scope.customer = data;
                                    SignalRSvc.initialize();
                                  
                                        //Start Push Notification
                                       
                                        $ionicPush.register().then(function(t) {
                                            return $ionicPush.saveToken(t);
                                            }).then(function(t) {
                                            console.log('Token is:', t.token);
                                                        var acc = data;
                                                        acc.DeviceToken= t.token;
                                                        acc.$update().then(function (info) {
                                                                console.log("My Device token is Saved:",t.token);
                                                            });
                                            });

                                        

                                   //End of Push Notification

                                  
                                    if(data.isProvider)
                                    $ionicSlideBoxDelegate.next();
                                    else
                                    {
                                          $ionicSlideBoxDelegate.next();
                                          $ionicSlideBoxDelegate.next();
                                          $ionicSlideBoxDelegate.next();
                                          $ionicSlideBoxDelegate.next();

                                    }
                                    //$state.go('tab.emailLogin');
                                    //$state.go('tab.email-Verification', {  email: "bob@yahoo.com", verificationCode: $scope.EmailValidation.v });
                                }


                            }, function (error) {
                                $ionicLoading.hide();
                                if (error.data == null) {
                                    $ionicPopup.alert({
                                        title: applicationConfig.errorPopupTitle,
                                        templateUrl: 'templates/error-appserverunavailable.html'
                                    })
                                  .then(function (res) {
                                      $state.go('security');
                                      return true;

                                  });

                                }
                                else {
                                    $ionicPopup.alert({
                                        title: applicationConfig.errorPopupTitle,
                                        templateUrl: 'templates/error-application.html'
                                    })
                                  .then(function (res) {
                                      return true;
                                  });

                                }
                                console.log(error);

                            }
                            );


                        })
                       .error(function (error) {
                           //alert('Could not login');
                        $ionicLoading.hide();
                        if (error.error_description == "The user name or password is incorrect.") {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error Message!',
                                template: 'Could not Authenticate. Retry Authentication by Validating after a few seconds'
                            });
                            alertPopup.then(function (res) {
                                console.log('Could not Authenticate');
                            });


                        }

                    });
                        return false;

                    }
                    else {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Warning Message!',
                            template: 'Invalid Code. Please re-enter the Correct validation code'
                        });
                        alertPopup.then(function (res) {

                        });

                    }
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );
            
            
        }

        $scope.resendVerificationCode = function (mobileverificationcode, VerificationCodeChannel) {
            $scope.Account = new Account({ MobileNumber: $scope.mobilenumber, VerificationCodeChannel: VerificationCodeChannel });
            $scope.Account.$save().then(function (info) {
                $scope.Account = info;
               // $scope.verificationCode = info.VerificationCode;
                var title = "";
                var template = "";
                if (VerificationCodeChannel == "voice") {
                    title = "We are placing a call to your number - " + $scope.mobilenumber;
                    template = "Please receive the phone call and note down the verification code , enter it on the app and validate !";
                }
                else {
                    title = 'Verification Code Resent!',
                    template = 'A new verification was sent to your phone -' + $scope.mobilenumber + '. Please enter the  validation code and validate.'

                }
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: template
                });
                alertPopup.then(function (res) {
                    //$state.go('tab.account.mobilelogin.mobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });
                    $scope.data.disableLogin = false;

                });
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );

        }

        // $scope.email = '';
        $scope.loginUser = function (email) {

            // $scope.email = email;
            $ionicLoading.show({
                template: 'Validating email...'
            });
            var ind = $scope.data.email.indexOf('@');
            var provider = $scope.data.email.substring(ind + 1);
            provider = encodeURIComponent(provider);
            $scope.provider = provider;
            $ionicLoading.hide();
            EmailValidation.getByEmail({ email: $scope.data.email, customerId: localStorage.getItem("customerid") }).$promise.then(function (data) {

                if (data.IsFreeEmail) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Public Email Service Detected',
                        template: 'Please enter your email that is issued by your school or company. If you do and still receive this message, please contact the developers.'
                    });
                    alertPopup.then(function (res) {
                        console.log('Public Email Service Detected');
                    });

                }
                else {
                    $scope.emailVerificationCode = data.verificationCode;
                    $ionicSlideBoxDelegate.next();
                    // $state.go('tab.email-Verification', { email: $scope.email, emailverificationCode: data.verificationCode, provider: $scope.provider });
                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );
        }


        $scope.resendEmailVerificationCode = function (emailverificationcode) {
            $ionicLoading.show({
                template: 'Resending email Validation code...'
            });
            EmailValidation.getByEmail({ email: $scope.data.email, customerId: localStorage.getItem("customerid") }).$promise.then(function (data) {
                $ionicLoading.hide();
                if (data.IsFreeEmail) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Public Email Service Detected',
                        template: 'Please enter your email that is issued by your school or company. If you do and still receive this message, please support.'

                    });
                    alertPopup.then(function (res) {
                        console.log('Public Email Service Detected');
                    });

                }
                else {
                    $scope.emailVerificationCode = data.verificationCode;

                    var alertPopup = $ionicPopup.alert({
                        title: 'Email Validation Code Resent',
                        template: 'Please re-enter the verification code sent to your email -' + $scope.data.email

                    });
                    alertPopup.then(function (res) {
                        console.log('verification code sent');
                    });

                    // $ionicSlideBoxDelegate.next();
                    // $state.go('tab.email-Verification', { email: $scope.email, emailverificationCode: data.verificationCode, provider: $scope.provider });
                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );

        }

        $scope.verifyEmailCode = function (emailverificationcode) {
            //$scope.emailverificationcode = emailverificationcode;

            if ($scope.emailVerificationCode == $scope.data.emailverificationcode) {
                // $scope.EmailValidation = new EmailValidation({ Id: $scope.customerID, email: info.email, VerificationCode: $scope.emailVerificationCode, isVerified: true });
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                    $scope.customer = info;     $scope.customer.isEmailVerified = true;
                    if($scope.data.isProvider){
                             $scope.customer.isProvider=$scope.data.isProvider;
                    }
                    $scope.customer.$update().then(function (info) {
                        Organization.getByProvider({ provider: $scope.provider, p: 1 }).$promise.then(function (data) {
                            if (data.Id == null) {
                                // $state.go('tab.Organization', { provider: x });

                                $scope.data.OrganizationEmailDomain = $scope.provider;
                                $scope.organization = new Organization({
                                    Id: '',
                                    OrganizationName: '',
                                    OrganizationLocation: [],
                                    OrganizationEmailDomain: []
                                });

                            }
                            else {
                                $scope.orgID = data.Id;
                                $scope.customer.customerOrganization = data;
                                $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];

                            }
                            $ionicSlideBoxDelegate.next();
                        //  var confirmPopup = $ionicPopup.confirm({
                        //     title: 'Doctor or Patient',
                        //     template: 'Are you a doctor?',
                        //     cancelText: 'No I am a patient',
                        //     okText: 'Yes I am a doctor'
                        //      });

                        // confirmPopup.then(function(res) {
                        //  if(res) {
                        //      $scope.customer.isProvider=true;
                        // 	 $ionicSlideBoxDelegate.next();
                        //     } else {
                        //       $scope.customer.isProvider=false;
                        //       $ionicSlideBoxDelegate.next();      
                        //       $ionicSlideBoxDelegate.next();
                        // }

                        // });

                        });
                    });//end of Account Update
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                ); //End of account get
                  
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Warning Message!',
                    template: 'Invalid Code. Please re-enter the Correct validation code'
                });
                alertPopup.then(function (res) {

                });


            }

        }
        $scope.skipEmailVerification = function (email) {
            $scope.data.skipButtonDisabled = true;
            Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                $scope.customer = info;
                $scope.customer.isEmailVerified = false;
                 if($scope.data.isProvider){
                             $scope.customer.isProvider=$scope.data.isProvider;
                    }
                $scope.customer.$update().then(function (info) {
                    Organization.getByProvider({ provider: $scope.provider, p: 1 }).$promise.then(function (data) {
                        if (data.Id == null) {
                            // $state.go('tab.Organization', { provider: x });

                            $scope.data.OrganizationEmailDomain = $scope.provider;
                            $scope.organization = new Organization({
                                Id: '',
                                OrganizationName: '',
                                OrganizationLocation: [],
                                OrganizationEmailDomain: []
                            });
                            $ionicSlideBoxDelegate.next();
                        }
                        else {
                            $scope.orgID = data.Id;
                            $scope.customer.customerOrganization = data;
                            $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];
                            $ionicSlideBoxDelegate.next();
                            $ionicSlideBoxDelegate.next();
                        }

                    });
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );//end of Account Update
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            ); //End of account get
        }




        $scope.organizationSave = function (org) {

            if ($scope.data.OrganizationLocation != undefined) {
                try {
                    //  $scope.data.OrganizationLocation.geometry.location.lat = $scope.data.OrganizationLocation.geometry.location.lat();
                    //  $scope.data.OrganizationLocation.geometry.location.lng = $scope.data.OrganizationLocation.geometry.location.lng();
                }
                catch (e) {
                    console.log('Organization Location Not defined/updated')
                }
            }


            $scope.organization.OrganizationLocation.splice(0, 0, $scope.data.OrganizationLocation);
            $scope.organization.OrganizationEmailDomain.splice(0, 0, $scope.data.OrganizationEmailDomain);
            $scope.organization.$save().then(function (info) {
                $scope.orgID = info.Id;
                //$state.go('tab.Customer', { "orgID": info.Id })               
                // $state.go('tab.Customer', { "orgID": data.Id })
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
                    $scope.customer = data;
                    $scope.customer.customerOrganization = info;
                    $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];
                    $ionicSlideBoxDelegate.next();

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }
                );

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );

        }

           

        $scope.customerSave = function (cust) {
            //$scope.customer.EndLocation = $scope.data.selectedEndLocation;
            // $scope.ride.RideDate = $scope.data.rideDate;
            if ($scope.customer.HomeLocation != undefined) {
                try {
                    // $scope.customer.HomeLocation.geometry.location.lat = $scope.customer.HomeLocation.geometry.location.lat();
                    // $scope.customer.HomeLocation.geometry.location.lng = $scope.customer.HomeLocation.geometry.location.lng();
                }
                catch (e) {
                    console.log('Home Location Not defined/updated')
                }
            }
            if ($scope.customer.EndLocation != undefined) {
                try {
                    //   $scope.customer.EndLocation.geometry.location.lat = $scope.customer.EndLocation.geometry.location.lat();
                    //  $scope.customer.EndLocation.geometry.location.lng = $scope.customer.EndLocation.geometry.location.lng();
                }
                catch (e) {
                    console.log('End Location Not defined/updated')

                }
            }
            $ionicLoading.show({
                template: 'Saving your info...'
            });
            if ($scope.data.selectedContacts.length > 0) $scope.customer.Contacts = $scope.data.selectedContacts;
            $scope.customer.CustomerSchedule = $scope.Schedule;
             if($scope.data.isProvider){
                             $scope.customer.isProvider=$scope.data.isProvider;
                    }
            $scope.customer.$update().then(function (info) {
                $ionicLoading.hide();
            $state.go('tab.account', {}, { reload: true });
                //$ionicSlideBoxDelegate.next();

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);
                $state.go('tab.account', {}, { reload: true });

            }

            );


        }

        $scope.customersaveandgo = function (cust) {
            $scope.customerSave(cust);
            var alertPopup = $ionicPopup.alert({
                title: 'Info Saved!',
                template: 'Thank You. You profile is updated!'
            });
            alertPopup.then(function (res) {
                $state.go('tab.account', {}, { reload: true });
            });

        }

        $scope.fbLogin = function () {
            ngFB.login({ scope: 'email,publish_actions' }).then(
                function (response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        $scope.closeLogin();
                    } else {
                        alert('Facebook login failed');
                    }
                });
        };


        $scope.pickContact = function () {

            ContactsService.pickContact().then(
                function (con) {

                    var contact = {};
                    console.log('In  Contact');

                    console.log('DisplayName-' + con.displayName);
                    contact.DisplayName = con.displayName;
                    contact.DisplayName = contact.DisplayName.replace("undefined", "");
                    if (con.emails != null && con.emails.length > 0)
                        contact.Email = con.emails[0].value;

                    if (con.photos != null && con.photos.length > 0)
                        contact.Photo = con.photos[0].value;
                    contact.isSaved = false;
                    if ((con.phones != null && con.phones.length > 0)) {
                        contact.Phone = con.phones[0].value;
                        angular.forEach(con.phones, function (pn) {
                            console.log('In  Phone');
                            if (pn.type == 'mobile') {
                                console.log('Found Mobile');
                                contact.MobileExists = true;
                                contact.MobileNumber = pn.value;
                                if (pn.pref == true) return false;//similar to continue
                            }
                        })
                    }

                    // $scope.data.contacts.push(contact);

                    // $scope.data.selectedContacts.push(contact);
                    if (contact.MobileExists) {
                        // convert to international format
                        // if (contact.MobileNumber.length == 10) contact.MobileNumber = '1' + contact.MobileNumber;
                        contact.MobileNumber = intlTelInputUtils.formatNumberByType(contact.MobileNumber, "US");
                    }
                    // $scope.data.contacts.push(contact);
                    $scope.contact = contact;
                    $scope.openModal();





                },
                function (failure) {
                    console.log("Bummer.  Failed to pick a contact");
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bummer',
                        template: 'Failed to pick a contact.You can enter you contact details manually'
                    });
                    alertPopup.then(function (res) {
                        console.log('Failed to pick a contact');
                        $scope.contact = { DisplayName: '', MobileNumber: '', isSaved: false };
                        $scope.openModal();
                    });
                }
            );

        };

        $ionicModal.fromTemplateUrl('./templates/contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })
        $scope.onContactDelete = function (contact) {


            var confirmPopup = $ionicPopup.confirm({
                title: 'Contact will be Removed',
                template: 'Are you sure you want to remove this Contact? Press OK to confirm.'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    index = $scope.data.selectedContacts.indexOf(contact);
                    if (index >= 0)
                        $scope.data.selectedContacts.splice(index, 1);
                    console.log('You are sure');
                    // Call Deactivate service
                } else {
                    console.log('You are not sure');
                }
            });




        }
        $scope.openModal = function () {
            $scope.modal.show()
        }

        $scope.closeModal = function () {
            // $scope.data.contacts.push(contact);
            //if ($scope.contact.MobileNumber.charAt(0) === '+') {
            //    //Mobile Number is manually entered
            //    $scope.contact.MobileNumber = $scope.contact.MobileNumber.substr(1);
            //    $scope.contact.MobileExists = true;
            //}
            //if ($scope.contact.MobileNumber.length == 10) {
            //    //Add Default Country code 1
            //    $scope.contact.MobileNumber = '1'+$scope.contact.MobileNumber;
            //    $scope.contact.MobileExists = true;
            //}

            if ($scope.contact.isSaved == false) {

                var index = $scope.data.selectedContacts.indexOf($scope.contact); // Change to filter by DisplayNAme +mobileNumber only.

                if (index < 0) {
                    if ($scope.contact.MobileExists || ($scope.contact.MobileNumber != undefined && $scope.contact.MobileNumber != '')) {
                        $scope.data.selectedContacts.push($scope.contact);
                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Mobile Number is Required!',
                            template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
                        });

                    }
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Selected Contact is already a member!',
                        template: 'Changes Saved. If you wish to un-enroll this contact from the carpool, please remove from the members list'
                    });

                }
            }

            $scope.modal.hide();
        };

        $scope.editContact = function (contact) {
            $scope.contact = contact;
            $scope.openModal();
        }

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    }

}])
.controller('EmailOrganizationCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', 'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        });
        $scope.mobileverificationcode = "";
        $scope.mobilenumber = $stateParams.mobileNumber;
        $scope.customerID = $stateParams.customerID;
      //  $scope.verificationCode = $stateParams.verificationCode;
        //$scope.slots = {
        //    epochTime: 27000, format: 12, step: 1
        //};

        //$scope.timePickerCallback = function (val) {
        //    if (typeof (val) === 'undefined') {
        //        console.log('Time not selected');
        //    } else {
        //        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
        //    }
        //};
        $scope.data = {
            email: '',
            mobileverificationcode: '',
            emailverificationcode: '',
            skipEmailVerification: false,
            OrganizationLocation: '',
            OrganizationEmailDomain: '',
            selectedContacts: [],
            showDelete: false

        }


        Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {

            $scope.customer = info;
            $scope.data.email = $scope.customer.email;

        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }
        
        );



        // $scope.email = '';
        $scope.loginUser = function (email) {

            // $scope.email = email;
            $ionicLoading.show({
                template: 'Validating email...'
            });
            var ind = $scope.data.email.indexOf('@');
            var provider = $scope.data.email.substring(ind + 1);
            provider = encodeURIComponent(provider);
            $scope.provider = provider;
            $ionicLoading.hide();
            EmailValidation.getByEmail({ email: $scope.data.email, customerId: localStorage.getItem("customerid") }).$promise.then(function (data) {

                if (data.IsFreeEmail) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Public Email Service Detected',
                        template: 'Please enter your email that is issued by your school or company. If you do and still receive this message, please contact the developers.'
                    });
                    alertPopup.then(function (res) {
                        console.log('Public Email Service Detected');
                    });

                }
                else {
                    $scope.emailVerificationCode = data.verificationCode;
                    $ionicSlideBoxDelegate.next();
                    // $state.go('tab.email-Verification', { email: $scope.email, emailverificationCode: data.verificationCode, provider: $scope.provider });
                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );
        }


        $scope.resendEmailVerificationCode = function (emailverificationcode) {
            $ionicLoading.show({
                template: 'Resending email Validation code...'
            });
            EmailValidation.getByEmail({ email: $scope.data.email, customerId: localStorage.getItem("customerid") }).$promise.then(function (data) {
                $ionicLoading.hide();
                if (data.IsFreeEmail) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Public Email Service Detected',
                        template: 'Please enter your email that is issued by your school or company. If you do and still receive this message, please support.'

                    });
                    alertPopup.then(function (res) {
                        console.log('Public Email Service Detected');
                    });

                }
                else {
                    $scope.emailVerificationCode = data.verificationCode;

                    var alertPopup = $ionicPopup.alert({
                        title: 'Email Validation Code Resent',
                        template: 'Please re-enter the verification code sent to your email -' + $scope.data.email

                    });
                    alertPopup.then(function (res) {
                        console.log('verification code sent');
                    });

                    // $ionicSlideBoxDelegate.next();
                    // $state.go('tab.email-Verification', { email: $scope.email, emailverificationCode: data.verificationCode, provider: $scope.provider });
                }

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );

        }

        $scope.verifyEmailCode = function (emailverificationcode) {
            //$scope.emailverificationcode = emailverificationcode;

            if ($scope.emailVerificationCode == $scope.data.emailverificationcode) {

                $scope.customer.isEmailVerified = true;

                $scope.customer.$update().then(function (info) {
                    Organization.getByProvider({ provider: $scope.provider, p: 1 }).$promise.then(function (data) {
                        if (data.Id == null) {
                            // $state.go('tab.Organization', { provider: x });

                            $scope.data.OrganizationEmailDomain = $scope.provider;
                            $scope.organization = new Organization({
                                Id: '',
                                OrganizationName: '',
                                OrganizationLocation: [],
                                OrganizationEmailDomain: []
                            });
                            $ionicSlideBoxDelegate.next();
                        }
                        else {
                            $scope.orgID = data.Id;
                            $scope.customer.customerOrganization = data;
                            $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];
                            $scope.customerSave($scope.customer);
                            var alertPopup = $ionicPopup.alert({
                                title: 'Email Saved',
                                template: 'Email and Organization Information is Saved!'

                            });
                            alertPopup.then(function (res) {
                                console.log('verification code sent');
                                if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                                else $state.go('tab.account', {}, { reload: true });

                            });
                        }

                    });
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );//end of Account Update

            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Warning Message!',
                    template: 'Invalid Code. Please re-enter the Correct validation code'
                });
                alertPopup.then(function (res) {

                });


            }

        }
        $scope.skipEmailVerification = function (email) {

            $scope.customer.isEmailVerified = false;

            $scope.customer.$update().then(function (info) {
                Organization.getByProvider({ provider: $scope.provider, p: 1 }).$promise.then(function (data) {
                    if (data.Id == null) {
                        // $state.go('tab.Organization', { provider: x });

                        $scope.data.OrganizationEmailDomain = $scope.provider;
                        $scope.organization = new Organization({
                            Id: '',
                            OrganizationName: '',
                            OrganizationLocation: [],
                            OrganizationEmailDomain: []
                        });
                        $ionicSlideBoxDelegate.next();
                    }
                    else {
                        $scope.orgID = data.Id;
                        $scope.customer.customerOrganization = data;
                        $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];
                        $scope.customerSave($scope.customer);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Email Saved',
                            template: 'Email and Organization Information is Saved!'

                        });
                        alertPopup.then(function (res) {
                            console.log('Email Saved');
                            if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                            else $state.go('tab.account', {}, { reload: true });

                        });

                    }

                });
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );//end of Account Update

        }
        $scope.organizationSave = function (org) {

            $scope.organization.OrganizationLocation.splice(0, 0, $scope.data.OrganizationLocation);
            $scope.organization.OrganizationEmailDomain.splice(0, 0, $scope.data.OrganizationEmailDomain);
            $scope.organization.$save().then(function (info) {
                $scope.orgID = info.Id;
                $scope.customer.customerOrganization = info;
                $scope.customer.EndLocation = $scope.customer.customerOrganization.OrganizationLocation[0];
                $scope.customerSave($scope.customer);
                var alertPopup = $ionicPopup.alert({
                    title: 'Email Saved',
                    template: 'Email and Organization Information is Saved!'

                });
                alertPopup.then(function (res) {
                    console.log('Email Saved');
                    if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                    else $state.go('tab.account', {}, { reload: true });

                });



            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );

        }

        $scope.customerSave = function (cust) {
            $ionicLoading.show({
                template: 'Saving your info...'
            });
            if ($scope.data.selectedContacts.length > 0) $scope.customer.Contacts = $scope.data.selectedContacts;

            $scope.customer.$update().then(function (info) {
                $ionicLoading.hide();
                //  $state.go('tab.dash');


            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );


        }
        $scope.customersaveandgo = function (cust) {
            $scope.customerSave(cust);
            var alertPopup = $ionicPopup.alert({
                title: 'Info Saved!',
                template: 'Thank You. You profile is updated!'
            });
            alertPopup.then(function (res) {
                $state.go('tab.account', {}, { reload: true });
            });

        }


    }
       



    }])
    .controller('CustInfoCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', '$ionicModal', 'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB', 'Geo', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, $ionicModal, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB, Geo, ConnectivityMonitor) {
        Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
            $scope.customer = data;
            if ($scope.customer.Contacts != null) $scope.data.selectedContacts = $scope.customer.Contacts;
            if ($scope.customer.Distance <= 0) $scope.calculateDistance('server');
            if ($scope.customer.CostPerRide > 0 && ($scope.customer.PlatformFeePerRide <= 0 || $scope.customer.TotalCostPerRide < 0)) $scope.calculateFees();
            if ($scope.customer.CustomerSchedule != null) {
                //  $scope.Schedule = $scope.customer.CustomerSchedule;
                if ($scope.customer.CustomerSchedule.Sunday || $scope.customer.CustomerSchedule.Monday || $scope.customer.CustomerSchedule.Tuesday || $scope.customer.CustomerSchedule.Wednesday || $scope.customer.CustomerSchedule.Thursday || $scope.customer.CustomerSchedule.Friday || $scope.customer.CustomerSchedule.Friday) {
                    $scope.Schedule.Sunday = $scope.customer.CustomerSchedule.Sunday;
                    $scope.Schedule.Monday = $scope.customer.CustomerSchedule.Monday;
                    $scope.Schedule.Tuesday = $scope.customer.CustomerSchedule.Tuesday;
                    $scope.Schedule.Wednesday = $scope.customer.CustomerSchedule.Wednesday;
                    $scope.Schedule.Thursday = $scope.customer.CustomerSchedule.Thursday;
                    $scope.Schedule.Friday = $scope.customer.CustomerSchedule.Friday;
                    $scope.Schedule.Saturday = $scope.customer.CustomerSchedule.Saturday;

                }
                $scope.slotsWorkboundDeparture.callback($scope.customer.CustomerSchedule.WorkboundDepartureTime);
                $scope.slotsWorkboundArrival.callback($scope.customer.CustomerSchedule.WorkboundArrivalTime);
                $scope.slotsHomeboundDeparture.callback($scope.customer.CustomerSchedule.HomeboundDepartureTime);
                $scope.slotsHomeboundArrival.callback($scope.customer.CustomerSchedule.HomeboundArrivalTime);

            }
            $ionicLoading.hide();

        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        });
        $scope.customerSave = function (cust) {
            //$scope.customer.EndLocation = $scope.data.selectedEndLocation;
            // $scope.ride.RideDate = $scope.data.rideDate;

            $ionicLoading.show({
                template: 'Saving your info...'
            });
            $scope.customer.$update().then(function (info) {
                $ionicLoading.hide();
                 $state.go('tab.account', {}, { reload: true });
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );


        }
    }])

.controller('CustomerEditSlideCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', '$ionicModal', 'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB', 'Geo', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, $ionicModal, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB, Geo, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        });
        $scope.mobileverificationcode = "";
        $scope.mobilenumber = $stateParams.mobileNumber;
        $scope.customerID = $stateParams.customerID;
      //  $scope.verificationCode = $stateParams.verificationCode;
        //$scope.slots = {
        //    epochTime: 27000, format: 12, step: 1
        //};

        //$scope.timePickerCallback = function (val) {
        //    if (typeof (val) === 'undefined') {
        //        console.log('Time not selected');
        //    } else {
        //        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
        //    }
        //};
        $scope.data = {
            email: '',
            mobileverificationcode: '',
            emailverificationcode: '',
            skipEmailVerification: false,
            OrganizationLocation: '',
            OrganizationEmailDomain: '',
            selectedContacts: [],
            showDelete: false

        }
        $scope.Schedule = {

            WorkboundDepartureTime: 27000,
            WorkboundArrivalTime: 30600,
            HomeboundDepartureTime: 63000,
            HomeboundArrivalTime: 66600,
            Sunday: false,
            Monday: true,
            Tuesday: true,
            Wednesday: true,
            Thursday: true,
            Friday: true,
            Saturday: false
        }

        $scope.slotsWorkboundDeparture = {
            inputEpochTime: $scope.Schedule.WorkboundDepartureTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                if (val > 0) {
                    $scope.Schedule.WorkboundDepartureTime = val;
                    if ($scope.customer != undefined)
                        $scope.customer.CustomerSchedule.WorkboundDepartureTime = val;
                }
            }
        };
        $scope.slotsWorkboundArrival = {
            inputEpochTime: $scope.Schedule.WorkboundArrivalTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                if (val > 0) {
                    $scope.Schedule.WorkboundArrivalTime = val;
                    if ($scope.customer != undefined && val > 0)
                        $scope.customer.CustomerSchedule.WorkboundArrivalTime = val;
                }
            }
        };
        $scope.slotsHomeboundDeparture = {
            inputEpochTime: $scope.Schedule.HomeboundDepartureTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                if (val > 0) {
                    $scope.Schedule.HomeboundDepartureTime = val;
                    if ($scope.customer != undefined)
                        $scope.customer.CustomerSchedule.HomeboundDepartureTime = val;
                }
            }
        };
        $scope.slotsHomeboundArrival = {
            inputEpochTime: $scope.Schedule.HomeboundArrivalTime,  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: '12-hour Format',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory

                // $scope.slotsHomebound.inputEpochTime = val;
                if (val > 0) {
                    $scope.Schedule.HomeboundArrivalTime = val;
                    if ($scope.customer != undefined)
                        $scope.customer.CustomerSchedule.HomeboundArrivalTime = val;
                }
            }
        };

        $ionicLoading.show({
            template: 'Loading...'
        });



        Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
            $scope.customer = data;
            if ($scope.customer.Contacts != null) $scope.data.selectedContacts = $scope.customer.Contacts;
            if ($scope.customer.Distance <= 0) $scope.calculateDistance('server');
            if ($scope.customer.CostPerRide > 0 && ($scope.customer.PlatformFeePerRide <= 0 || $scope.customer.TotalCostPerRide < 0)) $scope.calculateFees();
            if ($scope.customer.CustomerSchedule != null) {
                //  $scope.Schedule = $scope.customer.CustomerSchedule;
                if ($scope.customer.CustomerSchedule.Sunday || $scope.customer.CustomerSchedule.Monday || $scope.customer.CustomerSchedule.Tuesday || $scope.customer.CustomerSchedule.Wednesday || $scope.customer.CustomerSchedule.Thursday || $scope.customer.CustomerSchedule.Friday || $scope.customer.CustomerSchedule.Friday) {
                    $scope.Schedule.Sunday = $scope.customer.CustomerSchedule.Sunday;
                    $scope.Schedule.Monday = $scope.customer.CustomerSchedule.Monday;
                    $scope.Schedule.Tuesday = $scope.customer.CustomerSchedule.Tuesday;
                    $scope.Schedule.Wednesday = $scope.customer.CustomerSchedule.Wednesday;
                    $scope.Schedule.Thursday = $scope.customer.CustomerSchedule.Thursday;
                    $scope.Schedule.Friday = $scope.customer.CustomerSchedule.Friday;
                    $scope.Schedule.Saturday = $scope.customer.CustomerSchedule.Saturday;

                }
                $scope.slotsWorkboundDeparture.callback($scope.customer.CustomerSchedule.WorkboundDepartureTime);
                $scope.slotsWorkboundArrival.callback($scope.customer.CustomerSchedule.WorkboundArrivalTime);
                $scope.slotsHomeboundDeparture.callback($scope.customer.CustomerSchedule.HomeboundDepartureTime);
                $scope.slotsHomeboundArrival.callback($scope.customer.CustomerSchedule.HomeboundArrivalTime);

            }
            $ionicLoading.hide();

        }, function (error) {
            $ionicLoading.hide();
            if (error.data == null) {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-appserverunavailable.html'
                })
              .then(function (res) {
                  $state.go('security');
                  return true;

              });

            }
            else {
                $ionicPopup.alert({
                    title: applicationConfig.errorPopupTitle,
                    templateUrl: 'templates/error-application.html'
                })
              .then(function (res) {
                  return true;
              });

            }
            console.log(error);

        }

        );



        $scope.calculateDistance = function (changedLocation) {
            try {
                var fromLat = isNaN($scope.customer.HomeLocation.geometry.location.lat) ? $scope.customer.HomeLocation.geometry.location.lat() : $scope.customer.HomeLocation.geometry.location.lat;
                var fromLng = isNaN($scope.customer.HomeLocation.geometry.location.lng) ? $scope.customer.HomeLocation.geometry.location.lng() : $scope.customer.HomeLocation.geometry.location.lng;

                var toLat = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lat() : $scope.customer.EndLocation.geometry.location.lat;
                var toLng = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lng() : $scope.customer.EndLocation.geometry.location.lng;
                if (fromLat != 0 && fromLng != 0 && toLat != 0 && toLng != 0) {
                    var distance = Geo.getDistance(fromLat, fromLng, toLat, toLng, 'M');
                    $scope.customer.Distance = parseFloat(distance).toFixed(2);

                    if ($scope.customer.CostPerRide == 0) {

                        $scope.customer.CostPerRide = (parseFloat($scope.customer.Distance / 4).toFixed(2)) / 1;
                        $scope.calculateFees();
                    }


                }

            }
            catch (ex) {
                console.log('Distance could not be set');
            }
        }
        $scope.calculateFees = function () {
            var flatfees = parseFloat($scope.customer.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
            var fees = parseFloat((($scope.customer.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
            $scope.customer.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
            var totalfees = parseFloat($scope.customer.PlatformFeePerRide) + parseFloat($scope.customer.CostPerRide);
            $scope.customer.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
        }



        $scope.customerSave = function (cust) {
            //$scope.customer.EndLocation = $scope.data.selectedEndLocation;
            // $scope.ride.RideDate = $scope.data.rideDate;

            $ionicLoading.show({
                template: 'Saving your info...'
            });
            if ($scope.data.selectedContacts.length > 0) $scope.customer.Contacts = $scope.data.selectedContacts;
            $scope.customer.CustomerSchedule = $scope.Schedule;
            $scope.customer.$update().then(function (info) {
                $scope.calculateFees();
                $ionicLoading.hide();
                //  $state.go('tab.dash');
                $ionicSlideBoxDelegate.next();

            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );


        }

        $scope.customersaveandgo = function (cust) {
            $scope.customerSave(cust);
            var alertPopup = $ionicPopup.alert({
                title: 'Info Saved!',
                template: 'Thank You. You profile is updated!'
            });
            alertPopup.then(function (res) {
                $state.go('tab.account', {}, { reload: true });
            });

        }

        $scope.fbLogin = function () {
            ngFB.login({ scope: 'email,publish_actions' }).then(
                function (response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        $scope.closeLogin();
                    } else {
                        alert('Facebook login failed');
                    }
                });
        };
        $scope.pickContact = function () {

            ContactsService.pickContact().then(
                function (con) {

                    var contact = {};
                    console.log('In  Contact');

                    console.log('DisplayName-' + con.displayName);
                    contact.DisplayName = con.displayName;
                    contact.DisplayName = contact.DisplayName.replace("undefined", "");

                    if (con.emails != null && con.emails.length > 0)
                        contact.Email = con.emails[0].value;

                    if (con.photos != null && con.photos.length > 0)
                        contact.Photo = con.photos[0].value;
                    contact.isSaved = false;
                    if ((con.phones != null && con.phones.length > 0)) {
                        contact.Phone = con.phones[0].value;
                        angular.forEach(con.phones, function (pn) {
                            console.log('In  Phone');
                            if (pn.type == 'mobile') {
                                console.log('Found Mobile');
                                contact.MobileExists = true;
                                contact.MobileNumber = pn.value;
                                if (pn.pref == true) return false;//similar to continue
                            }
                        })
                    }

                    if (contact.MobileExists) {
                        // convert to international format
                        // if (contact.MobileNumber.length == 10) contact.MobileNumber = '1' + contact.MobileNumber;
                        contact.MobileNumber = intlTelInputUtils.formatNumberByType(contact.MobileNumber, "US");
                    }
                    // $scope.data.contacts.push(contact);
                    $scope.contact = contact;
                    $scope.openModal();



                },
                function (failure) {
                    console.log("Bummer.  Failed to pick a contact");
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bummer',
                        template: 'Failed to pick a contact.You can enter the contact details manually'
                    });
                    alertPopup.then(function (res) {
                        console.log('Failed to pick a contact');
                        $scope.contact = { DisplayName: '', MobileNumber: '', isSaved: false };
                        $scope.openModal();
                    });
                }
            );

        };

        $ionicModal.fromTemplateUrl('./templates/contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })
        $scope.onContactDelete = function (contact) {


            var confirmPopup = $ionicPopup.confirm({
                title: 'Contact will be Removed',
                template: 'Are you sure you want to remove this Contact? Press OK to confirm.'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    index = $scope.data.selectedContacts.indexOf(contact);
                    if (index >= 0)
                        $scope.data.selectedContacts.splice(index, 1);
                    console.log('You are sure');
                    // Call Deactivate service
                } else {
                    console.log('You are not sure');
                }
            });




        }
        $scope.openModal = function () {
            $scope.modal.show()
        }

        $scope.closeModal = function () {
            // $scope.data.contacts.push(contact);
            //if ($scope.contact.MobileNumber.charAt(0) === '+') {
            //    //Mobile Number is manually entered
            //    $scope.contact.MobileNumber = $scope.contact.MobileNumber.substr(1);
            //    $scope.contact.MobileExists = true;
            //}
            //if ($scope.contact.MobileNumber.length == 10) {
            //    //Add Default Country code 1
            //    $scope.contact.MobileNumber = '1'+$scope.contact.MobileNumber;
            //    $scope.contact.MobileExists = true;
            //}

            if ($scope.contact.isSaved == false) {

                var index = $scope.data.selectedContacts.indexOf($scope.contact); // Change to filter by DisplayNAme +mobileNumber only.

                if (index < 0) {
                    if ($scope.contact.MobileExists || ($scope.contact.MobileNumber != undefined && $scope.contact.MobileNumber != '')) {
                        $scope.data.selectedContacts.push($scope.contact);
                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Mobile Number is Required!',
                            template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
                        });

                    }
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Selected Contact is already a member!',
                        template: 'Changes Saved. If you wish to un-enroll this contact from the carpool, please remove from the members list'
                    });

                }
            }

            $scope.modal.hide();
        };

        $scope.editContact = function (contact) {
            $scope.contact = contact;
            $scope.openModal();
        }

    }

}])
.controller('SearchCtrl', ['$ionicPlatform', '$scope', '$http', '$state', '$stateParams', '$ionicPopup','$ionicModal', '$ionicLoading','$ionicPopover', 'applicationConfig', 'EmailValidation','CustomerPaymentMethod', 'Account', 'SignalRSvc', 'Carpool', 'Ride','Encounter','VideoCall', 'ConnectivityMonitor', function ($ionicPlatform,$scope, $http, $state, $stateParams, $ionicPopup,$ionicModal, $ionicLoading,$ionicPopover, applicationConfig, EmailValidation, CustomerPaymentMethod, Account, SignalRSvc, Carpool, Ride,Encounter,VideoCall, ConnectivityMonitor) {
    $ionicPlatform.ready(function () {
        if (ConnectivityMonitor.isOffline()) {
            $state.go('errorconnection');
        }
        else {


            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth();
            var yyyy = today.getFullYear();

            $scope.CustomerID = localStorage.getItem("customerid");
            $scope.data = {};
            $scope.data.showSearch = true;
            $scope.data.toggleString = "Hide";
            $scope.data.ridedate = new Date(yyyy, mm, dd);
            $scope.datepickerObject = {
                titleLabel: 'Ride Date',  //Optional            
                inputDate: $scope.data.ridedate,  //Optional           
                callback: function (val) {  //Mandatory
                    //datePickerCallback(val);
                    if (val != undefined && val != null) {
                        $scope.data.ridedate = val;
                        $scope.datepickerObject.inputDate = val;
                        
                    }

                }

            };


            $scope.data.fromWithinRadiusOf = 150;
            $scope.data.toWithinRadiusOf = 1;
            $scope.map = { center: { latitude: 40.1451, longitude: -99.6680 }, zoom: 16, bounds: {} };
            $scope.options = { scrollwheel: true };
            $scope.showMap = false;
            $scope.showList = true;
            $scope.RequestCount = 0;
            $scope.showInvitations = false;
            $scope.showSection = function (sec) {
                $scope.showMap = false;
                $scope.showList = false;
                $scope.showInvitations = false;
                switch (sec) {
                    case 'map': $scope.showMap = true; break;
                    case 'list': $scope.showList = true; break;
                    case 'invitation': $scope.showInvitations = true; break;
                }

            }
            var createMarker = function (ride) {
                idKey = "id";

                var ret = {
                    latitude: ride.Provider.EndLocation.geometry.location.lat,
                    longitude: ride.Provider.EndLocation.geometry.location.lng,
                    icon: ride.Type == 'Carpool' ? 'img/van.png' : 'img/car.png',
                    ride: ride,
                    ridedate: $scope.data.ridedate,
                    EndLocation: ride.Provider.EndLocation,
                    CostPerRide: ride.CostPerRide,
                    TotalCostPerRide:ride.TotalCostPerRide,
                    displayname: ride.Provider.FirstName + ' ' + ride.Provider.LastName,
                    providerId: ride.Provider.Id,
                    show: false

                };
                ret[idKey] = ride.Provider.EndLocation.place_id;
                return ret;
            };
            $scope.onClick = function (marker, eventName, model) {
                console.log("Clicked!");
                model.show = !model.show;
            };
            $scope.initiateCall = function (item,typeOE){
                if(item.Provider.TotalCostPerRide>0){
                CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                    if (!(data.PaymentMethodID == undefined)) {
                        
                        //   initiateVideoCall();
                        //videochatsubscriberNew
                        $state.go('tab.search.videochatsubscriberNew', { "id": item.Provider.Id, "displayname": item.Provider.FirstName + ' ' + item.Provider.LastName, "type": typeOE });


                    }
                    else {
                        $ionicLoading.hide();
                        var PopUpMessage = '';

                        PopUpMessage = 'We need a Credit card to be on our file before you can request a Video Consultation. Credit card will be charged later, during the Video Consultation ';
                        var alertPopup = $ionicPopup.alert({
                            title: 'Credit Card Required!',
                            template: PopUpMessage
                        });
                        alertPopup.then(function (res) {
                            console.log("Credit Card Required");
                            //$scope.ride.CarpoolMembers = [];
                            //$scope.data.contacts = [];
                            $state.go('tab.search.payments');

                        });

                    }



                }, function (error) {
                });
                }
                else
                {
                // initiateVideoCall();
                    $state.go('tab.search.videochatsubscriberNew', { "id": item.Provider.Id, "displayname": item.Provider.FirstName + ' ' + item.Provider.LastName, "type": typeOE });


                }
        
            }
            $scope.goToProvDet=function(item)
            {
               
                 $state.go('tab.search.providerDetails',{"providerId":item.Provider.Id,"appointmentDate":new Date()});
               
            }
            var markers = [];
            $scope.randomMarkers = [];
            // Get the bounds from the map once it's loaded

            $scope.toggleShowSearch = function (flag) {
                $scope.data.showSearch = flag;
                $scope.data.toggleString = flag ? "Hide" : "Show";

            }
            $scope.close=function()
            {
                $scope.modal.hide();
                $scope.modal.remove();
            }
            $scope.walkinCall=function()
                  {
                     // $scope.modal.hide();
              //  $scope.modal.remove();
                       CustomerPaymentMethod.get({ Id: localStorage.getItem('customerid') }).$promise.then(function (data) {
                if (!(data.PaymentMethodID == undefined)) {
                    
                     //   initiateVideoCall();
                      $state.go('tab.search.videochatsubscriberNew', { "id":'NA',"displayname":' ' ,"type":'Pool'});


                }
                else {
                   // $ionicLoading.hide();
                    var PopUpMessage = '';

                    PopUpMessage = 'We need a Credit card to be on our file before you can request a ride. Credit card will be charged later, during the ride ';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credit Card Required!',
                        template: PopUpMessage
                    });
                    alertPopup.then(function (res) {
                        console.log("Credit Card Required");
                        //$scope.ride.CarpoolMembers = [];
                        //$scope.data.contacts = [];
                        $state.go('tab.search.payments');

                    });

                }



            }), function (error) {
            };}
            if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != "") {
                if (localStorage.getItem("isProvider")=="true"){
                    $state.go('tab.account', {}, { reload: true })
                }
                $ionicLoading.show({
                    template: 'loading'
                })
                Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
                    $ionicLoading.hide();
                    if (data.email == null && data.isProvider) {
                        //$ionicPopup.alert({
                        //    title: 'Account Setup is not Finished!',
                        //    template: 'We need a little more information from you before you can start zipcommuting!'
                        //})
                        //.then(function (res) {
                        //    $state.go('tab.search.emaillogin', {}, { reload: true });
                        //    return true;

                        //});
                        if($scope.modal.isShown())
                        {
                            $scope.modal.hide();
                            $scope.modal.remove();
                        }
                        $state.go('tab.account.emaillogin', {}, { reload: true });

                    }
                    else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") {
                        //$ionicPopup.alert({
                        //    title: 'Account Setup is not Finished!',
                        //    template: 'We need a little more information from you before you can start zipcommuting!'
                        //})
                        //.then(function (res) {
                        //    $state.go('tab.search.customeredit', {}, { reload: true }); return true;

                        //});
                        if($scope.modal.isShown())
                        {
                            $scope.modal.hide();
                            $scope.modal.remove();
                        }
                        if(data.isProvider)
                        {

                            $state.go('tab.account.customeredit', {}, { reload: true }); return true;
                        }
                        else{$state.go('tab.CustInfo');}
                    }
                    else {
                        $scope.customer = data;
                        $scope.map.center.latitude = data.HomeLocation.geometry.location.lat;
                        $scope.map.center.longitude = data.HomeLocation.geometry.location.lng;

                        $scope.data.StartAddress = data.HomeLocation == undefined ? '' : data.HomeLocation;
                        $scope.data.EndAddress = data.EndLocation == undefined ? '' : data.EndLocation;

                        $scope.data.WorkboundDepartureTime = data.CustomerSchedule == undefined || data.CustomerSchedule.WorkboundDepartureTime == undefined ? 27000 : data.CustomerSchedule.WorkboundDepartureTime;
                        $scope.data.WorkboundArrivalTime = data.CustomerSchedule == undefined || data.CustomerSchedule.WorkboundArrivalTime == undefined ? 30600 : data.CustomerSchedule.WorkboundArrivalTime;
                        $scope.data.HomeboundDepartureTime = data.CustomerSchedule == undefined || data.CustomerSchedule.HomeboundDepartureTime == undefined ? 63000 : data.CustomerSchedule.HomeboundDepartureTime;
                        $scope.data.HomeboundArrivalTime = data.CustomerSchedule == undefined || data.CustomerSchedule.HomeboundArrivalTime == undefined ? 66600 : data.CustomerSchedule.HomeboundArrivalTime;
                        if ($scope.data.StartAddress != '' && $scope.data.EndAddress != '') {
                            $scope.toggleShowSearch(false);
                            $scope.getRide();
                        }
                        $scope.getRideRequestsAndCarpoolInvites();
                    }

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                        if($scope.modal.isShown())
                        {
                            $scope.modal.hide();
                            $scope.modal.remove();
                        }
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );
            }
            else {
                //$ionicLoading.hide();
                //$ionicPopup.alert({
                //    title: 'Oops!',
                //    template: 'We need to Authenticate your mobile number again'
                //})
                //           .then(function (res) {

                //               localStorage.setItem("access_token", "");
                //               localStorage.setItem("username", "");
                //               localStorage.setItem("customerid", "");
                //               $state.go('tab.search.mobilelogin');
                //               return true;

                //           });

                $state.go('tab.account.mobilelogin');

            }

            $scope.selectedType = 'NA';
            $scope.membercarpools = '';
            $scope.slots = {
                epochTime: 27000, format: 12, step: 1
            };
            $scope.timePickerCallback = function (val) {
                if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
                }
            };
            function isFunction(functionToCheck) {
                var getType = {};
                return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
            }

            $scope.getRide = function () {

                var temp = new Date($scope.data.ridedate);
                temp=temp.toDateString();
                var lat = isFunction($scope.data.StartAddress.geometry.location.lat)? $scope.data.StartAddress.geometry.location.lat(): $scope.data.StartAddress.geometry.location.lat;
                var lng = isFunction($scope.data.StartAddress.geometry.location.lng)? $scope.data.StartAddress.geometry.location.lng(): $scope.data.StartAddress.geometry.location.lng
                
              
                Encounter.GetProviderByDateAndLocation({ serviceDate: new Date(temp).toDateString(), fromLatitude: lat, fromLongitude: lng, 
                    searchRadius: $scope.data.fromWithinRadiusOf}).$promise.then(function (data) {
                    $scope.rides = data;
                    markers = [];
                    $scope.randomMarkers = [];
                    angular.forEach(data, function (ride) {
                        markers.push(createMarker(ride));
                    });
                    $scope.randomMarkers = markers;
                    if ($scope.showMap) $scope.toggleShowSearch(false);
                    // $scope.map.fitBounds($scope.map.bounds);
                    //$scope.map.control.refresh($scope.map.center)

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                        if($scope.modal.isShown())
                        {
                            $scope.modal.hide();
                            $scope.modal.remove();
                        }
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );

            }
            
            $scope.getRideRequestsAndCarpoolInvites = function () {
                var temp = new Date($scope.data.ridedate).toDateString();

                Ride.GetRideRequestsAndCarpoolInvites({ customerID: localStorage.getItem("customerid"), rideDate: new Date(temp).toDateString(), type: 'type', flag: 'flag' }).$promise.then(function (data) {
                    $scope.requestRides = data.Rides;
                    $scope.carpoolInvites = data.Carpools;
                    $scope.RequestCount = data.Rides.length + data.Carpools.length;

                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }

                );

            }
             // if (localStorage.getItem("isProvider")!="true")
             //   {  
             //       $ionicModal.fromTemplateUrl('./templates/searchOptions.html', {
             //           scope: $scope,
             //           animation: 'slide-in-up'
             //       }).then(function (modal) {
             //           $scope.modal = modal
                        
             //           $scope.modal.show();
                        
             //       }, function (error) {
             //           console.log(error);
             //       });
            //}
            
            $scope.popover = $ionicPopover.fromTemplateUrl('./templates/SearchPopOver.html', {

                scope: $scope,
                "backdropClickToClose": false
            }).then(function (popover) {
                $scope.popover = popover;
            });

            $scope.searchAndFindPopOver = function ($event) {
                $scope.popover.show($event);

            }


           
            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function () {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function () {
                // Execute action
            });

            $scope.calculateFees = function () {
                $scope.customer.PlatformFeePerRide = ($scope.customer.CostPerRide * $scope.customer.PlatformFeePercentage) + $scope.customer.PlatformFeeFlat;
                $scope.customer.TotalCostPerRide = $scope.customer.CostPerRide + $scope.customer.PlatformFeePerRide;
            }


        }
    });
  
}])
.controller('infoWindowCtrl', function ($scope, $state, ConnectivityMonitor) {
    $scope.ride = $scope.$parent.model;
    $scope.viewDetails = function (type) {
        //alert($scope.$parent.model.url);

        var ride = $scope.$parent.model;
        
        var id = ride.providerId;// != null && ride.id != '') ? ride.id : (ride.Type == 'Carpool' ? ride.CarpoolID : ride.CustomerID);
       
        var ridedate = $scope.$parent.model.ridedate.toDateString();
        var displayname = $scope.$parent.model.displayname;
        if (type == 'appointment')
            $state.go('tab.search.providerDetails', { "providerId": id, "appointmentDate": ridedate });
        else
            $state.go('tab.search.videochatsubscriberNew', { "id": id, "displayname": displayname, "type": 'Walkin' });

       
        //$state.go('tab.search.videochatsubscriber', {"id":id, "displayname":displayname});
    }
})

.controller('PaymentsCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$braintree', '$ionicHistory','applicationConfig', 'CustomerPaymentMethod', 'Account', 'ConnectivityMonitor', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $braintree,$ionicHistory, applicationConfig, CustomerPaymentMethod, Account, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else {
        $scope.card = {
            firstname: '',
            lastname: '',
            address: {},
            number: '',
            cvc: '',
            exp_month: '',
            exp_year: '',
            brand: ''
        };

        $scope.onFileCard = {
            exists: false,
            firstname: '',
            lastname: '',
            address: {},
            last4: '',
            exp_month: '',
            exp_year: '',
            brand: ''
        };
        var client;
        var startup = function () {
            $braintree.getClientToken().success(function (token) {
                client = new $braintree.api.Client({
                    clientToken: token
                });
            });
        }
        startup();

        if (localStorage.getItem("customerid") != null) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                $scope.card.firstname = info.FirstName;
                $scope.card.lastname = info.LastName;
                $scope.card.address = info.HomeLocation;
                CustomerPaymentMethod.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
                    if (!(data.PaymentMethodID == undefined)) {
                        $scope.onFileCard.exists = true;
                        $scope.onFileCard.firstname = data.CCFirstName;
                        $scope.onFileCard.lastname = data.CCLastName;
                        $scope.onFileCard.address = data.CCAddress;

                        $scope.onFileCard.last4 = data.last4;
                        $scope.onFileCard.exp_month = data.expirationMonth;
                        $scope.onFileCard.exp_year = data.expirationYear;
                        $scope.onFileCard.brand = data.brand;
                    }
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    if (error.data == null) {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-appserverunavailable.html'
                        })
                      .then(function (res) {
                          $state.go('security');
                          return true;

                      });

                    }
                    else {
                        $ionicPopup.alert({
                            title: applicationConfig.errorPopupTitle,
                            templateUrl: 'templates/error-application.html'
                        })
                      .then(function (res) {
                          return true;
                      });

                    }
                    console.log(error);

                }
                );
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }

            );
        }

        $scope.savePayments = function (frmCard) {
            $ionicLoading.show({
                template: 'Saving Card Info...'
            });
            $scope.card.brand = frmCard.cardNumber.$ccType;
            //if (applicationConfig.paymentGateway == 'stripe') {

            //    stripe.card.createToken($scope.card)
            //   .then(function (response) {

            //       console.log('token created for card ending in ', response.card.last4 + "-" + response.id);



            //       $scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), last4: response.card.last4, funding: response.card.funding, brand: response.card.brand, SingleUseToken: response.id, PaymentMethodType: 'stripe' });
            //       $scope.CustomerPaymentMethod.$update().then(function (info) {
            //       })
            //       .error(function (error) {
            //           //alert('Could not login');
            //           $ionicPopup.alert({
            //               title: 'Error Message!',
            //               template: error.error_description
            //           });
            //           alertPopup.then(function (res) {
            //               console.log('Could not Authenticate');
            //           });




            //       });

            //   })
            //   .then(function (payment) {
            //       console.log('successfully submitted payment for $', payment.amount);
            //   })
            //  .catch(function (err) {
            //      if (err.type && /^Stripe/.test(err.type)) {
            //          console.log('Stripe error: ', err.message);
            //      }
            //      else {
            //          console.log('Other error occurred, possibly with your API', err.message);
            //      }
            //  });

            //}
            //else
            if (applicationConfig.paymentGateway == 'braintree') {
                client.tokenizeCard({
                    number: $scope.card.number,
                    expirationMonth: $scope.card.exp_month,
                    expirationYear: $scope.card.exp_year
                }, function (err, nonce) {

                    // - Send nonce to your server (e.g. to make a transaction)
                    // $scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), last4: '', funding: '', brand: '', SingleUseToken: nonce,PaymentMethodType:'braintree' });
                    var last4 = $scope.card.number.slice(-4);
                    $scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), CCFirstName: $scope.card.firstname, CCLastName: $scope.card.lastname, CCAddress: $scope.card.address, last4: last4, expirationMonth: $scope.card.exp_month, expirationYear: $scope.card.exp_year, funding: '', brand: $scope.card.brand, SingleUseToken: nonce, PaymentMethodType: 'braintree' });

                    $scope.CustomerPaymentMethod.$update().then(function (info) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success Registering Card',
                            template: 'Your Card is Registered'
                        });
                        alertPopup.then(function (res) {
                            if ($ionicHistory.backTitle() == 'Attendance' || $ionicHistory.backTitle() == 'Carpool Info') $ionicHistory.goBack();
                            else
                            $state.go('tab.account', {}, { reload: true });
                        });

                    })
                    .error(function (error) {
                        //alert('Could not login');
                        $ionicPopup.alert({
                            title: 'Error Message!',
                            template: error.error_description
                        });
                        alertPopup.then(function (res) {

                            console.log('Could not Authenticate');
                        });




                    });

                });


                //$scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), CCFirstName: $scope.card.firstname, CCLastName: $scope.card.lastname, CCAddress: $scope.card.address, last4: $scope.card.number, expirationMonth: $scope.card.exp_month, expirationYear: $scope.card.exp_year, funding: '', brand: $scope.card.brand, SingleUseToken: '', PaymentMethodType: 'braintree' });
                //$scope.CustomerPaymentMethod.$update().then(function (info) {
                //    $ionicLoading.hide();
                //    $ionicPopup.alert({
                //        title: 'Success Registering Card!',
                //        template: 'Your Card is Registered'
                //    }).then(function (res) {

                //        $state.go('tab.account', {}, { reload: true });
                //    });               

                //   },
                //    function (error) {
                //        $ionicLoading.hide();
                //        //alert('Could not login');
                //        $ionicPopup.alert({
                //            title: 'Error Message!',
                //            template: error.error_description
                //        });




                //    });


            }

        }
    }

 }])
.controller('AccountsCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$ionicHistory','$ionicModal', '$ionicActionSheet', '$cordovaInAppBrowser','applicationConfig','Encounter','ReportSvc','VideoCall', 'Prescription','Account', 'ConnectivityMonitor',function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, $ionicModal,$ionicActionSheet,$cordovaInAppBrowser, applicationConfig,Encounter,ReportSvc,VideoCall,Prescription, Account, ConnectivityMonitor) {
    if (ConnectivityMonitor.isOffline()) {
        $state.go('errorconnection');
    }
    else 
    {
         $scope.$on('cloud:push:notification', function(event, data) {
            var msg = data.message;
            alert(msg.title + ': ' + msg.text);
            });
        $scope.data=
        {
            showPrescriptions:false,
            icontexturl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAIFCAYAAAAOdoP1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAMLmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarVd3VFN5t923JKGEGkBASuhNkF5EehcEpMNYCEmAUEIICSp2x2EUHLtYsKKjIo46FkDGgqiDbRDsfVAHlZFxsGBD5fuDgDN+7/3x1nq/tW7uXif77LPPuXfdtQ6g4c6TSApITaBQLJMmRARz09IzuKxOMKEPDTjAlMcvkQTFx8cAwND9H4cA3lwHAQBXHHkSSQH+b0dLICzhA0Q8gCxBCb8QIA4BtCFfIpUBjHYAFlNlEhnAeA1AR5qWngEwlQDo5AxiIwA6WYPYGYCONCkhBGCGAkpsHk+aA6jHA+CW8nNkgLoEgLNYIBID6lsA+PNzeQJAvRPAqMLCIgGgwQZgm/UPnZx/aWYNa/J4OcN4sBcAgFKoqERSwJuO/+9TWCAfqmEOgJ0rjUwAoAMQu/KLohMAsAHiqDgrNg6ANkCcFQkABb6dK49MVvB7+CUhGQD0ABICXmg0ACOA1JPnJwcpsCtPCgzyyViRLCpJgbOkRQkKfbJUXBAbo9BZmCuMGsKbhCVhiUOcbFF4FABNgDxUlpuUOuiTPF0qSokFoA6Q7SX5idGK3PtluSGxQxypPCEZgCVAvs6WhicMcij9wpKhvignPi8sEYA+QAXKcpMiB3OpNGFJWsyQB4EwNGzQAyUQipMV3iiZRBacoMgtlxTEK/jUJmFBRMLgnKn9JaWJQ7mXZdIkxcyph3m8cfGD/qk3Ell80qA3mkYMQhAKLuTgIgtFyIOoraehB1zFP+HgQYocCOGoiAxlpIIHKcTgIRFl+AtiCFEynBcMHqQQohRifBqODv46Ihs8SFEKIUqQj8eQopA2pP1pXzqG9qcDaX/alfamfYbyuBpDVZlhzFBmJDOcaTfsg48iFKAIUoj+h1g0CiCEHFIIIR7q4Yse4zGjg/GQcY3RybiFFPwBKURDrCmi+dKvnHMxHp2QK6YiRBbE6B7i0Na0K+1BB9N+tD/tAy6tRxvCkXanvekgOoD2pT1on385lA97+zLLr+sJIf5XP4q4ur26h8JF1vCTCRlmfa0S8o8ZCVCE6K+Z1ELqINVKnaTOUUepBnCpE1QjdZE6RjX84034A1LkDFdLgBBi5KMAoiGOc51zt/PH/6rOUziQQogSQCacJgOAkCLJdKkoJ1fGDZJICoTcKDHfaRTX1dnFE0hLz+AOfj5e6YEAQOid/xIrbgZ8KgAi50uMZwEceQxw3nyJWbwE2MuAY+18ubR0MEYDAAMq0IAODGACC9jCEa7whC8CEYZxiEMS0jEZfOSiEFJMxUzMQzkqsQyrsR6bsQ278BMOoAFHcRK/4gLacQ130IkuPEMv3qCfIAgWoUZwCAPClLAiHAhXwpvwJ8KIGCKBSCcyiRxCTMiJmcS3RCWxglhPbCVqiZ+JI8RJ4hzRQdwiHhDdxEviA0mRbFKHNCatydGkNxlERpNJ5CQyhywmy8gF5BJyLVlD7iHryZPkBfIa2Uk+I/soUKqUHmVGOVLeVAgVR2VQ2ZSUmk1VUFVUDbWXaqJaqStUJ9VDvaeZNIfm0o60Lx1JJ9N8upieTS+m19O76Hr6NH2FfkD30p8ZagwjhgNjDCOKkcbIYUxllDOqGDsYhxlnGNcYXYw3TCZTj2nD9GJGMtOZecwZzMXMjcx9zGZmB/MRs4/FYhmwHFh+rDgWjyVjlbPWsfawTrAus7pY75RUlUyVXJXClTKUxErzlaqUdisdV7qs9ESpX1lT2Up5jHKcskB5uvJS5e3KTcqXlLuU+1W0VGxU/FSSVPJU5qmsVdmrckblrsorVVVVc1Uf1QmqItW5qmtV96ueVX2g+p6tzbZnh7AnsuXsJeyd7Gb2LfYrNTU1a7VAtQw1mdoStVq1U2r31d6pc9Sd1KPUBepz1KvV69Uvqz/XUNaw0gjSmKxRplGlcVDjkkaPprKmtWaIJk9ztma15hHNG5p9WhwtF604rUKtxVq7tc5pPdVmaVtrh2kLtBdob9M+pf2IQ3EsOCEcPudbznbOGU6XDlPHRidKJ0+nUucnnTadXl1tXXfdFN1putW6x3Q79Sg9a70ovQK9pXoH9K7rfRhhPCJohHDEohF7R1we8VZ/pH6gvlC/Qn+f/jX9DwZcgzCDfIPlBg0G9wxpQ3vDCYZTDTcZnjHsGakz0nckf2TFyAMjbxuRRvZGCUYzjLYZXTTqMzYxjjCWGK8zPmXcY6JnEmiSZ7LK5LhJtynH1N9UZLrK9ITpn1xdbhC3gLuWe5rba2ZkFmkmN9tq1mbWb25jnmw+33yf+T0LFQtvi2yLVRYtFr2WppbjLWda1lnetlK28rbKtVpj1Wr11trGOtX6e+sG66c2+jZRNmU2dTZ3bdVsA2yLbWtsr9ox7bzt8u022rXbk/Ye9rn21faXHEgHTweRw0aHjlGMUT6jxKNqRt1wZDsGOZY61jk+cNJzinGa79Tg9Hy05eiM0ctHt47+7OzhXOC83fmOi7bLOJf5Lk0uL13tXfmu1a5X3dTcwt3muDW6vXB3cBe6b3K/6cHxGO/xvUeLxydPL0+p517Pbi9Lr0yvDV43vHW8470Xe5/1YfgE+8zxOerzfoznGNmYA2P+9nX0zffd7ft0rM1Y4djtYx/5mfvx/Lb6dfpz/TP9t/h3BpgF8AJqAh4GWgQKAncEPgmyC8oL2hP0PNg5WBp8OPhtyJiQWSHNoVRoRGhFaFuYdlhy2Pqw++Hm4TnhdeG9ER4RMyKaIxmR0ZHLI29EGUfxo2qjesd5jZs17nQ0Ozoxen30wxj7GGlM03hy/LjxK8ffjbWKFcc2xCEuKm5l3L14m/ji+F8mMCfET6ie8DjBJWFmQmsiJ3FK4u7EN0nBSUuT7iTbJsuTW1I0Uiam1Ka8TQ1NXZHamTY6bVbahXTDdFF6YwYrIyVjR0bfN2HfrP6ma6LHxPKJ1yfZTJo26dxkw8kFk49N0ZjCm3Iwk5GZmrk78yMvjlfD68uKytqQ1csP4a/hPxMEClYJuoV+whXCJ9l+2Suyn+b45azM6c4NyK3K7RGFiNaLXuRF5m3Oe5sfl78zf6AgtWBfoVJhZuERsbY4X3y6yKRoWlGHxEFSLuksHlO8urhXGi3dUUKUTCpplOnIJLKLclv5d/IHpf6l1aXvpqZMPThNa5p42sXp9tMXTX9SFl724wx6Bn9Gy0yzmfNmPpgVNGvrbGJ21uyWORZzFszpmhsxd9c8lXn5836b7zx/xfzX36Z+27TAeMHcBY++i/iurly9XFp+43vf7zcvpBeKFrYtclu0btHnCkHF+UrnyqrKj4v5i8//4PLD2h8GlmQvaVvquXTTMuYy8bLrywOW71qhtaJsxaOV41fWr+Kuqlj1evWU1eeq3Ks2r1FZI1/TuTZmbeM6y3XL1n1cn7v+WnVw9b4NRhsWbXi7UbDx8qbATXs3G2+u3Pxhi2jLza0RW+trrGuqtjG3lW57vD1le+uP3j/W7jDcUbnj007xzs5dCbtO13rV1u422r20jqyT13Xvmbin/afQnxr3Ou7duk9vX+V+7Jfv//PnzJ+vH4g+0HLQ++DeQ1aHNhzmHK6oJ+qn1/c25DZ0NqY3dhwZd6Slybfp8C9Ov+w8ana0+pjusaXHVY4vOD5wouxEX7OkuedkzslHLVNa7pxKO3X19ITTbWeiz5z9NfzXU61BrSfO+p09em7MuSPnvc83XPC8UH/R4+Lh3zx+O9zm2VZ/yetSY7tPe1PH2I7jlwMun7wSeuXXq1FXL1yLvdZxPfn6zRsTb3TeFNx8eqvg1ovbpbf778y9y7hbcU/zXtV9o/s1v9v9vq/Ts/PYg9AHFx8mPrzziP/o2R8lf3zsWvBY7XHVE9MntU9dnx7tDu9u//ObP7ueSZ7195T/pfXXhue2zw/9Hfj3xd603q4X0hcDLxe/Mni187X765a++L77bwrf9L+teGfwbtd77/etH1I/POmf+pH1ce0nu09Nn6M/3x0oHBiQ8KQ8AAAFgMzOBl7uBNTSAU47oKI+uH8p9kbiywb5v+HBHQ0A4AnsDASS5wIxzcCmZsBqLsBuBuIBJAWCdHMbvhSnJNvNdVCLLQUY7wYGXhkDrCbgk3RgoH/jwMCn7QB1C2guHtz7AICpCWyxB4BLYw3mfr1//QfwuGyHRfwarwAAO2xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTYtMDctMjlUMTg6MTg6MDctMDc6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA3LTI5VDE4OjE4OjA3LTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNi0wNy0yOVQxODoxODowNy0wNzowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MTI5YzJlMjMtOTRlZi00OGU1LTk2ZDItMjdlNGMwMzliM2RhPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OWRiYjgwODctOTU4NC0xMTc5LThmMzYtZGZjMzY1Y2QxNGRkPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YmUzNmYwYmUtODU0MS00N2NiLTgxN2EtNGE3YWQ5NWIxMGI2PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmJlMzZmMGJlLTg1NDEtNDdjYi04MTdhLTRhN2FkOTViMTBiNjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNy0yOVQxODoxODowNy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjEyOWMyZTIzLTk0ZWYtNDhlNS05NmQyLTI3ZTRjMDM5YjNkYTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNy0yOVQxODoxODowNy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPkRPQzwvcGhvdG9zaG9wOkxheWVyTmFtZT4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllclRleHQ+RE9DPC9waG90b3Nob3A6TGF5ZXJUZXh0PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+RGlzcGxheTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42MDA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NTE3PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6I9Lf7AAAAIGNIUk0AAG11AABzoAAA/N0AAINkAABw6AAA7GgAADA+AAAQkOTsmeoAAUnjSURBVHja7P13fFzXeeePv2+bPui9kGDvvYlNpEhKIlXcFCmuiR23bLJpm2Tt7G+z36zj7MpJnE1x7Lgk7nYsWaJ6IylS7B0kSAIkeu9lBtPbvb8/LoYASYAkSIAEiPN+veYFYDDlnnNP+ZznPOd5JMMwmNIcPTr2n6nr4HRCURFcuACBAPT1QVcXZGRAVpb5d2srzJkDCxZALAb9/eD3m//LyzMfNhvs2wcHDsCGDeZzx47Bli1w4gTU1sKiRaBpkJMD2dnm/+12WLYMfD7o6TGvpbQUrFbIzYWODvNaYjEIBqGzEywWWLoUUlLg4EHzOiUJpk0zvyd5bU6n+b7CQrN8q1dDfT0Yhnkt/f3m99bUmOXTdUhNNb87FjOvIzcXli+Hixfh8mVYscK8JpvNLIvfb35PSQlMnw5HjpjlWLoUdu826yE3F9rbYe5csy5TUiA93fw+STK/LxQyX/fGGzBzpvk93/oWrF0LxcXwq1/BypXm9xUWmt+v6zBrFrzzDjgcsH49nDlj3qfmZrNuPvQh83P/4z/McsycaX6X1Wq+JhaDp56C99837/9jj5l1+Oab4HbDo4+adf7K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',
           
            prescriptionsymbol:'data:image/png;base64,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'
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            //$ionicNavBarDelegate.showBackButton(false);
            console.log($ionicHistory.viewHistory());
        });
        
        $scope.showMenu = function () {
            $ionicActionSheet.show({
                titleText: 'Profile Actions',
                buttons: [
                {
                    text: '<i class="icon ion-iphone"></i> Sign Out'
                },

                 {
                     text: '<i class="icon ion-person"></i> Edit Personal Info'
                 },
                  {
                      text: '<i class="icon ion-card"></i> Edit Payment Info'
                  },
                ],

                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },

                buttonClicked: function (index) {
                    switch (index) {
                        case 0: {
                            $state.go('tab.account.mobilelogin');
                            break;

                        }
                        case 1: {
                        if($scope.customer.isProvider)
                        {
                            //$state.go('tab.account.customeredit', {}, { reload: true }); return true;
                            $state.go('tab.account.customeredit');
                        }
                        else{
                            $state.go('tab.CustInfo');
                        }
                            //$state.go('tab.account.customeredit');
                            break;
                        }
                        case 2: {
                            $state.go('tab.account.payments');
                            break;
                        }
                    }
                    console.log('BUTTON CLICKED', index);
                    return true;

                },

            });

        }

        $ionicLoading.show({
            template: 'loading'
        });
        $scope.prescriptionView = function (){
            $scope.data.showPrescriptions=!$scope.data.showPrescriptions;
        }
        $scope.Prescriptions=[];
        Prescription.query({id:localStorage.getItem("customerid")}).$promise.then(function(data){
            $scope.Prescriptions=data;
        });
        $scope.Encounters=[];
        Encounter.query({id:localStorage.getItem("customerid")}).$promise.then(function(data){
            $scope.Encounters=data;
        })
           $scope.encounterInfo = function (item){
            $scope.item=item;
            var popup = $ionicPopup.show({
            'templateUrl': 'templates/EncounterInfo.html',
            'title': 'EncounterInfo',
            'scope': $scope,
            'buttons': [
                {
                    'text': '',
                    'type': 'button-assertive icon ion-close-round'
                },
                {
                    'text': '',
                    'type': 'button-balanced icon ion-checkmark-round',
                    'onTap': function(event) {
                        
                        $ionicModal.fromTemplateUrl('templates/video.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function(modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });
                    }
                }
            ]
        });

        

 
	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove()
	};
               
}
 $scope.closePrescription = function () {
          
            $scope.modal.hide();
            $scope.modal.remove()
        };

  $scope.prescriptionInfo = function (item){           

        item.icontexturl = $scope.data.icontexturl;
        item.prescriptionsymbol = $scope.data.prescriptionsymbol;      
        $scope.pItem = item;
       // $scope.pItem.prescriptionText = $scope.pItem.prescriptionText.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $ionicModal.fromTemplateUrl('./templates/prescription.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }, function (error) {
            console.log(error);
        });
               
  };
//   $scope.prescriptionInfo = function (item){
//             //$scope.item=item;
//             //if(item.imageUrl=="")
       
       
//         //var pdfl = pdfMake.createPdf(docDefinition);
//         //var blob = new Blob([pdf1], {type: 'application/pdf'});
//         //$scope.pdfUrl = URL.createObjectURL(blob);

//         //kav
//         item.icontexturl = $scope.data.icontexturl;
//         item.prescriptionsymbol = $scope.data.prescriptionsymbol;
//       //  item.imageUrl = $scope.data.imageUrl

//           //if no cordova, then running in browser and need to use dataURL and iframe
//         // if (device.platform=='browser')
//         // {
//         //    // ReportSvc.runReportDoc( {},{},item )
//         //     //    .then(function(docDefinition) {
//         //                var docDefinition= {
//         //                 content: [
//         //                     {
//         //                     columns: [

//         //                     {
//         //                         image: $scope.data.icontexturl,
//         //                         width: 60
//         //                 },
//         //                 {alignment: 'right', text: 'Prescription \n\n', fontSize: 20, bold:true},
                        
//         //                 {alignment:'right',text:'\n8/7/2016'}
                        
//         //                 ]},

//         //                     {
//         //                         columns:[
//         //                 { text: 'Patient \n', fontSize: 15, bold:true},
//         //                 { text: 'Doctor \n', fontSize: 15, bold:true}
                        
//         //                 ]
//         //                     },
//         //                 {
//         //                 alignment: 'justify',
//         //                 columns: [
//         //                 {
//         //                 text: item.customer.FirstName+' '+item.customer.LastName+'\nAge: 18\n' + item.customer.HomeLocation.formatted_address+'\n'+item.customer.MobileNumber+'\n'
//         //                 },
//         //                 {
//         //                 text: item.provider.FirstName+' '+item.provider.LastName+'\nRegistration Number: '+item.provider.ProviderLicense +'\n' +item.provider.EndLocation.formatted_address+'\n'+item.provider.MobileNumber+'\n'
//         //             },

//         //                 ]
//         //                 },
//         //                 {
//         //                         image: $scope.data.prescriptionsymbol,      
//         //                         width: 60,
//         //                         height:60
//         //                 },
                        
//         //                 item.prescriptionText,
//         //                 {
//         //                         image: item.imageUrl,
//         //                         width: 500,
//         //                         height: 500
//         //                 },
//         //                 '\nRefill:'+item.refills+'\n\n Signed electronically.',
                        
//         //                 ]
//         //             }

//         //             var popup = $ionicPopup.show({
//         //             'title': 'How would you like to view the prescription',
//         //             'scope': $scope,
//         //             'buttons': [
//         //                 {
//         //                     'text': 'Open in new tab',
//         //                     'onTap': function(event) {
//         //                         //pdfMake.createPdf(docDefinition).open();
//         //                        var fp =  applicationConfig.apiUrl + 'test.pdf'
//         //                         window.open(fp,     '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
                    
        
//         //                     }
                
//         //                 },
//         //                 {
//         //                     'text': 'Download',
//         //                     'onTap': function(event) {
//         //                     pdfMake.createPdf(docDefinition).download("doconcallreceipt.pdf");
//         //                     }
//         //                 },
//         //                 {
//         //                     'text': 'Print',
//         //                     'onTap': function(event) {
//         //                         pdfMake.createPdf(docDefinition).print();

//         //                     }

//         //                 }
//         //             ]
//         //         });
//         //           //  pdfMake.createPdf(docDefinition).open();
//         //       //  });

          
//         //    // return true;
//         // }
//         // //if codrova, then running in device/emulator and able to save file and open w/ InAppBrowser
//         // else {
//             ReportSvc.runReportAsync( {},{},item )
//                 .then(function(filePath) {
//                     var options = {
//                         location: 'yes',
//                         clearcache: 'yes',
//                         toolbar: 'yes',
//                         closebuttoncaption: 'DONE?'
//                         };
//                     //log the file location for debugging and oopen with inappbrowser
//                     console.log('report run on device using File plugin');
//                     console.log('ReportCtrl: Opening PDF File (' + filePath + ')');
//                     $scope.pdfUrl = filePath;
//                   //  window.open(filePath,     '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
//                   //    var fp =  applicationConfig.apiUrl + 'test.pdf'
//                   //            window.open(fp,     '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
                    
//                     var  _type = "_system";
//                     if (device.platform === "iOS") {
//                         _type = "_blank";
//                     }
//                     else if (device.platform === "Android") {
//                         _type = "_system";
//                     }
//                     else {
//                         _type = "_system";
//                     }
//                      $cordovaInAppBrowser.open(filePath, _type , options)
//                     .then(function(event) {
//                     // success
//                     })
//                     .catch(function(event) {
//                     // error
//                     });
//                     //cordova.plugins.fileOpener2.open(
//                     //    filePath, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
//                     //    'application/pdf',
//                     //    {
//                     //        error: function (e) {
//                     //            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
//                     //        },
//                     //        success: function () {
//                     //            console.log('file opened successfully');
//                     //        }
//                     //    }
//                     //);
//                    // hideLoading();
//                 });
//             return true;
//       //  }
//   };
//     $scope.prescriptionInfo = function (item){
//             //$scope.item=item;
//             //if(item.imageUrl=="")
//             var docDefinition= {
// 	content: [
// 	    {
// 	     columns: [

// 	     {
//              image: $scope.data.icontexturl,
// 	        width: 60
// 	},
// 	 {alignment: 'right', text: 'Prescription \n\n', fontSize: 20, bold:true},
	 
// 	 {alignment:'right',text:'\n8/7/2016'}
	 
// 	]},

//         {
//             columns:[
// 	  { text: 'Patient \n', fontSize: 15, bold:true},
// 	  { text: 'Doctor \n', fontSize: 15, bold:true}
	
// 	  ]
//         },
// 	{
// 	alignment: 'justify',
// 	columns: [
// 	{
// 	text: item.customer.FirstName+' '+item.customer.LastName+'\nAge: 18\n' + item.customer.HomeLocation.formatted_address+'\n'+item.customer.MobileNumber+'\n'
// 	},
// 	{
// 	text: item.provider.FirstName+' '+item.provider.LastName+'\nRegistration Number: '+item.provider.ProviderLicense +'\n' +item.provider.EndLocation.formatted_address+'\n'+item.provider.MobileNumber+'\n'
// },

// 	]
// 	},
// 	{
// 	        image: $scope.data.prescriptionsymbol,      
//             width: 60,
// 	        height:60
// 	},
	
//     item.prescriptionText,
// 	 {
// 	        image: item.imageUrl,
//             width: 500,
//             height: 500
// 	},
//     '\nRefill:'+item.refills+'\n\n Signed electronically.',
	
// 	]
// }
	
                 
             


            
            
           
//         };
         $scope.datepickerObject = {
                titleLabel: 'Date of Birth',  //Optional       

                inputDate: null,  
                callback: function (val) {  //Mandatory
                    //datePickerCallback(val);
                    if (val != undefined && val != null) {
                        $scope.customer.dob = val;
                        $scope.datepickerObject.inputDate = val;
                        
                    }

                }

            };
        if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '') {
            Account.getWithAccountBalance({ accountid: localStorage.getItem("customerid"), withAccount: 'test', flag: 'test' }).$promise.then(function (data) {
                $scope.customer = data;
                $scope.datepickerObject.inputDate = new Date(data.dob);
                $ionicLoading.hide();
                if (data.email == null && $scope.customer.isProvider) {
                    $ionicPopup.alert({
                        title: 'Account Setup is not Finished!',
                        template: 'We need a little more information from you before you can start using the app!'
                    })
                    .then(function (res) {
                        if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); return true;
                        }
                        else{$state.go('tab.CustInfo');}
                        return true;

                    });

                }
                else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000" ) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Account Setup is not Finished!',
                        template: 'We need a little more information from you before you can start using the app!'
                    })
                    .then(function (res) {
                        if($scope.customer.isProvider)
                        {
                            $state.go('tab.account.customeredit', {}, { reload: true }); return true;
                        }
                        else{$state.go('tab.CustInfo');}return true;

                    });

                }
            }, function (error) {
                $ionicLoading.hide();
                if (error.data == null) {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-appserverunavailable.html'
                    })
                  .then(function (res) {
                      $state.go('security');
                      return true;

                  });

                }
                else {
                    $ionicPopup.alert({
                        title: applicationConfig.errorPopupTitle,
                        templateUrl: 'templates/error-application.html'
                    })
                  .then(function (res) {
                      return true;
                  });

                }
                console.log(error);

            }
            );
        }
        else {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Oops!',
                template: 'We need to Authenticate your mobile number again'
            })
                   .then(function (res) {

                       localStorage.setItem("access_token", "");
                       localStorage.setItem("username", "");
                       localStorage.setItem("customerid", "");
                       localStorage.setItem("isProvider", "");
                       $state.go('tab.account.mobilelogin');
                       return true;

                   });
            //$state.go('tab.account.mobilelogin');
        }

       
}}])


        
.controller('ExpensesCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Expense) {

    if ($stateParams.carpoolid != "" && $stateParams.usagedate != "") {

        $scope.data = {
            expenseDate: new Date($stateParams.usagedate).toDateString(),
            customerid: localStorage.getItem("customerid"),
            carpoolid: $stateParams.carpoolid,
            usagedate: $stateParams.usagedate,
            expenses: []

        };

        Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.carpoolid, rideDate: $scope.data.expenseDate }).$promise.then(function (data) {
            if (data.length == 0) $state.go('tab.dash.expenses.new-expense', { "customerid": $scope.data.customerid, "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.usagedate });
                // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
            else {
                $scope.data.expenses = data;
                
            }
        });
    }

    $scope.gotoexpense = function () {
        //  alert($scope.selectedCarpool.CarpoolID);
        $state.go('tab.dash.expenses.new-expense', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.expenseDate });



    }
    $scope.gotoEditExpense= function (expense)
    {
        $state.go('tab.dash.expenses.edit-expense', { "expenseid": expense.Id });

    }


})
.controller('NewExpenseCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, $cordovaCamera, Carpool, Account, Expense, ExpenseTypes) {

    $scope.data = {

        isCamera: false,
        RidePassengers: [],
        imagesrc: ''

    };
    var getExpenseTypes = function () {
        $scope.data.ExpenseTypes = ExpenseTypes.fetch();
    }
    getExpenseTypes();
    try
    {
        $scope.data.isCamera= Camera!=null?true:false

    }
    catch(e)
    {
        $scope.data.isCamera = false;
    }

    Carpool.get({ id: $stateParams.carpoolid }).$promise.then(function (data) {
        if (data != null) {
            $scope.expense = new Expense({
                Id: '',
                ExpenseDate: new Date($stateParams.usagedate).toDateString(),
                CarpoolID: data.Id,
                Name: data.Name,
                ExpenseType: 'Gas',
                ExpenseAmount: '',
                Description: '',
                ReceiptImage: [],
                Spender: []

            });


            if (data.CarpoolMembers != null) {
                $scope.data.RidePassengers = data.CarpoolMembers
                $scope.expense.Spender = $scope.data.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == $stateParams.customerid;
                })[0];

                if ($scope.expense.Spender == undefined) $scope.expense.Spender = $scope.data.RidePassengers[0];
            }
        }

    });

    



    $scope.getPhoto = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.expense.ReceiptImage = imageData;
            $scope.data.imagesrc = "data:image/jpeg;base64," + imageData;

        }, function (err) {
            // error
        });


    };




    $scope.save = function () {

        console.log($scope.expense);
        $ionicLoading.show({
            template: 'Saving your Expense...'
        });
        $scope.expense.$save().then(function (info) {
            $ionicLoading.hide();

            PopUpMessage = 'You new expense is saved!';
            var alertPopup = $ionicPopup.alert({
                title: 'Expense!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Ride Save");
               // $rootScope.$viewHistory.currentView = $rootScope.$viewHistory.backView;
                
              //  $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.expense.CarpoolID, "usagedate": $scope.expense.ExpenseDate });
                $state.go('tab.dash', {});

            });


        }, function (error) {
            $ionicLoading.hide();
            var PopUpMessage = '';

            PopUpMessage = 'Error Creating Expense. Contact Support';
            var alertPopup = $ionicPopup.alert({
                title: 'Expense!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Expense Save");
                $scope.ride.CarpoolMembers = [];
                $scope.data.contacts = [];
                $state.go($ionicHistory.backView().stateName);

            });

        });



    }

})
.controller('EditExpenseCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, $cordovaCamera, Carpool, Account, Contacts, Expense, ExpenseTypes) {
    $scope.data = {
        isCamera : false,
        imagesrc: ''

    };
    var getExpenseTypes = function () {
        $scope.data.ExpenseTypes = ExpenseTypes.fetch();
    }
    getExpenseTypes();
    try {
        $scope.data.isCamera = Camera != null ? true : false

    }
    catch (e) {
        $scope.data.isCamera = false;
    }
    Expense.get({ id: $stateParams.expenseid }).$promise.then(function (info) {
        if (info != null) {

            $scope.expense = info;
            $scope.data.imagesrc = info.ReceiptImage == null ? '' : "data:image/jpeg;base64," + info.ReceiptImage;
            Carpool.get({ id: info.CarpoolID }).$promise.then(function (data) {
                if (data != null) {
                   


                    if (data.CarpoolMembers != null) {
                        $scope.data.RidePassengers = data.CarpoolMembers
                        $scope.expense.Spender = $scope.data.RidePassengers.filter(function (obj) {
                            return obj.CustomerID == $scope.expense.Spender.CustomerID;
                        })[0];

                        if ($scope.expense.Spender == undefined || $scope.expense.Spender==null) $scope.expense.Spender = $scope.data.RidePassengers[0];
                    }
                }

            });

        }

    });

    



    $scope.getPhoto = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.expense.ReceiptImage = imageData;
            $scope.data.imagesrc = "data:image/jpeg;base64," + imageData;

        }, function (err) {
            // error
        });


    };


    $scope.save = function () {

        // $scope.ride.RideDate = $scope.data.rideDate;
        $ionicLoading.show({
            template: 'Saving your Expense...'
        });
        $scope.expense.$update().then(function (info) {
            $ionicLoading.hide();

            PopUpMessage = 'You new Ride is saved! Please start tracking your ride to log Carpool Miles.';
            var alertPopup = $ionicPopup.alert({
                title: 'Expense!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Ride Save");
               // $scope.expense.Spender = [];
              //  $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.expense.CarpoolID, "usagedate": $scope.expense.ExpenseDate });
              //  $state.go('tab.dash.expenses', { "carpoolid": $scope.expense.CarpoolID, "customerid": localStorage.getItem("customerid"), "usagedate": $scope.expense.ExpenseDate });

            });


        }, function (error) {
            $ionicLoading.hide();
            var PopUpMessage = '';

            PopUpMessage = 'Error Creating Expense. Contact Support';
            var alertPopup = $ionicPopup.alert({
                title: 'Expense!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Expsense Save");
               // $scope.expense.Spender = [];
               // $state.go($ionicHistory.backView().stateName);

            });

        });



    }

})
 .controller('ExpenseReportCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Expense) {

     if ($stateParams.carpoolid != "") {
         var date = new Date();
         var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
         var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);



         $scope.data = {
             startDate: new Date(date.getFullYear(), date.getMonth(), 1),
             endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),

             customerid: localStorage.getItem("customerid"),
             carpoolid: $stateParams.carpoolid,

             expenses: []

         };

         $scope.startDatepickerObject = {
             titleLabel: 'Start Date',  //Optional            
             inputDate: $scope.data.startDate,  //Optional           
             callback: function (val) {  //Mandatory
                 //datePickerCallback(val);
                 if (val != undefined && val != null) {
                     $scope.data.startDate = new Date(val);
                     $scope.startDatepickerObject.inputDate = val;

                 }

             }

         };

         $scope.endDatepickerObject = {
             titleLabel: 'Start Date',  //Optional            
             inputDate: $scope.data.endDate,  //Optional           
             callback: function (val) {  //Mandatory
                 //datePickerCallback(val);
                 if (val != undefined && val != null) {
                     $scope.data.endDate = val;
                     $scope.endDatepickerObject.inputDate = val;

                 }

             }

         };

         // Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.carpoolid, rideDate: $scope.data.expenseDate }).$promise.then(function (data) {
         //     if (data.length == 0) $state.go('tab.dash.expenses.new-expense', { "customerid": $scope.data.customerid, "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.usagedate });
         //         // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
         //     else {
         //         $scope.data.expenses = data;

         //     }
         // });
        }

     


 })
