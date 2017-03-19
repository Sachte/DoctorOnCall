angular.module('starter.controllers', [])
.controller('MainCtrl', ['$state', function ($state) {
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
    this.onTabDeselected = function () {
        console.log("onTabDeselected -  main");

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
    }
    this.onAccountTabDeselected = function () {
        console.log("onTabDeselected -  main");

    }



}])
.controller('NavCtrl', function ($scope, $ionicSideMenuDelegate) {

    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
})
.controller('DashCtrl', function ($scope, Account, $state, $ionicModal, $stateParams, $ionicHistory, $ionicLoading, $ionicPopup, $ionicActionSheet, Carpool, Ride, Expense) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    

    $scope.data = [];
    $scope.data.ridedate = new Date(yyyy, mm, dd);
    //$scope.data.selectedCarpool = [];
    $scope.data.selectedRide = [];
    $scope.data.workBoundJoinFlag = true;
    $scope.data.homeBoundJoinFlag = true;

    $scope.showMenu = function () {
        $ionicActionSheet.show({
            titleText: 'Carpool Actions',
            buttons: [
            { text: '<i class="icon ion-share"></i> New Carpool'
            },
            {
                text: '<i class="icon ion-arrow-move"></i> Manage Carpools'
            },
            ],
          
            cancelText: 'Cancel',
            cancel: function() {
                console.log('CANCELLED');
            },

            buttonClicked: function (index) {
                switch (index) {
                    case 0:{
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
            $scope.slots.inputEpochTime= val==undefined?  $scope.slots.inputEpochTime :val;
            
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
           
            $scope.slotsHomebound.inputEpochTime= val==undefined? $scope.slotsHomebound.inputEpochTime : val;
        }
    };

    $scope.setETAJoinStatus = function (ride) {
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

    $scope.refreshdata = function () {
        $ionicLoading.show({
            template: 'loading'
        });
        var temp = new Date($scope.data.ridedate).toDateString();

        if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '') {
            Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                $ionicLoading.hide();
                if (info.email == null || info.customerOrganization == null)
                {
                    $state.go('tab.account.emaillogin', {}, { reload: true });
                   
                }
                else if  (info.PlatformAccountBillingID == null)
                {
                    $state.go('tab.account.customeredit', {}, { reload: true });
                    
                }
                $scope.customer = info;
                $scope.data.email = $scope.customer.email;
                if ($scope.customer.email == null || $scope.customer.customerOrganization == null) $state.go('tab.account.emailLogin', {}, { reload: true });
                else if ($scope.customer.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('tab.account.customeredit', {}, { reload: true });
                else {
                    Ride.GetByCustomerIDAndDate({ customerID: localStorage.getItem("customerid"), rideDate: new Date(temp).toDateString() }).$promise.then(function (data) {
                        $scope.memberRides = data;
                        $scope.data.selectedRide = data[0];
                        $scope.setETAJoinStatus($scope.data.selectedRide);
                    }, function (error) {


                    });
                }

            }, function (error) {


            });
           
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
     function saveRide()
    {
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

        
         $state.go('tab.dash.attendance', { "id": $scope.data.selectedRide.Id, "type": $scope.data.selectedRide.Type, "usagedate": $scope.data.ridedate.toDateString(), "mode":"Attendance" });

        

     }
     $scope.gotoexpense = function () {

        Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.selectedCarpool.CarpoolID, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
            if (data.length == 0) $state.go('tab.new-expense', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate});
                // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
            else $state.go('tab.expenses', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID, "usagedate": $scope.data.ridedate });
            
        });
        
    }
     $scope.gotocarpoolmap = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.carpoolmap', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.selectedCarpool.CarpoolID });

    }
   


})
.controller('AttendanceCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride, CustomerPaymentMethod, CustomerPayment) {

    $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.mode == 'search') {
        //$ionicHistory.clearCache();
       // $ionicHistory.clearHistory();
        //$ionicNavBarDelegate.showBackButton(false);
        //console.log($ionicHistory.viewHistory());
    }
    });
   
    if (($stateParams.id != "" && $stateParams.id != undefined) && $stateParams.usagedate != "") {

            $scope.data = {
                rideDate: new Date($stateParams.usagedate).toDateString(),              
                id: $stateParams.id,
                usagedate: $stateParams.usagedate,
                type: $stateParams.type,
                displayname: $stateParams.displayname,
                mode: $stateParams.mode,
                isLoggedInUserStandby:true,
                rides: []

            };
            var temp = new Date($scope.data.usagedate).toDateString();
            $scope.calculateFees = function () {
                var flatfees = parseFloat($scope.workBoundRide.CostPerRide) > 0 ? localStorage.getItem('platformfeeflat') : 0;
                var fees = parseFloat((($scope.workBoundRide.CostPerRide * localStorage.getItem('platformfeerate'))) + parseFloat(flatfees));
                $scope.workBoundRide.PlatformFeePerRide = Math.round((fees + 0.00001) * 100) / 100;
                var totalfees = parseFloat($scope.workBoundRide.PlatformFeePerRide) + parseFloat($scope.workBoundRide.CostPerRide);
                $scope.workBoundRide.TotalCostPerRide = Math.round((totalfees + 0.00001) * 100) / 100;
            }
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
                            
                            $scope.data.isLoggedInUserStandby =$scope.data.loggedInRider==undefined?true: $scope.data.loggedInRider.isStandBy;

                            $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers.filter(function (obj) {
                                return obj.isDriverForTheRide == true;
                            })[0];

                            if ($scope.data.workBoundDriver == undefined && $scope.data.isLoggedInUserStandby==false) {
                                $scope.data.workBoundDriver = $scope.data.loggedInRider;
                            }
                            if ($scope.data.workBoundDriver == undefined ) {
                                $scope.data.workBoundDriver = $scope.workBoundRide.RidePassengers[0];
                            }

                            $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);


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

                        }

                    }

                }

               },
                    function (error) {

                    }
                 );
             
            
           
        }

    
    $scope.AcceptWorkbound = function (item) {
        var costPerRide = 0;

        if ($scope.workBoundRide.CostPerRide != '' && $scope.workBoundRide.CostPerRide != undefined)
        {
            try
            {
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
                template: '',
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
                        ToCustomerID:$scope.workBoundRide.CustomerID,
                        RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                        PaymentDate: $scope.data.usagedate,
                        CostPerRide: $scope.workBoundRide.CostPerRide,
                        PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                        TotalCostPerRide: $scope.workBoundRide.TotalCostPerRide,
                        PaymentStatus:'Pending'
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
        else
        {
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
            template: '',
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
    $scope.passengerSelected = function (passenger) {
        if ($scope.homeBoundRide.RidePassengers != null) {
            $scope.data.homeBoundRider = $scope.homeBoundRide.RidePassengers.filter(function (obj) {
                return obj.CustomerID == passenger.CustomerID;
            })[0];
        }
        if (passenger.isStandBy && passenger.isPassenger) {


            if ($scope.workBoundRide.TotalCostPerRide > 0) {
                var myPopup = $ionicPopup.confirm({
                    template: '',
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
                            Id:passenger.CustomerID,                         
                            FromCustomerID: passenger.CustomerID,
                            ToCustomerID: $scope.workBoundRide.CustomerID,
                            RideIDS: Array($scope.workBoundRide.Id, $scope.homeBoundRide.Id),
                            CostPerRide: $scope.workBoundRide.CostPerRide,
                            PlatformFeePerRide: $scope.workBoundRide.PlatformFeePerRide,
                            TotalCostPerRide:$scope.workBoundRide.TotalCostPerRide,
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

                });
            }
            else {
                $ionicLoading.hide();
                passenger.Status = "Accepted";

                var myPopup = $ionicPopup.confirm({
                    template: '',
                    title: 'Confirm No Fees',
                    subTitle: 'For the Ride',
                    template: 'Please note that a fee has not been set for this ride.Confirm that you do not want to charge <b>' + passenger.DisplayName + ' for the ride from <b>' + $scope.workBoundRide.StartAddress.formatted_address + '</b> to <b>' + $scope.workBoundRide.EndAddress.formatted_address + '</b> and back.', // String (optional). The html template to place in the popup body.
                    scope: $scope,
                    cancelText: 'No - I want to charge' + passenger.DisplayName , // String (default: 'Cancel'). The text of the Cancel button.
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
           else   if (item.Status == 'Pending' || item.Status == 'Declined')
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
    $scope.isActiveDriver = function(item)
    {
        if ($scope.workBoundRide.Type == 'Carpool' && item.RegistrationStatus == 'Active' && item.isStandBy == false) return true;
        else if ($scope.workBoundRide.Type == 'Customer' && item.isStandBy == false) return true;
        else return false;
    }
        $scope.gotodriverrideusage = function () {
            //  alert($scope.selectedCarpool.CarpoolID);
            $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.rideDate });

        }

        $scope.updateWorkBoundDriver = function () {
            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = false;

            $scope.data.workBoundDriverIndex = $scope.workBoundRide.RidePassengers.indexOf($scope.data.workBoundDriver);

            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isDriverForTheRide = true;
            $scope.workBoundRide.RidePassengers[$scope.data.workBoundDriverIndex].isPassenger = true;


            $scope.data.homeBoundDriver = $scope.data.workBoundDriver;


        }
        $scope.updateHomeBoundDriver = function () {
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = false;
            $scope.data.homeBoundDriverIndex = $scope.homeBoundRide.RidePassengers.indexOf($scope.data.homeBoundDriver);
           

            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isDriverForTheRide = true;
            $scope.homeBoundRide.RidePassengers[$scope.data.homeBoundDriverIndex].isPassenger = true;

        }


        $scope.save = function () {

            // $scope.ride.RideDate = $scope.data.rideDate;
          
            
            $ionicLoading.show({
                template: 'Saving your Ride...'
            });
            if ($scope.workBoundRide.Id == '')
            {
                $scope.workBoundRide.$save().then(function (info) {
                    $scope.workBoundRide.Id = info.Id;
                        if($scope.homeBoundRide.Id == '')
                        {

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

                            },function (error) {

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
         


    })
.controller('CarpoolsCtrl', function ($scope, $state, $ionicActionSheet,$ionicHistory,  Account) {
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
            if (data.email == null || data.customerOrganization == null) $state.go('tab.account.emailLogin', {}, { reload: true });
            else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('tab.account.customeredit', {}, { reload: true });
            else if (data.CustomerCarpools != null)
                //$scope.membercarpools = data.CustomerCarpools;
                $scope.Customer = data;
             var len= data.CustomerCarpools.filter(function (obj) {
                return (obj.RegistrationStatus !='Active');

             }).length;
             if (len > 0) {
                 $scope.showInvitations = true;
                 $scope.carpoolHeight = "50%";

             }

        });

    }
     $scope.showActionsheet = function() {

     $ionicActionSheet.show({
                    titleText: 'Carpool Actions',
                    buttons: [
                    { text: '<i class="icon ion-share"></i> Find & Subscribe'
                    },
                    {
                        text: '<i class="icon ion-arrow-move"></i> Create a New Carpool'
                    },
      ],
          
                  cancelText: 'Cancel',
                  cancel: function() {
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
  


})
//.controller('NewCarpoolCtrl', function ($scope, $state, $ionicActionSheet,$stateParams,  $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory, Account, Contacts, BillingFrequencies, Carpool) {
    
//    $scope.selectedType = '';
//    $scope.membercarpools = '';
    
//    $scope.data = {
//        contacts: [],
//        members: [],
//        billingFrequencies: [],
//        newContactDisplayName: '',
//        newContactMobileNumber: '',
//        ContactSearchStr: '',
//        showDelete: false
//    };
//    $scope.slots = {epochTime : 27000, format: 12, step: 1
//    };

//    $scope.timePickerCallback = function (val) {
//      if (typeof (val) === 'undefined') {
//        console.log('Time not selected');
//      } else {
//        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
//        }
//        };
//    $scope.carpool = new Carpool({
//        Type: '', //required for preselecting
//        Name: '',
//        CoordinatorName:'',
//        Capacity: '',
//        Distance: '',
//        CostPerRide: '',
//        TrackReturnRidesSeparately: false,
//        FixedCost: '',
//        DriverCredit: '',
//        ApproximateFuelCosts: 0.0,
//        BillingStartDate: '',
//        BillingFrequency: 'Monthly',
//        StartAddress: '',
//        EndAddress: '',
//        WorkboundDepartureTime: 27000,
//        WorkboundArrivalTime: 30600,
//        HomeboundDepartureTime:63000,
//        HomeboundArrivalTime: 66600,
//        Sunday: false,
//        Monday: true,
//        Tuesday:true,
//        Wednesday: true,
//        Thursday: true,
//        Friday: true,
//        Saturday:false,
//        CarpoolMembers: []

//    });



//    var billingFrequecies = function () {
//        $scope.data.billingFrequencies = BillingFrequencies.fetch();
//    }
//    billingFrequecies();


//    $scope.updateChoice = function (str) {
//        $scope.selectedType = str;
//        // $scope.data.contacts = Contacts.fetch('sanjeev');
//    }
//    $scope.contactSelected = function (contact) {

//        var index = $scope.carpool.CarpoolMembers.indexOf(contact); // Change to filter by DisplayNAme +mobileNumber only.

//        if (index < 0) {
//            if (contact.mobileExists) {
//                $scope.carpool.CarpoolMembers.push(contact);
//            }
//            else {

//                var alertPopup = $ionicPopup.alert({
//                    title: 'Mobile Number is Required!',
//                    template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
//                });

//            }
//        }
//        else {
//            var alertPopup = $ionicPopup.alert({
//                title: 'Selected Contact is already a member!',
//                template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
//            });

//        }


//    }
//    $scope.newContact = function () {
//        var myPopup = $ionicPopup.show({
//            template: '<input type="text" placeholder="Enter Display Name" ng-model="data.newContactDisplayName"> <br> <input type="text" placeholder="Enter Mobile Number" ng-model="data.newContactMobileNumber">',
//            title: 'New Contact',
//            subTitle: 'Please use normal things',
//            scope: $scope,
//            buttons: [
//              { text: 'Cancel' },
//              {
//                  text: '<b>Save</b>',
//                  type: 'button-positive',
//                  onTap: function (e) {
//                      if ($scope.data.newContactDisplayName == '' || $scope.data.newContactMobileNumber == '') {
//                          //don't allow the user to close unless he enters wifi password
//                          e.preventDefault();
//                      } else {

//                          var contact = { displayName: $scope.data.newContactDisplayName, mobileNumber: $scope.data.newContactMobileNumber, mobileExists: true, isMember: false, isCoordinator: false, isSaved: false,RegistrationStatus:'Open' };
//                          $scope.data.contacts.splice(0, 0, contact);
//                          $scope.data.newContactDisplayName = '';
//                          $scope.data.newContactMobileNumber = '';
//                          $scope.contactSelected(contact);
//                          return contact
//                      }
//                  }
//              },
//            ]
//        });


//    }
//    var addSignedInUserAsMember = function () {

//        var member = { displayName: 'Me', mobileNumber: localStorage.getItem("username"), mobileExists: true, isMember: false, isCoordinator: true, isSaved: false, RegistrationStatus: 'Open' };
//        $scope.carpool.CarpoolMembers.push(member);

//    }
//    addSignedInUserAsMember();
//    $scope.searchContacts = function () {
//        $scope.data.contacts = [];
//        if ($scope.data.ContactSearchStr.length >= 3)
//            Contacts.getContacts($scope.data.ContactSearchStr).then(function (_result) {

//                angular.forEach(_result, function (con) {
//                    var contact = {};
//                    console.log('In  Contact');
//                    if ((con.displayName != null) && (con.displayName.length) > 0) {
//                        console.log('DisplayName-' + con.displayName);
//                        contact.displayName = con.displayName;
//                        contact.mobileExists = false;
//                        contact.isMember = false;
//                        contact.isCoordinator = false;
//                        contact.isSaved = false;
//                        contact.RegistrationStatus = 'Open';
//                        if ((con.phoneNumbers != null)) {
//                            angular.forEach(con.phoneNumbers, function (pn) {
//                                console.log('In  Phone');
//                                if (pn.type == 'mobile') {
//                                    console.log('Found Mobile');
//                                    contact.mobileExists = true;
//                                    contact.mobileNumber = pn.value;
//                                    if (pn.pref == true) return false;//similar to continue
//                                }
//                            })
//                        }

//                        $scope.data.contacts.push(contact);
//                    }
//                })

//            }, function (_error) {
//                console.log(_error);
//            });
//        else $scope.data.contacts = [];
//    }
//    $scope.carpoolSave = function (carpool) {
//        if (carpool.$valid ) {
//            console.log($scope.carpool);
//            $ionicLoading.show({
//                template: 'Saving your Carpool...'
//            });
//            $scope.carpool.$save().then(function (info) {
//                $ionicLoading.hide();
//                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

//                var alertPopup = $ionicPopup.alert({
//                    title: 'Carpool Created!',
//                    template: 'You new Carpool is created! SMS messages will be sent to the members for confirmation.'
//                });
//                alertPopup.then(function (res) {
//                    console.log(carpool);                   
//                    $scope.carpool.CarpoolMembers = [];
//                    $scope.data.contacts = [];
//                    // $state.go($ionicHistory.backView().stateName);
//                    $state.go('tab.dash.carpools.actions', {carpoolId:carpool.Id});

//                });

//            }, function (error) {
//                $ionicLoading.hide();
//                var alertPopup = $ionicPopup.alert({
//                    title: 'Carpool Error!',
//                    template: 'You new Carpool could not be created! Please contact Support.'
//                });
//                alertPopup.then(function (res) {
//                    console.log(carpool);
//                    $state.go($ionicHistory.backView().stateName);

//                });

//            });
//        }

//    }

//    $scope.carpoolSaveMock = function (carpool) {
//        var alertPopup = $ionicPopup.alert({
//            title: 'Carpool Error!',
//            template: 'You new Carpool could not be created! Please contact Support.'
//        });

//    }
//    $scope.onMemberDelete = function (member) {

//        if (member.isCoordinator) {

//            var alertPopup = $ionicPopup.alert({
//                title: 'Co-ordinator cannot be removed!',
//                template: 'Carpool coordinator cannot be removed from the members list!'
//            });
//        }

//        else if (member.isSaved) {
//            var confirmPopup = $ionicPopup.confirm({
//                title: 'Member will be Terminated',
//                template: 'Are you sure you want to terminate this member? Termination cannot be undone.Press OK to confirm'
//            });
//            confirmPopup.then(function (res) {
//                if (res) {
//                    console.log('You are sure');
//                    // Call Deactivate service
//                } else {
//                    console.log('You are not sure');
//                }
//            });
//        }

//        else {
//            var confirmPopup = $ionicPopup.confirm({
//                title: 'Member will be Removed',
//                template: 'Are you sure you want to remove this member? Press OK to confirm.'
//            });
//            confirmPopup.then(function (res) {
//                if (res) {
//                    var index = $scope.carpool.CarpoolMembers.indexOf(member);
//                    if (index >= 0)
//                        $scope.carpool.CarpoolMembers.splice(index, 1);

//                    index = $scope.data.contacts.indexOf(member);
//                    if (index >= 0)
//                        $scope.data.contacts[index].isMember = false;
//                    console.log('You are sure');
//                    // Call Deactivate service
//                } else {
//                    console.log('You are not sure');
//                }
//            });

//        }


//    }
//    $scope.onMemberEdit = function (member) {
//        alert('hey');
//    }

//    ////Map Control Functions
//    //var directionsDisplay;
//    //var directionsService = new google.maps.DirectionsService();
//    //var map;

//    //function initialize() {
//    //    directionsDisplay = new google.maps.DirectionsRenderer();
//    //    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//    //    var mapOptions = {
//    //        zoom: 7,
//    //        center: chicago
//    //    };
//    //    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//    //    directionsDisplay.setMap(map);
//    //}

//    //$scope.calcRoute = function () {
//    //    var start = $scope.carpool.StartAddress;
//    //    var end = $scope.carpool.EndAddress;
//    //    var request = {
//    //        origin: start,
//    //        destination: end,
//    //        travelMode: google.maps.TravelMode.DRIVING
//    //    };
//    //    directionsService.route(request, function (response, status) {
//    //        if (status == google.maps.DirectionsStatus.OK) {
//    //            directionsDisplay.setDirections(response);
//    //        }
//    //    });
//    //}
    



//})
.controller('NewCarpoolSlideCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory, $ionicModal, Account, Contacts, ContactsService, BillingFrequencies, Carpool, Geo) {
   
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
            TotalCostPerRide:data.TotalCostPerRide,
            TrackReturnRidesSeparately: false,
            FixedCost: '',
            DriverCredit: '',
            ApproximateFuelCosts: 0.0,
            BillingStartDate: '',
            BillingFrequency: 'Monthly',
            StartAddress: data.HomeLocation == undefined ? '' : data.HomeLocation,
            EndAddress: data.EndLocation == undefined ? '' :data.EndLocation,
           
            WorkboundDepartureTime: data.CustomerSchedule == undefined || data.CustomerSchedule.WorkboundDepartureTime == undefined ? 27000 : data.CustomerSchedule.WorkboundDepartureTime,
            WorkboundArrivalTime: data.CustomerSchedule == undefined ||  data.CustomerSchedule.WorkboundArrivalTime== undefined ? 30600 : data.CustomerSchedule.WorkboundArrivalTime,
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
        $scope.calculateFees();


        $scope.slotsWorkboundDepartrure.inputEpochTime= $scope.carpool.WorkboundDepartureTime;
        $scope.slotsWorkboundArrival.inputEpochTime= $scope.carpool.WorkboundArrivalTime;  
        $scope.slotsHomeboundDepartrure.inputEpochTime= $scope.carpool.HomeboundDepartureTime;   
        $scope.slotsHomeboundArrival.inputEpochTime= $scope.carpool.HomeboundArrivalTime;  


       

        addSignedInUserAsMember();
        $ionicLoading.hide()
    });

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
        
        if ($scope.contact.isSaved==false) {
            var index = $scope.carpool.CarpoolMembers.indexOf($scope.contact); // Change to filter by DisplayNAme +mobileNumber only.

            if (index < 0) {
                if ($scope.contact.MobileExists || ($scope.contact.MobileNumber != undefined && $scope.contact.MobileNumber!='')) {
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
                    template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
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
        displayName= $scope.customer.FirstName == undefined || $scope.customer.FirstName == null?displayName: $scope.customer.FirstName;
        displayName =  $scope.customer.LastName == undefined || $scope.customer.LastName == null? displayName : displayName + ' ' + $scope.customer.LastName;
        if (displayName == '') displayName = 'Me';
        var member = { DisplayName: displayName, MobileNumber: localStorage.getItem("username"), MobileExists: true, isMember: false, isCoordinator: true, isSaved: false, RegistrationStatus: 'Open' };
        $scope.carpool.CarpoolMembers.push(member);

    }
   
   
    $scope.carpoolSave = function (carpool) {

        

        if ($scope.carpool.StartAddress != undefined)
        {
            try
            {
              //  $scope.carpool.StartAddress.geometry.location.lat = $scope.carpool.StartAddress.geometry.location.lat();
              //  $scope.carpool.StartAddress.geometry.location.lng = $scope.carpool.StartAddress.geometry.location.lng();
            }
            catch (e)
            {
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
                $scope.carpool.Distance = (parseFloat(distance).toFixed(2))/1;
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
    



})
//.controller('EditCarpoolCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory, Account, Contacts, BillingFrequencies, Carpool) {


//    Carpool.get({ id: $stateParams.carpoolId }).$promise.then(function (data) {
//        //if (data.Name != null) {
//        //    $scope.carpoolName = data.Name;
//        //}
//        $scope.carpool = data;
//        $scope.selectedType = data.Type;
//        $scope.carpool.BillingStartDate = new Date(data.BillingStartDate);
       


//    });


//    $scope.selectedType = 'NA';
//    $scope.membercarpools = '';
//       $scope.slots = {
//        epochTime: 27000, format: 12, step: 1
//        };
//       $scope.timePickerCallback = function (val) {
//          if (typeof (val) === 'undefined') {
//              console.log('Time not selected');
//           } else {
//             console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
//           }
//       };

//    $scope.data = {
//        contacts: [],
//        members: [],
//        billingFrequencies: [],
//        newContactDisplayName: '',
//        newContactMobileNumber: '',
//        ContactSearchStr: '',
//        showDelete: false
//    };
   

   

//    var billingFrequecies = function () {
//        $scope.data.billingFrequencies = BillingFrequencies.fetch();
//    }
//    billingFrequecies();

    
//    $scope.updateChoice = function (str) {
//        $scope.selectedType = str;
//        // $scope.data.contacts = Contacts.fetch('sanjeev');
//    }
//    $scope.contactSelected = function (contact) {

//        var index = $scope.carpool.CarpoolMembers.indexOf(contact); // Change to filter by DisplayNAme +mobileNumber only.

//        if (index < 0) {
//            if (contact.mobileExists) {
//                $scope.carpool.CarpoolMembers.push(contact);
//            }
//            else {

//                var alertPopup = $ionicPopup.alert({
//                    title: 'Mobile Number is Required!',
//                    template: 'Selected Contact does not have a mobile Number. Please update the contact with a mobile number or create a new contact'
//                });

//            }
//        }
//        else {
//            var alertPopup = $ionicPopup.alert({
//                title: 'Selected Contact is already a member!',
//                template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
//            });

//        }


//    }
//    $scope.newContact = function () {
//        var myPopup = $ionicPopup.show({
//            template: '<input type="text" placeholder="Enter Display Name" ng-model="data.newContactDisplayName"> <br> <input type="text" placeholder="Enter Mobile Number" ng-model="data.newContactMobileNumber">',
//            title: 'New Contact',
//            subTitle: 'Please use normal things',
//            scope: $scope,
//            buttons: [
//              { text: 'Cancel' },
//              {
//                  text: '<b>Save</b>',
//                  type: 'button-positive',
//                  onTap: function (e) {
//                      if ($scope.data.newContactDisplayName == '' || $scope.data.newContactMobileNumber == '') {
//                          //don't allow the user to close unless he enters wifi password
//                          e.preventDefault();
//                      } else {

//                          var contact = { DisplayName: $scope.data.newContactDisplayName, MobileNumber: $scope.data.newContactMobileNumber, mobileExists: true, isMember: false, isCoordinator: false, isSaved: false };
//                          $scope.data.contacts.splice(0, 0, contact);
//                          $scope.data.newContactDisplayName = '';
//                          $scope.data.newContactMobileNumber = '';
//                          $scope.contactSelected(contact);
//                          return contact
//                      }
//                  }
//              },
//            ]
//        });


//    }
   
//    $scope.searchContacts = function () {
//        $scope.data.contacts = [];
//        if ($scope.data.ContactSearchStr.length >= 3)
//            Contacts.getContacts($scope.data.ContactSearchStr).then(function (_result) {

//                angular.forEach(_result, function (con) {
//                    var contact = {};
//                    console.log('In  Contact');
//                    if ((con.displayName != null) && (con.displayName.length) > 0) {
//                        console.log('DisplayName-' + con.displayName);
//                        contact.displayName = con.displayName;
//                        contact.mobileExists = false;
//                        contact.isMember = false;
//                        contact.isCoordinator = false;
//                        contact.isSaved = false;
//                        if ((con.phoneNumbers != null)) {
//                            angular.forEach(con.phoneNumbers, function (pn) {
//                                console.log('In  Phone');
//                                if (pn.type == 'mobile') {
//                                    console.log('Found Mobile');
//                                    contact.mobileExists = true;
//                                    contact.mobileNumber = pn.value;
//                                    if (pn.pref == true) return false;//similar to continue
//                                }
//                            })
//                        }

//                        $scope.data.contacts.push(contact);
//                    }
//                })

//            }, function (_error) {
//                console.log(_error);
//            });
//        else $scope.data.contacts = [];
//    }
//    $scope.carpoolSave = function (carpool) {
       
//        if (carpool.$valid) {


//            console.log($scope.carpool);
//            $ionicLoading.show({
//                template: 'Updating your Carpool...'
//            });
//            $scope.carpool.$update().then(function (info) {
//                $ionicLoading.hide();
//                //refreshMemberCarpools(); //Do not block UI while updates are fetched. It will be async

//                var alertPopup = $ionicPopup.alert({
//                    title: 'Carpool Updated!',
//                    template: 'You new Carpool is Updated! SMS messages will be sent to new members for confirmation.'
//                });
//                alertPopup.then(function (res) {
//                    console.log(carpool);                   
//                    $scope.carpool.CarpoolMembers = [];
//                    $scope.data.contacts = [];
//                   // $state.go($ionicHistory.backView().stateName);

//                });

//            }, function (error) {
                
//                var alertPopup = $ionicPopup.alert({
//                    title: 'Carpool Error!',
//                    template: 'You new Carpool could not be created! Please contact Support.'
//                });
//                alertPopup.then(function (res) {
//                    console.log(carpool);
//                   // $state.go($ionicHistory.backView().stateName);

//                });

//            });
//        }


//    }

//    $scope.carpoolSaveMock = function (carpool) {
//        var alertPopup = $ionicPopup.alert({
//            title: 'Carpool Error!',
//            template: 'You new Carpool could not be created! Please contact Support.'
//        });

//    }
//    $scope.onMemberDelete = function (member) {

//        if (member.isCoordinator) {

//            var alertPopup = $ionicPopup.alert({
//                title: 'Co-ordinator cannot be removed!',
//                template: 'Carpool coordinator cannot be removed from the members list!'
//            });
//        }

//        else if (member.isSaved) {
//            var confirmPopup = $ionicPopup.confirm({
//                title: 'Member will be Terminated',
//                template: 'Are you sure you want to terminate this member? Termination cannot be undone.Press OK to confirm'
//            });
//            confirmPopup.then(function (res) {
//                if (res) {
//                    console.log('You are sure');
//                    // Call Deactivate service
//                } else {
//                    console.log('You are not sure');
//                }
//            });
//        }

//        else {
//            var confirmPopup = $ionicPopup.confirm({
//                title: 'Member will be Removed',
//                template: 'Are you sure you want to remove this member? Press OK to confirm.'
//            });
//            confirmPopup.then(function (res) {
//                if (res) {
//                    var index = $scope.carpool.CarpoolMembers.indexOf(member);
//                    if (index >= 0)
//                        $scope.carpool.CarpoolMembers.splice(index, 1);

//                    index = $scope.data.contacts.indexOf(member);
//                    if (index >= 0)
//                        $scope.data.contacts[index].isMember = false;
//                    console.log('You are sure');
//                    // Call Deactivate service
//                } else {
//                    console.log('You are not sure');
//                }
//            });

//        }


//    }
//    $scope.onMemberEdit = function (member) {
//       ;
//    }
   
//    ////Map Control Functions
//    //var directionsDisplay;
//    //var directionsService = new google.maps.DirectionsService();
//    //var map;

//    //function initialize() {
//    //    directionsDisplay = new google.maps.DirectionsRenderer();
//    //    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//    //    var mapOptions = {
//    //        zoom: 7,
//    //        center: chicago
//    //    };
//    //    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//    //    directionsDisplay.setMap(map);
//    //}

//    //$scope.calcRoute = function () {
//    //    var start = $scope.carpool.StartAddress;
//    //    var end = $scope.carpool.EndAddress;
//    //    var request = {
//    //        origin: start,
//    //        destination: end,
//    //        travelMode: google.maps.TravelMode.DRIVING
//    //    };
//    //    directionsService.route(request, function (response, status) {
//    //        if (status == google.maps.DirectionsStatus.OK) {
//    //            directionsDisplay.setDirections(response);
//    //        }
//    //    });
//    //}





//})
.controller('EditCarpoolSlideCtrl', function ($scope, $state, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, $ionicHistory,$ionicModal, Account, Contacts,ContactsService, BillingFrequencies, Carpool,Geo) {

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

        if ($scope.contact.isSaved==false) {
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
                    template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
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


    });


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
                    $scope.contact = { CustomerID: '', DisplayName:'', MobileNumber: '', isMember: false, isCoordinator: false, isAccountant: false, isSaved: false, isPassenger: false, isStandBy: true, isDriverForTheRide: false, RegistrationStatus: 'Pending' };
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
                $scope.carpool.Distance = (parseFloat(distance).toFixed(2))/1;
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





})
.controller('CarpoolDetailCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicLoading, $ionicPopup, $ionicHistory, Carpool, CarpoolActivate, Ride) {
    $scope.isCoordinator = false;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    $scope.data = [];
    $scope.data.ridedate = new Date(yyyy, mm, dd);

    var buttonDetails = [
        { text: '<i class="icon ion-share"></i> New Ride' },
        { text: '<i class="icon ion-arrow-move"></i> New Expense'},
        { text: '<i class="icon ion-arrow-move"></i> Message'},
        { text: '<i class="icon ion-arrow-move"></i> Invoice & Payments'}
    ];
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
                     buttonDetails.push({ text: '<i class="icon ion-arrow-move"></i> Edit & Manage' });
                 }
    });    

    $scope.Action = $stateParams.action;  
    
    console.log(buttonDetails);
    $scope.showActionsheet = function() {
    
    $ionicActionSheet.show({
      titleText: 'Carpool Actions',
      buttons: buttonDetails,
      
      cancelText: 'Cancel',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
          console.log('BUTTON CLICKED', index);
          switch (index)
          {
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
       
        var cme = $scope.carpool.CarpoolMembers.filter(function (obj) {
            return obj.CustomerID == $stateParams.customerId;
        })[0];
        var cmeIndex= $scope.carpool.CarpoolMembers.indexOf(cme);
        $scope.carpool.CarpoolMembers[cmeIndex].RegistrationStatus = 'Active';
       
        //  CarpoolActivate = $.extend(true, {},$scope.carpool);
        var carpoolActivate = new CarpoolActivate({ CustomerID: localStorage.getItem("customerid"), Carpool: $scope.carpool })
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
                template: 'You new Carpool could not be created! Please contact Support.'
            });
            alertPopup.then(function (res) {
                console.log(carpool);
                $state.go($ionicHistory.backView().stateName);

            });

        });



    }
})
.controller('CarpoolDetailSlideCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicHistory, Carpool, CarpoolActivate, Ride, BillingFrequencies, CustomerPaymentMethod) {
        $scope.isCoordinator = false;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.data = {
            slides: [
            {
                'template': './templates/carpoolDetails/carpool-name-type.html',
                'text':'Name & Type',
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
        });

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
    })
.controller('CarpoolActionsCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicHistory, Carpool, CarpoolActivate, Ride, BillingFrequencies) {
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
        });
        
        $scope.gotoRides = function () {
            Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.carpool.Id, rideDate: $scope.data.ridedate.toDateString() }).$promise.then(function (data) {
                if (data.length == 0) $state.go('tab.new-carpool-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.carpool.Id, "usagedate": $scope.data.ridedate.toDateString(), "from": "carpool" });
                else if (data.length == 1 && data[0].ReturnJourney == 'True') $state.go('tab.edit-ride', { "rideid": data[0].Id });
                else $state.go('tab.rides', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.carpool.Id, "usagedate": $scope.data.ridedate.toDateString() });

            });

        };
      
        
       
    })
.controller('RidesCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride) {

    if ($stateParams.carpoolid != "" && $stateParams.usagedate!="")
    {

    $scope.data = {
        rideDate: new Date($stateParams.usagedate).toDateString(),
        customerid: localStorage.getItem("customerid"),
        carpoolid: $stateParams.carpoolid,
        usagedate: $stateParams.usagedate,
        rides: []

    };
    
        Ride.GetByCarpoolIDAndDate({ carpoolID: $scope.data.carpoolid, rideDate: $scope.data.rideDate }).$promise.then(function (data) {
            if (data.length == 0) $state.go('tab.new-ride', { "customerid": $scope.data.customerid, "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.usagedate });
                // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
            else $scope.data.rides = data;
        });
    }

     $scope.gotodriverrideusage = function () {
         //  alert($scope.selectedCarpool.CarpoolID);
         $state.go('tab.new-ride', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.rideDate });

       

     }
     
       

})   
.controller('NewRideCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride) {

    $scope.data = {
        contacts: [],
        passengers: [],
        billingFrequencies: [],
        selectedpassenger:[],
        newContactDisplayName: '',
        newContactMobileNumber: '',
        rideDate: new Date($stateParams.usagedate).toDateString(),
        isToDestinationChecked: true,
        isFromDestinationChecked: true,
        selectedDriverIndex:-1,
        ContactSearchStr: '',
        showDelete: true
    };



    Carpool.get({ id: $stateParams.carpoolid }).$promise.then(function (data) {
        if (data != null) {
            $scope.ride = new Ride({
                Id: '',
                CarpoolID: data.Id,
                Name: data.Name,
                Type: data.Type,
                Capacity: data.Capacity,
                CostPerRide: data.CostPerRide,
                ReturnJourney: data.TrackReturnRidesSeparately,
                StartAddress: data.StartAddress,
                EndAddress:data.EndAddress,               
                isUsageCommitted: false,
                isDriverForTheRide: false,
                isPassenger:!data.isStandBy,
                RidePassengers: []

            });
            if ($scope.ride.ReturnJourney == "True") {
                $scope.data.isToDestinationChecked = true;
                $scope.data.isFromDestinationChecked = true;
            }
            if ($scope.ride.ReturnJourney == "False") {
                $scope.data.isToDestinationChecked = true;
                $scope.data.isFromDestinationChecked = false;
            }

            if (data.CarpoolMembers != null) {
                $scope.ride.RidePassengers = data.CarpoolMembers
                $scope.data.selectedpassenger = $scope.ride.RidePassengers.filter(function (obj) {
                    return obj.CustomerID == $stateParams.customerid;
                })[0];
                $scope.data.selectedDriverIndex = $scope.ride.RidePassengers.indexOf($scope.data.selectedpassenger);
                $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isDriverForTheRide = true;
                $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isPassenger = true;

                if ($scope.data.selectedpassenger == 'undefined') $scope.data.selectedpassenger = $scope.ride.RidePassengers[0];
            }
        }

    });

    $scope.updateDriver = function () {
        $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isDriverForTheRide = false;
        $scope.data.selectedDriverIndex = $scope.ride.RidePassengers.indexOf($scope.data.selectedpassenger);

        $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isDriverForTheRide = true;
        $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isPassenger = true;

    }

    $scope.contactSelected = function (contact) {

        var index = $scope.ride.RidePassengers.indexOf(contact); // Change to filter by DisplayNAme +mobileNumber only.

        if (index < 0) {
            if (contact.mobileExists) {
                contact.isPassenger = true;
                $scope.ride.RidePassengers.push(contact);
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
                template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
            });

        }


    }
    $scope.newContact = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" placeholder="Enter Display Name" ng-model="data.newContactDisplayName"> <br> <input type="text" placeholder="Enter Mobile Number" ng-model="data.newContactMobileNumber">',
            title: 'New Contact',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if ($scope.data.newContactDisplayName == '' || $scope.data.newContactMobileNumber == '') {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {

                          var contact = { DisplayName: $scope.data.newContactDisplayName, MobileNumber: $scope.data.newContactMobileNumber, mobileExists: true, isMember: false, isCoordinator: false, isSaved: false, isPassenger: true };
                          $scope.data.contacts.splice(0, 0, contact);
                          $scope.ride.RidePassengers.push(contact);                          
                          $scope.data.newContactDisplayName = '';
                          $scope.data.newContactMobileNumber = '';
                          return contact
                      }
                  }
              },
            ]
        });


    }
    $scope.passengerSelected = function (passenger) {
       

    }

    $scope.searchContacts = function () {
        $scope.data.contacts = [];
        if ($scope.data.ContactSearchStr.length >= 3)
            Contacts.getContacts($scope.data.ContactSearchStr).then(function (_result) {

                angular.forEach(_result, function (con) {
                    var contact = {};
                    console.log('In  Contact');
                    if ((con.displayName != null) && (con.displayName.length) > 0) {
                        console.log('DisplayName-' + con.displayName);
                        contact.DisplayName = con.displayName;
                        contact.mobileExists = false;
                        contact.isMember = false;
                        contact.isPassenger = false;
                        contact.isCoordinator = false;
                        contact.isSaved = false;
                        if ((con.phoneNumbers != null)) {
                            angular.forEach(con.phoneNumbers, function (pn) {
                                console.log('In  Phone');
                                if (pn.type == 'mobile') {
                                    console.log('Found Mobile');
                                    contact.mobileExists = true;
                                    contact.MobileNumber = pn.value;
                                    if (pn.pref == true) return false;//similar to continue
                                }
                            })
                        }

                        $scope.data.contacts.push(contact);
                    }
                })

            }, function (_error) {
                console.log(_error);
            });
        else $scope.data.contacts = [];
    }

    $scope.save = function () {

        $scope.ride.RideDate = $scope.data.rideDate;
        if ($scope.data.isFromDestinationChecked) $scope.ride.ReturnJourney = true;
        for (i = 0; i < $scope.ride.RidePassengers.length; i++)
            if ($scope.ride.RidePassengers[i].isPassenger) $scope.ride.RidePassengers[i].isUsageCommitted = true;
        console.log($scope.ride);
        $ionicLoading.show({
            template: 'Saving your Ride...'
        });
        $scope.ride.$save().then(function (info) {
            $ionicLoading.hide();

            PopUpMessage = 'You new Ride is saved! Please start tracking your ride to log Carpool Miles.';
            var alertPopup = $ionicPopup.alert({
                title: 'Ride!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Ride Save");
                $scope.ride.CarpoolMembers = [];
                $scope.data.contacts = [];
                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.ride.CarpoolID, "usagedate": $scope.ride.RideDate });


            });


        }, function (error) {
            $ionicLoading.hide();
            var PopUpMessage = '';

            PopUpMessage = 'Error Creating Ride. Contact Support';
            var alertPopup = $ionicPopup.alert({
                title: 'Ride!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Ride Save");
                $scope.ride.CarpoolMembers = [];
                $scope.data.contacts = [];
                $state.go($ionicHistory.backView().stateName);

            });

        });



    }

})
.controller('EditRideCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Ride) {

    $scope.data = {
        contacts: [],
        passengers: [],
        billingFrequencies: [],
        newContactDisplayName: '',
        newContactMobileNumber: '',
        selectedpassenger:[],
        rideDate: '',
        isToDestinationChecked: true,
        isFromDestinationChecked: true,
        ContactSearchStr: '',
        showDelete: true
    };



    Ride.get({ id: $stateParams.rideid }).$promise.then(function (data) {
        if (data != null) {
            $scope.ride = data;
            if ($scope.ride.ReturnJourney == true) {
                $scope.data.isToDestinationChecked = true;
                $scope.data.isFromDestinationChecked = true;
            }
            if ($scope.ride.ReturnJourney == false) {
                $scope.data.isToDestinationChecked = true;
                $scope.data.isFromDestinationChecked = false;
            }

            if ($scope.ride.RidePassengers != null) {
                //If there is Driver selected default to teh selected drriver.
                $scope.data.selectedpassenger = $scope.ride.RidePassengers.filter(function (obj) {
                    return obj.isDriverForTheRide == true;
                })[0];
                if ($scope.data.selectedpassenger == undefined) {
                    //If there is no default driver - Set the logged in user as driver
                    $scope.data.selectedpassenger = $scope.ride.RidePassengers.filter(function (obj) {
                        return obj.CustomerID == localStorage.getItem("customerid");
                    })[0];
                   // $scope.data.selectedpassenger = data.RidePassengers[0];
                }
                if ($scope.data.selectedpassenger == undefined) 
                    //If nothing is selected chosoe teh first one in the list
                    $scope.data.selectedpassenger = data.RidePassengers[0];
            }

            

            if ($scope.ride.RideDate != null) {
                $scope.data.rideDate = new Date($scope.ride.RideDate).toDateString()
            }
        }

    });

    $scope.passengerSelected = function (passenger) {
       

    }

    $scope.contactSelected = function (contact) {

        var index = $scope.ride.RidePassengers.indexOf(contact); // Change to filter by DisplayNAme +mobileNumber only.

        if (index < 0) {
            if (contact.mobileExists) {
                contact.isPassenger = true;
                $scope.ride.RidePassengers.push(contact);
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
                template: 'Selected Contact is already a member. If you wish to un-enroll this contact from the carpool, please remove from the members list'
            });

        }


    }
    $scope.newContact = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" placeholder="Enter Display Name" ng-model="data.newContactDisplayName"> <br> <input type="text" placeholder="Enter Mobile Number" ng-model="data.newContactMobileNumber">',
            title: 'New Contact',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if ($scope.data.newContactDisplayName == '' || $scope.data.newContactMobileNumber == '') {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {

                          var contact = { DisplayName: $scope.data.newContactDisplayName, MobileNumber: $scope.data.newContactMobileNumber, mobileExists: true, isMember: false, isCoordinator: false, isSaved: false, isPassenger: true };
                          $scope.data.contacts.splice(0, 0, contact);
                          $scope.ride.RidePassengers.push(contact);
                          $scope.data.newContactDisplayName = '';
                          $scope.data.newContactMobileNumber = '';
                          return contact
                      }
                  }
              },
            ]
        });


    }


    $scope.searchContacts = function () {
        $scope.data.contacts = [];
        if ($scope.data.ContactSearchStr.length >= 3)
            Contacts.getContacts($scope.data.ContactSearchStr).then(function (_result) {

                angular.forEach(_result, function (con) {
                    var contact = {};
                    console.log('In  Contact');
                    if ((con.displayName != null) && (con.displayName.length) > 0) {
                        console.log('DisplayName-' + con.displayName);
                        contact.DisplayName = con.displayName;
                        contact.mobileExists = false;
                        contact.isMember = false;
                        contact.isPassenger = true;
                        contact.isCoordinator = false;
                        contact.isSaved = false;
                        if ((con.phoneNumbers != null)) {
                            angular.forEach(con.phoneNumbers, function (pn) {
                                console.log('In  Phone');
                                if (pn.type == 'mobile') {
                                    console.log('Found Mobile');
                                    contact.mobileExists = true;
                                    contact.MobileNumber = pn.value;
                                    if (pn.pref == true) return false;//similar to continue
                                }
                            })
                        }

                        $scope.data.contacts.push(contact);

                    }
                })

            }, function (_error) {
                console.log(_error);
            });
        else $scope.data.contacts = [];
    }

    $scope.save = function () {

       // $scope.ride.RideDate = $scope.data.rideDate;
        if ($scope.data.isFromDestinationChecked) $scope.ride.ReturnJourney = true;
        for (i = 0; i < $scope.ride.RidePassengers.length; i++)
            if ($scope.ride.RidePassengers[i].isPassenger) $scope.ride.RidePassengers[i].isUsageCommitted = true;
        console.log($scope.ride);
        $ionicLoading.show({
            template: 'Saving your Ride...'
        });
        $scope.ride.$update().then(function (info) {
            $ionicLoading.hide();

            PopUpMessage = 'You new Ride is saved! Please start tracking your ride to log Carpool Miles.';
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


        }, function (error) {
            $ionicLoading.hide();
            var PopUpMessage = '';

            PopUpMessage = 'Error Creating Ride. Contact Support';
            var alertPopup = $ionicPopup.alert({
                title: 'Ride!',
                template: PopUpMessage
            });
            alertPopup.then(function (res) {
                console.log("After Ride Save");
                $scope.ride.CarpoolMembers = [];
                $scope.data.contacts = [];
                $state.go($ionicHistory.backView().stateName);

            });

        });



    }

})
.controller('ExpensesCtrl',  function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, Carpool, Account, Contacts, Expense) {

    if ($stateParams.carpoolid != "" && $stateParams.usagedate != "") {

        $scope.data = {
            expenseDate: new Date($stateParams.usagedate).toDateString(),
            customerid: localStorage.getItem("customerid"),
            carpoolid: $stateParams.carpoolid,
            usagedate: $stateParams.usagedate,
            expenses: []

        };

        Expense.GetByCarpoolIDAndDate({ carpoolID: $scope.data.carpoolid, rideDate: $scope.data.expenseDate }).$promise.then(function (data) {
            if (data.length == 0) $state.go('tab.new-expense', { "customerid": $scope.data.customerid, "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.usagedate });
                // else if (data.length == 1) $state.go('tab.edit-ride', { "rideid": data[0].Id });
            else $scope.data.expenses = data;
        });
    }

    $scope.gotoexpense = function () {
        //  alert($scope.selectedCarpool.CarpoolID);
        $state.go('tab.new-expense', { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.data.carpoolid, "usagedate": $scope.data.expenseDate });



    }


})
.controller('NewExpenseCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, $cordovaCamera, Carpool, Account, Expense) {

    $scope.data = {


        RidePassengers: [],
        imagesrc: []

    };

    Carpool.get({ id: $stateParams.carpoolid }).$promise.then(function (data) {
        if (data != null) {
            $scope.expense = new Expense({
                Id: '',
                ExpenseDate: new Date($stateParams.usagedate).toDateString(),
                CarpoolID: data.Id,
                Name: data.Name,
                ExpenseType: 'Gas Charges',
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

                if ($scope.expense.spender == 'undefined') $scope.expense.Spender = $scope.data.RidePassengers[0];
            }
        }

    });

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



    $scope.getPhoto = function () {

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
                $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.expense.CarpoolID, "usagedate": $scope.expense.ExpenseDate });


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
.controller('EditExpenseCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $state, $ionicLoading, $cordovaCamera, Carpool, Account, Contacts, Expense) {
    $scope.data = {
       
        imagesrc: []

    };
       
        Expense.get({ id: $stateParams.expenseid }).$promise.then(function (data) {
            if (data != null) {
                $scope.expense = data;
                $scope.data.imagesrc = "data:image/jpeg;base64," + data.ReceiptImage;
            }

        });

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



        $scope.getPhoto = function () {

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
                    $scope.expense.Spender = [];
                    $state.go($ionicHistory.backView().stateName, { "customerid": localStorage.getItem("customerid"), "carpoolid": $scope.expense.CarpoolID, "usagedate": $scope.expense.ExpenseDate });

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
                    $scope.expense.Spender = [];                    
                    $state.go($ionicHistory.backView().stateName);

                });

            });



        }

    })
.controller('CarpoolMapCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $ionicHistory, applicationConfig, SignalRSvc, Geo, Carpool) {
    console.log("CarpoolMapCtrl");
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();



    $scope.LocationList = [];
    $scope.markers = {};
    $scope.options = {};
    $scope.data = {
        customerid: localStorage.getItem("customerid"),
        deviceid: localStorage.getItem("deviceid"),
        displayname : localStorage.getItem("username"),
        carpoolid: $stateParams.carpoolid,
        usagedate: new Date(yyyy, mm, dd)
    };
     // Continous Update block - This sets up continous update to SignalRSVC - Initial Map Update is in Position Function
      
       

    $scope.map = {};

    var watch = [];

   
    $scope.initialise = function () {
        console.log("In Google.maps.event.addDomListener");

        var posOptions = { timeout: 10000, enableHighAccuracy: true };
        var myLatlng = [];
        
        // This blocks gets the initial position - stores it and calls signalRSVC
       // navigator.geolocation.getCurrentPosition(function (location) {
        var position = navigator.geolocation.getCurrentPosition(function (position) {
               console.log('Position init');
                myLatlng = new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP

                    };

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    var myLocation = new google.maps.Marker({
                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        map: $scope.map,
                        title: $scope.data.displayname
                    });


                                 
                    $scope.LocationList.push(myLocation);
                    SignalRSvc.sendCarpoolLocation($scope.data.carpoolid, $scope.data.customerid, $scope.data.deviceid, position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.coords.speed, position.coords.heading, position.timestamp)
                    setupWatch(6000);
                }, function (err) {
                    // error
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
                );
    };
   

    // sets up the interval at the specified frequency
    function setupWatch(freq) {
        // global var here so it can be cleared on logout (or whenever).
        activeWatch = setInterval(watchLocation, freq);
    }

    // this is what gets called on the interval.
    function watchLocation() {
        var gcp = navigator.geolocation.getCurrentPosition(
                updateUserLoc, onLocationError, {
                    enableHighAccuracy: true
                });


        // console.log(gcp);

    }


    function updateUserLoc(position) {
       
        SignalRSvc.sendCarpoolLocation($scope.data.carpoolid, $scope.data.customerid, $scope.data.deviceid, position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.coords.speed, position.coords.heading, position.timestamp)
                
    }
    function onLocationError(error) {
        console.log(error);
    }

    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());
  
    $rootScope.$on("addCarpoolLocation", function (e, carpoollocation) {
        console.log(carpoollocation.FromCustomerID);
        $scope.$apply(function () {
            if (carpoollocation.ToCarpoolID == $stateParams.carpoolid) {
                console.log('Carpool ID:' + carpoollocation.ToCarpoolID);
                var cpl = $scope.LocationList.filter(function (obj) {
                    return obj.title == carpoollocation.FromCustomerDisplayName;
                })[0];
                console.log('Cpl' + cpl);
                if (cpl == null || cpl == 'undefined') {
                   // New CarpoolMember 
                    carpoollocation.marker = new google.maps.Marker({
                        position: new google.maps.LatLng(carpoollocation.latitude, carpoollocation.longitude),
                        map: $scope.map,
                        title: carpoollocation.FromCustomerDisplayName
                    });
                  //  $scope.LocationList.push(createMarker(carpoollocation.latitude, carpoollocation.longitude, carpoollocation.FromCustomerID,$scope.LocationList.length + 1));
                    $scope.LocationList.push(carpoollocation.marker);

                }
                else {
                    var index = $scope.LocationList.indexOf(cpl);
                    var latLang = new google.maps.LatLng(carpoollocation.latitude, carpoollocation.longitude);
                    // alert('hey');
                    // Update existing                   
                    cpl.setPosition(latLang);
                    $scope.map.panTo(latLang);
                    //cpl.setMap(null);
                    //cpl = new google.maps.Marker({
                    //    position: new google.maps.LatLng(carpoollocation.latitude, carpoollocation.longitude),
                    //    map: $scope.map,
                    //    title: carpoollocation.FromCustomerDisplayName
                    //});
                     $scope.LocationList[index] = cpl;

                }
                $scope.markers = $scope.LocationList;
            }
        });
    }); 
   

    $scope.clearWatch = function () {
        clearInterval(activeWatch);
        console.log('Stopped Watch');
        $state.go('tab.search', {}, { reload: false });
       }
    
})
.controller('CarpoolMessagingCtrl', function ($scope, $rootScope, $stateParams, $ionicScrollDelegate, Carpool, Account, SignalRSvc) {
    if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '') {
        $scope.MessageList = [];
        $scope.data = [];

        $scope.data.text = "";
        Carpool.get({ id: $stateParams.carpoolid }).$promise.then(function (data) {
            if (data != null) {
               

                if (data.CarpoolMembers != null) {
                    $scope.ride.RidePassengers = data.CarpoolMembers
                    $scope.data.selectedpassenger = $scope.ride.RidePassengers.filter(function (obj) {
                        return obj.CustomerID == $stateParams.customerid;
                    })[0];
                    $scope.data.selectedDriverIndex = $scope.ride.RidePassengers.indexOf($scope.data.selectedpassenger);
                    $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isDriverForTheRide = true;
                    $scope.ride.RidePassengers[$scope.data.selectedDriverIndex].isPassenger = true;

                    if ($scope.data.selectedpassenger == 'undefined') $scope.data.selectedpassenger = $scope.ride.RidePassengers[0];
                }
            }

        });

        if ($scope.MessageList.length == 0)
        {
            console.log('Message count:' + $scope.MessageList.length);
            Carpool.getCarpoolMessages({ carpoolID: $stateParams.carpoolid,lastMessageID:'0' }).$promise.then(function (data) {
                if (data!= null)
                    $scope.MessageList = data;
                    $ionicScrollDelegate.scrollBottom();
            });

        }

        $scope.sendCarpoolMessage = function () {
            SignalRSvc.sendCarpoolMessage($stateParams.carpoolid, $scope.data.text, "");
            $scope.data.text = "";
        }
        //Updating greeting message after receiving a message through the event

        $rootScope.$on("addCarpoolMessage", function (e, message) {
            $scope.$apply(function () {
                if (message.ToCarpoolID == $stateParams.carpoolid) {
                    console.log('Message ID:' + message.ToCarpoolID);

                    var msg = $scope.MessageList.filter(function (obj) {
                        return obj.MessageID == message.MessageID;
                    })[0];
                    console.log('Msg' + msg);
                    if (msg == null || msg == 'undefined') {
                        $scope.MessageList.push(message);
                        $ionicScrollDelegate.scrollBottom();
                    }
                }
            });
        });


    }
    else {
        $state.go('tab.search', {}, { reload: true });

    }
})
.controller('emailLoginCtrl', ['$scope', '$http', '$state', '$cordovaDevice', '$q', '$ionicLoading', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', function ($scope, $http, $state, cordovaDevice, $q, $ionicLoading, applicationConfig, EmailValidation, Account, SignalRSvc) {
    
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
            
        });
    }
    }])
.controller('LoginCtrl', ['$scope', '$http', '$state', '$cordovaDevice', '$q', '$ionicLoading','$ionicHistory', '$ionicPopup','applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', function ($scope, $http, $state, cordovaDevice, $q, $ionicLoading,$ionicHistory,$ionicPopup, applicationConfig, MobileValidation, Account, SignalRSvc) {


    $scope.mobilenumber = "";
    $scope.data = {};
    $scope.data.mobilenumber = "";
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
            deviceid = $cordovaDevice.getUUID();
         

        }
        catch (e) {
            console.log(e);

        }
        // if ($scope.data.mobilenumber.charAt(0) === '+') $scope.data.mobilenumber = $scope.data.mobilenumber.substr(1);
        console.log($scope.data.mobilenumber);
        $scope.data.mobilenumber=intlTelInputUtils.formatNumberByType($scope.data.mobilenumber, "US");
        MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.data.mobilenumber, deviceid).success(function (data) {
            
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("username", $scope.data.mobilenumber);
            Account.getByMobileNumber({ mobileNumber: $scope.data.mobilenumber, type: 'type' }).$promise.then(function (data) {

                $ionicLoading.hide();

                if (data.Id == null || data.Id == 'undefined') {
                    console.log("Something ad happened on server. Index is stale");
                    $scope.showAlert = function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Server Timeout',
                            template: 'Please try again later'
                        });

                    }
                }
                else {
                    localStorage.setItem("customerid", data.Id);
                    localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                    localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                    SignalRSvc.initialize();
                    if (data.email == null || data.customerOrganization == null) $state.go('securityemailLogin', {}, { reload: true });
                    else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                    else $state.go('tab.search', {}, { reload: true });
                   
                }

            });



        })
        .error(function (error) {
            $ionicLoading.hide();
            if (error == null) {
                console.log('application server not available');
                $ionicPopup.alert({
                    title: 'Error Message!',
                    template: 'application server not available. contact support'
                });
            }
            if (error.error_description == "The user name or password is incorrect.") {
                console.log("getting device info");
               
                var device = '';
                var cordova = '';
                var model = '';
                var platform = '';
                var uuid = '';
                var version = '';

                try {
                    device = cordovaDevice.getDevice();
                    cordova = cordovaDevice.getCordova();
                    model = cordovaDevice.getModel();
                    platform = cordovaDevice.getPlatform();
                    uuid = cordovaDevice.getUUID();
                    version = cordovaDevice.getVersion();
                }
                catch (e) {
                    console.log('Not a Mobile Device' + e);
                    try {
                        device = navigator.appCodeName;
                        cordova = navigator.platform;
                        model = navigator.appVersion;
                        platform = navigator.product;
                        version = navigator.appVersionnavigator.userAgent;

                    }
                    catch (ex) {
                        console.log('Not a Mobile Device and Not a Browser' + ex);

                    }

                }
                //Account.getByMobileNumber({ mobileNumber: $scope.data.mobilenumber, type: 'type' }).$promise.then(function (data) {
                //    $scope.customer = data;
                //    $ionicLoading.hide();

                //    if (data.Id == null || data.Id == 'undefined') {
                //        console.log("Something ad happened on server. Index is stale");
                //        $scope.showAlert = function () {
                //            var alertPopup = $ionicPopup.alert({
                //                title: 'Server Timeout',
                //                template: 'Please try again later'
                //            });

                //        }
                //    }
                //    else {
                //        localStorage.setItem("customerid", data.Id);
                //        localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                //        localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                //        SignalRSvc.initialize();
                //        if (data.email == null || data.customerOrganization == null) $state.go('securityemailLogin', {}, { reload: true });
                //        else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                //        else $state.go('tab.search', {}, { reload: true });

                //    }

                //});
               // if ($scope.customer == null || $scope.customer == undefined) {
                    // Customer Mobile does not exit
                    $scope.Account = new Account({ MobileNumber: $scope.data.mobilenumber, DeviceID: uuid, DeviceName: device, DeviceModel: model, DevicePlatform: platform, DeviceVersion: version });
                    $scope.Account.$save().then(function (info) {
                        $scope.Account = info;
                        //$state.go('tab.Organization');
                        if ($scope.Account.isNew)
                            $state.go('securityregistration', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });
                        else
                            $state.go('securitymobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });

                        console.log($scope.Account.VerificationCode);
                    });
              //  }

            }

        })

    }
}])
.controller('emailVerificationCodeCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'Organization', function ($scope, $http, $state, $stateParams, $ionicPopup, applicationConfig, EmailValidation, Account, SignalRSvc, Organization){
    $scope.emailverificationcode = "";
    $scope.verificationCode = $stateParams.emailverificationCode; // ???
    var x = $stateParams.provider;
    $scope.verifyCode = function (emailverificationcode) {
        $scope.emailverificationcode = emailverificationcode;
       
        if ($scope.emailverificationcode == $scope.verificationCode) {
            Organization.getByProvider({ provider: x , p:1}).$promise.then(function (data) {
                if (data.Id == null)
                {
                    $state.go('tab.Organization', {provider : x} );
                }
                else
                {
                    $state.go('tab.Customer', { "orgID": data.Id})
                }

            }); 
        }
        
    }
}])
.controller('VerificationCodeCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$cordovaDevice', '$ionicHistory', 'applicationConfig', 'MobileValidation', 'Account', 'SignalRSvc', function ($scope, $http, $state, $stateParams, $ionicPopup, $cordovaDevice, $ionicHistory,applicationConfig, MobileValidation, Account, SignalRSvc) {

    $scope.mobileverificationcode = "";
    $scope.mobilenumber = $stateParams.mobileNumber;
    $scope.data = {};
    $scope.data.disableLogin = false;
    $scope.data.mobileverificationcode=""
    $scope.customerID = $stateParams.customerID;
    $scope.verificationCode = $stateParams.verificationCode;
    $scope.$on('$ionicView.beforeEnter', function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        //$ionicNavBarDelegate.showBackButton(false);
        console.log($ionicHistory.viewHistory());
    });

    $scope.verifyCode = function (mobileverificationcode) {
        $scope.mobileverificationcode = $scope.data.mobileverificationcode;
        if ($scope.mobileverificationcode == $scope.verificationCode) {
            $scope.Account = new Account({ Id: $scope.customerID, MobileNumber:$scope.mobilenumber, VerificationCode: $scope.mobileverificationcode, isVerified: true, CostPerRide: -1 });
            $scope.Account.$update().then(function (info) {
                if (info.isVerified == true) {
                    $scope.mobilenumber = info.MobileNumber;
                    var deviceid = $scope.mobileverificationcode;
                   
                    MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.mobilenumber, deviceid).success(function (data) {

                        localStorage.setItem("access_token", data.access_token);
                        localStorage.setItem("username", $scope.mobilenumber);
                        Account.getByMobileNumber({ mobileNumber: $scope.mobilenumber, type: 'type' }).$promise.then(function (data) {

                            if (data.Id == null || data.Id == 'undefined') {
                                console.log("Something ad happened on server. Index is stale");
                                $scope.showAlert = function () {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Server Timeout',
                                        template: 'Sorry for the inconvenienve, please try again later'
                                    });
                                    alertPopup.then(function (res) {
                                        console.log('Server Timeout alerted');
                                    });

                                }
                            }
                            else {
                                localStorage.setItem("customerid", data.Id);
                                localStorage.setItem("platformfeerate", data.PlatformFeePercentage);
                                localStorage.setItem("platformfeeflat", data.PlatformFeeFlat);
                               
                                SignalRSvc.initialize();
                                if (data.email == null || data.customerOrganization == null) $state.go('securityemaillogin', {}, { reload: true });
                                else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") $state.go('securitycustomeredit', {}, { reload: true });
                                else $state.go('tab.search', {}, { reload: true });

                              
                               // $state.go('tab.search', {}, { reload: true });
                                //$state.go('tab.email-Verification', {  email: "bob@yahoo.com", verificationCode: $scope.EmailValidation.v });
                            }


                        });


                    })
                .error(function (error) {
                    //alert('Could not login');
                    if (error.error_description == "The user name or password is incorrect.") {
                        $ionicPopup.alert({
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
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Warning Message!',
                template: 'Invalid Code. Please re-enter the Correct validation code'
            });
            alertPopup.then(function (res) {
                $scope.data.disableLogin = false;

            });

        }
    }

    $scope.resendVerificationCode = function (mobileverificationcode) {
        $scope.Account = new Account({ MobileNumber: $scope.mobilenumber });
        $scope.Account.$save().then(function (info) {
            $scope.Account = info;
            $scope.verificationCode = info.VerificationCode;
            var alertPopup = $ionicPopup.alert({
                title: 'Verification Code Resent!',
                template: 'A new verification was sent to your phone -' + $scope.mobilenumber+'. Please enter the  validation code and validate.'
            });
            alertPopup.then(function (res) {
                //$state.go('tab.account.mobilelogin.mobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });
                $scope.data.disableLogin = false;

            });
            //$state.go('tab.account-verification', { mobileNumber: $scope.Account.MobileNumber});

        });

    }

}])
.controller('OrganizationCtrl',['$scope', '$http', '$state', '$stateParams', '$ionicPopup', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'Organization', function ($scope, $http, $state, $stateParams, $ionicPopup, applicationConfig, EmailValidation, Account, SignalRSvc, Organization) {
    
    var domain = $stateParams.provider;
    $scope.data = { OrganizationLocation: '', OrganizationEmailDomain: domain };
    $scope.organization = new Organization({
        Id: '',
        OrganizationName: '',
        OrganizationLocation: [],
        OrganizationEmailDomain: []
    });
    $scope.organizationSave = function (org)
    {
      
        if(org.$valid)
        {
            
            $scope.organization.OrganizationLocation.splice(0, 0, $scope.data.OrganizationLocation);
            $scope.organization.OrganizationEmailDomain.splice(0, 0, $scope.data.OrganizationEmailDomain);
            $scope.organization.$save().then(function (info) {
               
                $state.go('tab.Customer', { "orgID": info.Id})
            });
        }
    }
  }])
.controller('CustomerCtrl', ['$scope', '$http', '$state', '$stateParams', '$cordovaDevice', '$q', '$ionicLoading', 'applicationConfig', 'MobileValidation', 'Account', 'Organization', function ($scope, $http, $state,  $stateParams,cordovaDevice, $q, $ionicLoading, applicationConfig, MobileValidation, Account, Organization) {
    
    Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
        $scope.customer = data;

        Organization.get({ id: $stateParams.orgID }).$promise.then(function (data) {
            $scope.customer.customerOrganization = data;
        });
    });
   
   

    $scope.customerSave = function (cust) {
        //$scope.customer.EndLocation = $scope.data.selectedEndLocation;
        // $scope.ride.RideDate = $scope.data.rideDate;
        $ionicLoading.show({
            template: 'Saving your info...'
        });
        
        $scope.customer.$update().then(function (info) {
            $ionicLoading.hide();
            $state.go( 'tab.search');

        });


    }, function (error) {
        $ionicLoading.hide();
    
 

    };



    }
])
.controller('RegistartionSlideCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate','$ionicLoading','$cordovaDevice','$timeout', 'applicationConfig', 'MobileValidation','EmailValidation', 'Account', 'Organization','SignalRSvc','ContactsService','ngFB','Geo', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate,$ionicLoading,$cordovaDevice,$timeout, applicationConfig, MobileValidation,EmailValidation, Account,Organization, SignalRSvc,ContactsService,ngFB,Geo) {
    $timeout(function () {
        $ionicSlideBoxDelegate.enableSlide(false);
    });
    $scope.mobileverificationcode = "";
    $scope.mobilenumber = $stateParams.mobileNumber;
    $scope.customerID = $stateParams.customerID;
    $scope.verificationCode = $stateParams.verificationCode;
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
        emailverificationcode:'',
        skipEmailVerification:false,
        OrganizationLocation: '',
        OrganizationEmailDomain: '',
        selectedContacts: [],
        showDelete: false,
        skipButtonDisabled: false
       
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
            var fromLat = isNaN($scope.customer.HomeLocation.geometry.location.lat)? $scope.customer.HomeLocation.geometry.location.lat() : $scope.customer.HomeLocation.geometry.location.lat;
            var fromLng = isNaN($scope.customer.HomeLocation.geometry.location.lng) ? $scope.customer.HomeLocation.geometry.location.lng() : $scope.customer.HomeLocation.geometry.location.lng;

            var toLat = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lat() : $scope.customer.EndLocation.geometry.location.lat;
            var toLng = isNaN($scope.customer.EndLocation.geometry.location.lat) ? $scope.customer.EndLocation.geometry.location.lng() : $scope.customer.EndLocation.geometry.location.lng;
            if (fromLat != 0 && fromLng != 0 && toLat != 0 && toLng != 0) {
               var distance = Geo.getDistance(fromLat, fromLng, toLat, toLng,'M');
               $scope.customer.Distance = parseFloat(distance).toFixed(2);
               if ($scope.customer.CostPerRide == 0) {
                   $scope.customer.CostPerRide = (parseFloat($scope.customer.Distance / 4).toFixed(2))/1;
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
        // $scope.data.mobileverificationcode = mobileverificationcode;
       

        if ($scope.data.mobileverificationcode == $scope.verificationCode) {
            $scope.Account = new Account({ Id: $scope.customerID, MobileNumber: $scope.mobilenumber, VerificationCode: $scope.data.mobileverificationcode, isVerified: true });
            $scope.Account.$update().then(function (info) {
                if (info.isVerified == true) {
                    $scope.mobilenumber = info.MobileNumber;
                    var deviceid = $scope.verificationCode;
                    
                    MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken($scope.mobilenumber, deviceid).success(function (data) {

                        localStorage.setItem("access_token", data.access_token);
                        localStorage.setItem("username", $scope.mobilenumber);
                        Account.getByMobileNumber({ mobileNumber: $scope.mobilenumber, type: 'type' }).$promise.then(function (data) {

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
                                $scope.customer = data;
                                SignalRSvc.initialize();
                                $ionicSlideBoxDelegate.next();
                                //$state.go('tab.emailLogin');
                                //$state.go('tab.email-Verification', {  email: "bob@yahoo.com", verificationCode: $scope.EmailValidation.v });
                            }


                        });


                    })
                .error(function (error) {
                    //alert('Could not login');
                    if (error.error_description == "The user name or password is incorrect.") {
                        var alertPopup=$ionicPopup.alert({
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
            });
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

    $scope.resendVerificationCode = function (mobileverificationcode) {
        $scope.Account = new Account({ MobileNumber: $scope.mobilenumber });
        $scope.Account.$save().then(function (info) {
            $scope.Account = info;
            $scope.verificationCode = info.VerificationCode;
            var alertPopup = $ionicPopup.alert({
                title: 'Verification Code Resent!',
                template: 'A new verification was sent to your phone -' + $scope.mobilenumber + '. Please enter the  validation code and validate.'
            });
            alertPopup.then(function (res) {
                //$state.go('tab.account.mobilelogin.mobileverification', { customerID: $scope.Account.Id, mobileNumber: $scope.Account.MobileNumber, verificationCode: $scope.Account.VerificationCode });


            });
        });

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

        });
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

        });

    }
    
    $scope.verifyEmailCode = function (emailverificationcode) {
        //$scope.emailverificationcode = emailverificationcode;

        if ($scope.emailVerificationCode == $scope.data.emailverificationcode) {
           // $scope.EmailValidation = new EmailValidation({ Id: $scope.customerID, email: info.email, VerificationCode: $scope.emailVerificationCode, isVerified: true });
            Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (info) {
                $scope.customer = info;
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
                                $ionicSlideBoxDelegate.next();
                                $ionicSlideBoxDelegate.next();
                        }

                    });
                });//end of Account Update
            }); //End of account get
        }
        else
        {
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
            });//end of Account Update
        }); //End of account get
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
                   
                });
               
            });
       
    }

   

    $scope.customerSave = function (cust) {
        //$scope.customer.EndLocation = $scope.data.selectedEndLocation;
        // $scope.ride.RideDate = $scope.data.rideDate;
        if ($scope.customer.HomeLocation != undefined) {
            try{
               // $scope.customer.HomeLocation.geometry.location.lat = $scope.customer.HomeLocation.geometry.location.lat();
               // $scope.customer.HomeLocation.geometry.location.lng = $scope.customer.HomeLocation.geometry.location.lng();
            }
            catch (e) {
                console.log('Home Location Not defined/updated')
            }
            }
        if ($scope.customer.EndLocation != undefined) {
            try
            {
             //   $scope.customer.EndLocation.geometry.location.lat = $scope.customer.EndLocation.geometry.location.lat();
              //  $scope.customer.EndLocation.geometry.location.lng = $scope.customer.EndLocation.geometry.location.lng();
            }
            catch(e)
            {
                console.log('End Location Not defined/updated')

            }
            }
        $ionicLoading.show({
            template: 'Saving your info...'
        });
        if ($scope.data.selectedContacts.length > 0) $scope.customer.Contacts = $scope.data.selectedContacts;
        $scope.customer.CustomerSchedule = $scope.Schedule;
        $scope.customer.$update().then(function (info) {
                $ionicLoading.hide();
            //  $state.go('tab.dash');
            $ionicSlideBoxDelegate.next();

        });


    }, function (error) {
        $ionicLoading.hide();
    };

    $scope.customersaveandgo = function (cust) {
        $scope.customerSave(cust);
        var alertPopup = $ionicPopup.alert({
            title: 'Info Saved!',
            template: 'Thank You. You profile is updated!'
        });
        alertPopup.then(function (res) {
            $state.go('tab.search', {}, { reload: true });
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
                    if (con.emails != null && con.emails.length > 0)
                    contact.Email = con.emails[0].value;
                   
                    if (con.photos != null && con.photos.length > 0)
                        contact.Photo = con.photos[0].value;
                    contact.isSaved = false;
                    if ((con.phones != null && con.phones.length>0)) {
                        contact.Phone = con.phones[0].value;
                        angular.forEach(con.phones, function (pn) {
                            console.log('In  Phone');
                            if (pn.type == 'mobile') {
                                console.log('Found Mobile');                                
                                contact.MobileNumber = pn.value;
                                if (pn.pref == true) return false;//similar to continue
                            }
                        })
                    }

                    // $scope.data.contacts.push(contact);
                    $scope.data.selectedContacts.push(contact);
                    console.log("Selected contacts=");
                    console.log($scope.data.selectedContacts);
                

                

            },
            function (failure) {
                console.log("Bummer.  Failed to pick a contact");
                var alertPopup = $ionicPopup.alert({
                    title: 'Bummer',
                    template: 'Failed to pick a contact.'
                });
                alertPopup.then(function (res) {
                    console.log('Failed to pick a contact');
                });
            }
        );

    };
  
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
    


}])
.controller('EmailOrganizationCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', 'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB) {
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        });
        $scope.mobileverificationcode = "";
        $scope.mobilenumber = $stateParams.mobileNumber;
        $scope.customerID = $stateParams.customerID;
        $scope.verificationCode = $stateParams.verificationCode;
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


        });

     

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

            });
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

            });

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
                                    else $state.go('tab.search', {}, { reload: true });

                                });
                            }

                        });
                    });//end of Account Update
                
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
                                else $state.go('tab.search', {}, { reload: true });

                            });
                          
                        }

                    });
                });//end of Account Update
            
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
                        else $state.go('tab.search', {}, { reload: true });

                    });

              

            });

        }

         $scope.customerSave = function (cust) {
            $ionicLoading.show({
                template: 'Saving your info...'
            });
            if ($scope.data.selectedContacts.length > 0) $scope.customer.Contacts = $scope.data.selectedContacts;
           
            $scope.customer.$update().then(function (info) {
                $ionicLoading.hide();
                //  $state.go('tab.dash');
             

            });


        }, function (error) {
            $ionicLoading.hide();
        };
         $scope.customersaveandgo = function (cust) {
             $scope.customerSave(cust);
             var alertPopup = $ionicPopup.alert({
                 title: 'Info Saved!',
                 template: 'Thank You. You profile is updated!'
             });
             alertPopup.then(function (res) {
                 $state.go('tab.search', {}, { reload: true });
             });

         }

        

       



    }])
.controller('CustomerEditSlideCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$cordovaDevice', '$timeout', 'applicationConfig', 'MobileValidation', 'EmailValidation', 'Account', 'Organization', 'SignalRSvc', 'ContactsService', 'ngFB','Geo', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaDevice, $timeout, applicationConfig, MobileValidation, EmailValidation, Account, Organization, SignalRSvc, ContactsService, ngFB,Geo) {
    $timeout(function () {
        $ionicSlideBoxDelegate.enableSlide(false);
    });
    $scope.mobileverificationcode = "";
    $scope.mobilenumber = $stateParams.mobileNumber;
    $scope.customerID = $stateParams.customerID;
    $scope.verificationCode = $stateParams.verificationCode;
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
        if($scope.customer.Contacts!=null)$scope.data.selectedContacts = $scope.customer.Contacts;
        if ($scope.customer.Distance <= 0) $scope.calculateDistance('server');
        if ($scope.customer.CostPerRide > 0 && ($scope.customer.PlatformFeePerRide <= 0 || $scope.customer.TotalCostPerRide < 0)) $scope.calculateFees();
        if ($scope.customer.CustomerSchedule != null) {
            //  $scope.Schedule = $scope.customer.CustomerSchedule;
            if ($scope.customer.CustomerSchedule.Sunday || $scope.customer.CustomerSchedule.Monday || $scope.customer.CustomerSchedule.Tuesday || $scope.customer.CustomerSchedule.Wednesday || $scope.customer.CustomerSchedule.Thursday || $scope.customer.CustomerSchedule.Friday || $scope.customer.CustomerSchedule.Friday)
            {
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

    });



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
         $scope.customer.CustomerSchedule=$scope.Schedule ;
        $scope.customer.$update().then(function (info) {
            $ionicLoading.hide();
            //  $state.go('tab.dash');
            $ionicSlideBoxDelegate.next();

        });


    }, function (error) {
        $ionicLoading.hide();
    };

    $scope.customersaveandgo = function (cust) {
        $scope.customerSave(cust);
        var alertPopup = $ionicPopup.alert({
            title: 'Info Saved!',
            template: 'Thank You. You profile is updated!'
        });
        alertPopup.then(function (res) {
            $state.go('tab.search', {}, { reload: true });
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
                            contact.MobileNumber = pn.value;
                            if (pn.pref == true) return false;//similar to continue
                        }
                    })
                }

                // $scope.data.contacts.push(contact);
                $scope.data.selectedContacts.push(contact);
                console.log("Selected contacts=");
                console.log($scope.data.selectedContacts);




            },
            function (failure) {
                console.log("Bummer.  Failed to pick a contact");
                var alertPopup = $ionicPopup.alert({
                    title: 'Bummer',
                    template: 'Failed to pick a contact.'
                });
                alertPopup.then(function (res) {
                    console.log('Failed to pick a contact');
                });
            }
        );

    };

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



}])
.controller('SearchCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup','$ionicLoading', 'applicationConfig', 'EmailValidation', 'Account', 'SignalRSvc', 'Carpool','Ride', function ($scope, $http, $state, $stateParams, $ionicPopup,$ionicLoading, applicationConfig, EmailValidation, Account, SignalRSvc, Carpool,Ride) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
  
    $scope.CustomerID = localStorage.getItem("customerid");  
    $scope.data = {};
    $scope.data.showSearch = true;
    $scope.data.toggleString = "Hide";
    $scope.data.ridedate = new Date(yyyy, mm, dd);
    $scope.data.fromWithinRadiusOf = 5;
    $scope.data.toWithinRadiusOf = 1;
    $scope.map = { center: { latitude: 40.1451, longitude: -99.6680 }, zoom: 16, bounds: {} };
    $scope.options = { scrollwheel: true };
    $scope.showMap = true;
    $scope.showList = false;
    $scope.showInvitations = false;
    $scope.showSection = function (sec) {
        $scope.showMap = false;
        $scope.showList = false;
        $scope.showInvitations = false;
        switch(sec)
        {
            case 'map': $scope.showMap = true; break;
            case 'list': $scope.showList = true; break;
            case 'invitation': $scope.showInvitations = true; break;
        }
        
    }
    var createMarker = function (ride) {
        idKey = "id";   
       
        var ret = {
            latitude: ride.StartAddress.geometry.location.lat,
            longitude: ride.StartAddress.geometry.location.lng,
            title: ride.Name + '</br>' + 'Cost-' + ride.TotalCostPerRide + '</br>' + 'Start Address-' + ride.StartAddress.formatted_address + '</br>' + 'End Address-' + ride.EndAddress.formatted_address,
            ride: ride,
            icon: ride.Type == 'Carpool' ? 'img/van.png' : 'img/car.png',
            ridedate: $scope.data.ridedate,
            displayname: $scope.customer.FirstName + ' ' + $scope.customer.LastName,
            show: false

        };
        ret[idKey] = ride.StartAddress.place_id;
        return ret
    };
    $scope.onClick = function (marker, eventName, model) {
        console.log("Clicked!");
        model.show = !model.show;
    };
  
    var markers = [];
    $scope.randomMarkers = [];
    // Get the bounds from the map once it's loaded
   
    $scope.toggleShowSearch = function (flag) {
        $scope.data.showSearch = flag;
        $scope.data.toggleString = flag ? "Hide" : "Show";

    }
    if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != "") {
        $ionicLoading.show({
            template: 'loading'
        })
        Account.get({ id: localStorage.getItem("customerid") }).$promise.then(function (data) {
            $ionicLoading.hide();
            if (data.email == null || data.customerOrganization == null) {
                //$ionicPopup.alert({
                //    title: 'Account Setup is not Finished!',
                //    template: 'We need a little more information from you before you can start zipcommuting!'
                //})
                //.then(function (res) {
                //    $state.go('tab.search.emaillogin', {}, { reload: true });
                //    return true;

                //});
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
                $state.go('tab.account.customeredit', {}, { reload: true }); return true;

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
           
        });
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

    $scope.getRide = function () {
       
        var temp=new Date($scope.data.ridedate).toDateString();
          
        Ride.GetByDateLocationAndDirection({ rideDate: new Date(temp).toDateString(), fromLat: $scope.data.StartAddress.geometry.location.lat, fromLng: $scope.data.StartAddress.geometry.location.lng, toLat: $scope.data.EndAddress.geometry.location.lat, toLng: $scope.data.EndAddress.geometry.location.lng, fromWithinRadiusOf: $scope.data.fromWithinRadiusOf, toWithinRadiusOf: $scope.data.toWithinRadiusOf, direction: 'Both' }).$promise.then(function (data) {
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
          
        });

    }
    $scope.getRideRequestsAndCarpoolInvites = function () {
        var temp = new Date($scope.data.ridedate).toDateString();

        Ride.GetRideRequestsAndCarpoolInvites({ customerID: localStorage.getItem("customerid"), rideDate: new Date(temp).toDateString(), type: 'type', flag: 'flag' }).$promise.then(function (data) {
            $scope.requestRides = data.Rides;
            $scope.carpoolInvites = data.Carpools;

        });

    }

 
}])
.controller('infoWindowCtrl', function ($scope,$state) {
    $scope.viewDetails = function () {
        //alert($scope.$parent.model.url);
        var ride = $scope.$parent.model.ride;
        var id = (ride.Id != null && ride.Id != '') ? ride.Id : (ride.Type == 'Carpool' ? ride.CarpoolID : ride.CustomerID);
        var type = (ride.Id != '' && ride.Id != null) ? 'Ride' : ride.Type
        var ridedate = $scope.$parent.model.ridedate.toDateString();
        var displayname = $scope.$parent.model.displayname
        $state.go('tab.search.attendance', { "id": id, "type": type, "usagedate": ridedate, "displayname": displayname, "mode": "search" });

    }
})
.controller('PaymentsCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading','$braintree', 'applicationConfig','CustomerPaymentMethod','Account', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading,$braintree, applicationConfig,CustomerPaymentMethod,Account) {
    $scope.card = {
         firstname: '',
         lastname: '',
         address:{},
         number: '',
         cvc: '',
         exp_month: '',
         exp_year: '',
         brand:''
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
                 $ionicPopup.alert({
                     title: 'Error!',
                     template: 'Error retrieving your on-file card details'
                 });

             });
         }, function (error) {
             $ionicLoading.hide();
             $ionicPopup.alert({
                 title: 'Error!',
                 template: 'Error retrieving your details'
             });

         });
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
                 expirationMonth: $scope.card.exp_month ,
                 expirationYear :$scope.card.exp_year
             }, function (err, nonce) {

                 // - Send nonce to your server (e.g. to make a transaction)
                // $scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), last4: '', funding: '', brand: '', SingleUseToken: nonce,PaymentMethodType:'braintree' });
                 var last4 = $scope.card.number.slice(-4);
                 $scope.CustomerPaymentMethod = new CustomerPaymentMethod({ Id: localStorage.getItem("customerid"), CCFirstName: $scope.card.firstname, CCLastName: $scope.card.lastname, CCAddress: $scope.card.address, last4: last4, expirationMonth: $scope.card.exp_month, expirationYear: $scope.card.exp_year, funding: '', brand: $scope.card.brand, SingleUseToken: nonce, PaymentMethodType: 'braintree' });

                 $scope.CustomerPaymentMethod.$update().then(function (info) {
                     $ionicLoading.hide();
                     $ionicPopup.alert({
                         title: 'Success Registering Card',
                         template: 'Your Card is Registered'
                     });
                     alertPopup.then(function (res) {
                       
                         console.log('Could not Authenticate');
                         $state.go('tab.search', {}, { reload: true });
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
                    
             //        $state.go('tab.search', {}, { reload: true });
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


 }])
.controller('AccountsCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading','$ionicHistory','$ionicActionSheet',  'applicationConfig', 'Account', function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading,$ionicHistory,$ionicActionSheet, applicationConfig, Account) {
       
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
                    text: '<i class="icon ion-iphone"></i> Mobile # Validation'
                },
                {
                    text: '<i class="icon ion-email"></i> Email and Company Validation'
                },
                 {
                     text: '<i class="icon ion-person"></i> Edit Personal Info'
                 },
                  {
                      text: '<i class="icon ion-card"></i> Update Credit Card'
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
                            $state.go('tab.account.emaillogin');
                            break;
                        }
                        case 2: {
                            $state.go('tab.account.customeredit');
                            break;
                        }
                        case 3: {
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
        if (localStorage.getItem("customerid") != null && localStorage.getItem("customerid") != '')
        {
            Account.getWithAccountBalance({ accountid: localStorage.getItem("customerid"), withAccount: 'test', flag: 'test' }).$promise.then(function (data) {
                $scope.customer = data;
                $ionicLoading.hide();
                if (data.email == null || data.customerOrganization == null) {
                    $ionicPopup.alert({
                        title: 'Account Setup is not Finished!',
                        template: 'We need a little more information from you before you can start zipcommuting!'
                    })
                    .then(function (res) {
                        $state.go('tab.account.emaillogin', {}, { reload: true });
                        return true;

                    });

                }
                else if (data.PlatformAccountBillingID == "00000000-0000-0000-0000-000000000000") {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Account Setup is not Finished!',
                        template: 'We need a little more information from you before you can start zipcommuting!'
                    })
                    .then(function (res) {
                        $state.go('tab.account.customeredit', {}, { reload: true }); return true;

                    });

                }
            });
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
                       $state.go('tab.account.mobilelogin');
                       return true;

                   });
            //$state.go('tab.account.mobilelogin');
        }
       


    }])
.controller('BackgroundGeoLocationCtrl', function($scope, $cordovaBackgroundGeolocation, $cordovaDevice, applicationConfig, GeoLocation) {
    var deviceID = '';

    try {
        deviceID = $cordovaDevice.getUUID();
        }
    catch(ex) {
        console.log('not a cordova device');
        }

    var options = {
        // https://github.com/christocracy/cordova-plugin-background-geolocation#config
                url: applicationConfig.apiUrl + 'api/GeoLocation', // <-- Android ONLY:  your server url to send locations to
                params: {
                auth_token: 'kuruba',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            MobileNumber: localStorage.getItem("username"),   //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            DeviceId: deviceID
        },
        headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
            "Authorization": "Bearer " + localStorage.getItem("access_token")
        },
        desiredAccuracy: 100,
        stationaryRadius: 30,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
             locationTimeout: 600 //The minimum time interval between location updates, in seconds

    };


    $cordovaBackgroundGeolocation.configure(options).then(function (location) {
        console.log(location);
        $scope.GeoLocation = location;
        $scope.GeoLocation.$save().then(function (info) {
            console.log('Location Saved');

        });

    }, function (err) {
        console.error(err);
        ;
    });


    $scope.stopBackgroundGeolocation = function () {
        $cordovaBackgroundGeolocation.stop();
    };
});


//.controller('CarpoolMapCtrl', function($scope, $rootScope,$stateParams, $state, $ionicLoading, $cordovaGeolocation, $ionicHistory,$compile, SignalRSvc, Geo, Carpool) {

//   var watch = $cordovaGeolocation.watchPosition({ frequency: 100 });
//    //function initialize() {
//  //  var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

//  //  var mapOptions = {
//  //    center: myLatlng,
//  //    zoom: 16,
//  //    mapTypeId: google.maps.MapTypeId.ROADMAP
//  //  };

//  //  var map = new google.maps.Map(document.getElementById("map"),
//  //      mapOptions);



//  //  //Marker + infowindow + angularjs compiled ng-click
//  //  var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
//  //  var compiled = $compile(contentString)($scope);

//  //  var infowindow = new google.maps.InfoWindow({
//  //    content: compiled[0]
//  //  });

//  //  var marker = new google.maps.Marker({
//  //    position: myLatlng,
//  //    map: map,
//  //    title: 'Uluru (Ayers Rock)'
//  //  });

//  //  google.maps.event.addListener(marker, 'click', function() {
//  //    infowindow.open(map,marker);
//  //  });

//  //  $scope.map = map;
//  //}
//    // google.maps.event.addDomListener(window, 'load', initialize);

//        var initialize = function () {
//            console.log("In Google.maps.event.addDomListener");

//            var posOptions = { timeout: 10000, enableHighAccuracy: true };
//            var position = $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
//                console.log('Position init');
//                var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                var mapOptions = {
//                    center: myLatlng,
//                    zoom: 16,
//                    mapTypeId: google.maps.MapTypeId.ROADMAP,
//                    bounds: {}

//                };
//                 map = new google.maps.Map(document.getElementById("map"), mapOptions);
//                //$scope.map = mapOptions;
//                //$scope.options = {
//                //    scrollwheel: false
//                //};

//                var lat = [];
//                var long = [];
//                var myLocationMarker = [];


//                var isFirstUpdate = true;


//                watch.promise.then(function () {/* Not  used */ },
//                  function (err) {
//                      // An error occurred.
//                  },
//                  function (pos) {

//                      //first remove teh initial position
//                      if (isFirstUpdate) {
//                          isFirstUpdate = false;
//                          if (myLocationMarker.length > 0)
//                              myLocationMarker.setMap(null);

//                      }

//                      // Active updates of the position here
//                      // position.coords.[ latitude / longitude]
//                      // this is where you will add your code to track changes in co-ordinates
//                      console.log(pos);
//                      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//                      var myLocation = new google.maps.Marker({
//                          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
//                          map: map,
//                          title: "My Location"
//                      });
//                       $scope.LocationList.push(createMarker(pos.coords.latitude, pos.coords.longitude, $scope.data.customerid, $scope.LocationList.length + 1));


//                      SignalRSvc.sendCarpoolLocation($scope.data.carpoolid, $scope.data.customerid, $scope.data.deviceid, pos.coords.latitude,pos.coords.longitude, pos.coords.accuracy, pos.coords.speed, pos.coords.heading, pos.timestamp)
//                  });

//            }, function (err) {
//                // error
//            });

//        };
//  google.maps.event.addDomListener(document.getElementById("map"), 'load', initialize());

//  $scope.centerOnMe = function() {
//    if(!$scope.map) {
//      return;
//    }

//    $scope.loading = $ionicLoading.show({
//      content: 'Getting current location...',
//      showBackdrop: false
//    });

//    navigator.geolocation.getCurrentPosition(function(pos) {
//      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//      $scope.loading.hide();
//    }, function(error) {
//      alert('Unable to get location: ' + error.message);
//    });
//  };

//  $scope.clickTest = function() {
//    alert('Example of infowindow with ng-click')
//  };

//})
