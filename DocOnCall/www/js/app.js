// Ionic Starter App vijay ana

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.cloud','ionic.native','starter.services','starter.controllers', 'myapp.directives', 'ngMessages', 'ionic-timepicker', 'tabSlideBox', 'ngOpenFB', 'braintree-angular', 'credit-cards', 'uiGmapgoogle-maps', 'intlpnIonic', 'ion-autocomplete', 'ionic-datepicker'])
.value('$', $)
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
.run(function ($ionicPlatform, $state, $cordovaBackgroundGeolocation, $cordovaDevice, $ionicPopup, $ionicLoading,  $rootScope, $cordovaDeeplinks, $timeout,  $ionicPush, applicationConfig, GeoLocation, MobileValidation, Account, SignalRSvc, ngFB, ConnectivityMonitor) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
   

        if (window.cordova &&  window.cordova.plugins && window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);            
        }
         // Just for iOS devices.
         
                if (ionic.Platform.isIOS()) {
                    cordova.plugins.iosrtc.debug.enable('iosrtc*');
                    cordova.plugins.iosrtc.registerGlobals();
                    window.OT = cordova.require('cordova-plugin-opentokjs.OpenTokClient');
                  //  alert('We registered cordova-plugin-iosrtc globals!');
                }
            
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        

        window.addEventListener('click', function (event) {
            if (Object.prototype.toString.call(event) == '[object PointerEvent]') {
                event.stopPropagation();
            }
        }
        , true);

       

        $rootScope.$on('cloud:push:notification', function(event, data) {
                                                var msg = data.message;
                                                alert(msg.title + ': ' + msg.text);
                                            });

       
        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
               $rootScope.isBrowser = false;
                cordova.plugins.diagnostic.isCameraAvailable(function(available){
                    if(!available)
                    {
                        cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
                                if(!cordova.plugins.diagnostic.permissionStatus.GRANTED)
                                {
                                    alert("Unable to get camera permission");                                  
                                }
                        });
                    }
                });
                
            }else{
               $rootScope.isBrowser = true;
        }

         $cordovaDeeplinks.route({
            '/videoDeepLinkSessions/:VideoCallSessionID': {
                target: 'tab.provider.videoSessions.videocall',
                parent: 'tab.provider.videoSessions'
            }
            }).subscribe(function(match) {
            // One of our routes matched, we will quickly navigate to our parent
            // view to give the user a natural back button flow
            $timeout(function() {
                $state.go(match.$route.parent, match.$args);

                // Finally, we will navigate to the deeplink page. Now the user has
                // the 'product' view visibile, and the back button goes back to the
                // 'products' view.
                $timeout(function() {
                $state.go(match.$route.target, match.$args);
                }, 800);
            }, 100); // Timeouts can be tweaked to customize the feel of the deeplink
            }, function(nomatch) {
            console.warn('No match', nomatch);
            });
        

          $rootScope.FiredOnce=false;
     //   ConnectivityMonitor.startWatching();
      
        //window.navigator.geolocation.getCurrentPosition(function (location) {
        //    console.log('Location from Phonegap');
        //    // $state.go('tab.dash');

        //    var options = {
        //        //  https://github.com/christocracy/cordova-plugin-background-geolocation#config
        //         url: applicationConfig.apiUrl + 'api/GeoLocation', // <-- Android ONLY:  your server url to send locations to
        //         params: {
        //             auth_token: 'kuruba',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
        //             MobileNumber: localStorage.getItem("username"),                             //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
        //             DeviceId: $cordovaDevice.getUUID()
        //         },
        //         headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
        //             "Authorization": "Bearer " + localStorage.getItem("access_token")
        //         },
        //         desiredAccuracy: 100,
        //         stationaryRadius: 30,
        //         distanceFilter: 30,
        //         notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        //         notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        //         activityType: 'AutomotiveNavigation',
        //         debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        //         stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates

        //     };

        //     // `configure` calls `start` internally
        //     $cordovaBackgroundGeolocation.configure(options).then(function (location) {
        //         console.log(location);
        //         $scope.GeoLocation = location;
        //         $scope.GeoLocation.$save().then(function (info) {
        //             console.log('Location Saved');

        //         });

        //     }, function (err) {
        //         console.error(err);
        //         ;
        //     });
        //});
        ngFB.init({ appId: '1147524908598622' });
        var mobileNumber = localStorage.getItem('username');
        var deviceid =''
        try{
            deviceid= $cordovaDevice.device.uuid;
        }
        catch (e) {
            console.log(e);

        }
       
        //Validate if the mobile number stored is active and get the CustomerID
        if (mobileNumber != null && mobileNumber != '') {
            $ionicLoading.show({
                template: 'Validating ...'
            });
            MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken(mobileNumber, deviceid).success(function (data) {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("username", mobileNumber);
                $ionicLoading.hide();
                Account.getByMobileNumber({ mobileNumber: mobileNumber, type: 'verified' }).$promise.then(function (data) {


                    if (data.Id == null || data.Id == 'undefined') {
                        console.log("Something bad happened on server. Index is stale");
                        //alert("Server is Busy. Please try this operation after some time")
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
                        return true;
                    }


                });



            })
            .error(function (error) {
                //alert('Could not login');
                $ionicLoading.hide();
                if (error == null) {
                   // $scope.data.loginClicked = false;
                    console.log('application server not available');
                    $ionicPopup.alert({
                        title: 'Error Message!',
                        template: 'application server not available. contact support'
                    });
                }
                else if (error.error_description == "The user name or password is incorrect.") {
                    localStorage.setItem("access_token", "");
                    localStorage.setItem("username", "");
                    localStorage.setItem("customerid", "");
                    localStorage.setItem("platformfeerate", "");
                    localStorage.setItem("platformfeeflat", "");
                    localStorage.setItem("isProvider", "");
                    $state.go('security');

                }
              


            });

        } 
        else {
            $state.go('security');
            return true;

        }

    });
})
.constant("applicationConfig", {
      // "apiUrl": "http://localhost:14629/", // Local Dev Setting
       // "apiUrl": "http://192.168.1.103:14629/", // Local Dev Setting
      "apiUrl": "https://api.zipcommute.com/",// Production setting
    // "apiUrl": "http://api.zipcommute.tst:81/",// Production setting
     //   "apiUrl": "https://carpoolmiles.cloudapp.net/",// Test setting    
        "paymentGateway": "braintree",
    //  "paymentGateway": "stripe",
        "serviceTimeout": 120000,// $Resource Timeout in Milliseconds
        "errorPopupTitle": "Application Error"
})
  //.constant('clientTokenPath', 'http://localhost:14629/api/braintreeToken')
  //.constant('clientTokenPath', 'http://192.168.1.103:1462/api/braintreeToken')
   .constant('clientTokenPath', 'https://api.zipcommute.com/api/braintreeToken')
  //.constant('clientTokenPath', 'http://carpoolmiles.cloudapp.net/api/braintreeToken')
  .constant('opentokClientAPI', '45605092')
  .constant('debug', false)
  
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $provide, applicationConfig, debug) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    
    var currentDate = new Date(yyyy, mm, dd);

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

   // stripeProvider.setPublishableKey('pk_test_0SAOCUQDO6HftWgFfBwFInVm');

    $provide.decorator('$exceptionHandler', ['$delegate', function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);

            var data = {
                type: 'angular',
                url: window.location.hash,
                localtime: today
            };
            if (cause) { data.cause = cause; }
            if (exception) {
                if (exception.message) { data.message = exception.message; }
                if (exception.name) { data.name = exception.name; }
                if (exception.stack) { data.stack = exception.stack; }
            }

            if (debug) {
                console.log('exception', data);
                window.alert('Error: ' + data.message);
            } else {
                track('exception', data);
            }
        };
    }]);
    // catch exceptions out of angular
    window.onerror = function (message, url, line, col, error) {
        var stopPropagation = debug ? false : true;
        var data = {
            type: 'javascript',
            url: window.location.hash,
            localtime: today
        };
        if (message) { data.message = message; }
        if (url) { data.fileName = url; }
        if (line) { data.lineNumber = line; }
        if (col) { data.columnNumber = col; }
        if (error) {
            if (error.name) { data.name = error.name; }
            if (error.stack) { data.stack = error.stack; }
        }

        if (debug) {
            console.log('exception', data);
            window.alert('Error: ' + data.message);
        } else {
            track('exception', data);

        }
        return stopPropagation;
    };
    
    var track = function (name,data)
    {
        var initInjector = angular.injector(['ng']);
        var $http = initInjector.get('$http');
        //ErrorLoggerProvider.setName(data);
        $http.post(applicationConfig.apiUrl + 'api/Error', data).success(function (data, status) {
                         console.log("ok");
                     });
      
        
    }
    $ionicConfigProvider.tabs.position("bottom");
    //$ionicConfigProvider.views.maxCache(0);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

        .state('tab.dash', {
          url: '/dash',
          views: {
              'tab-carpools': {
                  templateUrl: 'templates/tab-dash-new.html',
                  controller: 'DashNewCtrl'
              }
          }
      })

        .state('tab.dash.attendance', {
             url: '/attendance/:id/:displayname/:type/:usagedate/:mode',
             views: {
                 'tab-carpools@tab': {
                     templateUrl: 'templates/attendance.html',
                     controller: 'AttendanceNewCtrl'
                 }
             }
        })
        
        .state('tab.dash.expenses', {
            url: '/expenses/:carpoolid/:customerid/:usagedate',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/expenses.html',
                    controller: 'ExpensesCtrl'
                }
            }
        })
         .state('tab.dash.new-expense', {
             url: '/newexpense/:carpoolid/:customerid/:usagedate',
             views: {
                 'tab-carpools@tab': {
                     templateUrl: 'templates/new-expense.html',
                     controller: 'NewExpenseCtrl'
                 }
             }
         })
        .state('tab.dash.expenses.new-expense', {
            url: '/newexpense/:carpoolid/:customerid/:usagedate',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/new-expense.html',
                    controller: 'NewExpenseCtrl'
                }
            }
        })

    
        .state('tab.dash.expenses.edit-expense', {
            url: '/edit-expense/:expenseid',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/edit-expense.html',
                    controller: 'EditExpenseCtrl'
                }
            }
        })

        .state('tab.dash.newcarpool', {
              url: '/newcarpool',
              views: {
                  'tab-carpools@tab': {
                      templateUrl: 'templates/new-carpool-slide.html',
                      controller: 'NewCarpoolSlideCtrl'
                  }
              }
          })
        .state('tab.dash.carpools', {
            url: '/carpools',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/tab-carpools.html',
                    controller: 'CarpoolsCtrl'
                }
            }
        })

        .state('tab.dash.carpools.actions', {
            url: '/actions/:carpoolId',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/carpool-actions.html',
                    controller: 'CarpoolActionsCtrl'
                }
            }
        })
        .state('tab.dash.carpools.approval', {
            url: '/approval/:carpoolId/:customerId/:action',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/carpool-detail-slide.html',
                    controller: 'CarpoolDetailSlideCtrl'
                }
            }
        })

        .state('tab.dash.carpools.actions-editcarpool', {
            url: '/actions-editcarpool/:carpoolId',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/edit-carpool-slide.html',
                    controller: 'EditCarpoolSlideCtrl'
                }
            }
        })


        .state('tab.dash.carpools.actions-viewcarpool', {
        url: '/actions-viewcarpool/:carpoolId/:customerId/:action',
        views: {
            'tab-carpools@tab': {
                templateUrl: 'templates/carpool-detail-slide.html',
                controller: 'CarpoolDetailSlideCtrl'
            }
        }
        })

        .state('tab.dash.carpools.actions-expensereport', {
            url: '/actions-expensereport/:carpoolId',
            views: {
                'tab-carpools@tab': {
                    templateUrl: 'templates/expense-report.html',
                    controller: 'ExpenseReportCtrl'
                }
            }
        })

        .state('tab.dash.mobilelogin', {
             url: '/mobilelogin',
             views: {
                 'tab-carpools@tab': {
                     templateUrl: 'templates/login.html',
                     controller: 'LoginCtrl'
                 }
             }
        })
          .state('tab.dash.emaillogin', {
              url: '/emaillogin',
              views: {
                  'tab-carpools@tab': {
                      templateUrl: 'templates/edit-email-organization.html',
                      controller: 'EmailOrganizationCtrl'
                  }
              }
          })
           .state('tab.dash.customeredit', {
               url: '/customeredit',
               views: {
                   'tab-carpool@tab': {
                       templateUrl: 'templates/edit-customer-slide.html',
                       controller: 'CustomerEditSlideCtrl'
                   }
               }
           })
       
      

    
         .state('tab.search', {
             url: '/search',
             views: {
                 'tab-search': {
                     templateUrl: 'templates/tab-search.html',
                     controller: 'SearchCtrl'
                 }
             }
         })
         .state('tab.search.attendance', {
            url: '/attendance/:id/:displayname/:type/:usagedate/:mode',
            views: {
                'tab-search@tab': {
                    templateUrl: 'templates/attendance.html',
                    controller: 'AttendanceCtrl'
                }
            }
         })
        .state('tab.search.videochatsubscriber', {
            url: '/videochatsubscriber/:id/:api',
            views: {
                'tab-search@tab': {
                    templateUrl: 'templates/videoChatSubscriber.html',
                    controller: 'VideoChatSubscriberCtrl'
                }
            }
        })
         .state('tab.search.videochatsubscriberNew', {
            url: '/videochatsubscriberNew/:id/:api/:type',
            views: {
                'tab-search@tab': {
                    templateUrl: 'templates/videoChatSubscriberNew.html',
                    controller: 'VideoChatSubscriberNewCtrl'
                }
            }
        })
         .state('tab.search.providerDetails', {
            url: '/providerDetails/:providerId/:appointmentDate',
            views: {
                'tab-search@tab': {
                    templateUrl: 'templates/providerDetails.html',
                    controller: 'ProviderDetailsCtrl'
                }
            }
        })
         
         .state('tab.search.mobilelogin', {
             url: '/mobilelogin',
             views: {
                 'tab-search@tab': {
                     templateUrl: 'templates/login.html',
                     controller: 'LoginCtrl'
                 }
             }
         })
         .state('tab.search.emaillogin', {
              url: '/emaillogin',
              views: {
                  'tab-search@tab': {
                      templateUrl: 'templates/edit-email-organization.html',
                      controller: 'EmailOrganizationCtrl'
                  }
              }
         })
         .state('tab.search.customeredit', {
              url: '/customeredit',
              views: {
                  'tab-search@tab': {
                      templateUrl: 'templates/edit-customer-slide.html',
                      controller: 'CustomerEditSlideCtrl'
                  }
              }
          })
         .state('tab.search.payments', {
             url: '/payments',
             views: {
                 'tab-search@tab': {
                     templateUrl: 'templates/Payments.html',
                     controller: 'PaymentsCtrl'
                 }
             }
         })
         .state('tab.search.viewcarpool', {
               url: '/viewcarpool/:carpoolId/:customerId/:action',
               views: {
                   'tab-search@tab': {
                       templateUrl: 'templates/carpool-detail-slide.html',
                       controller: 'CarpoolDetailSlideCtrl'
                   }
               }
           })
        

          .state('tab.account', {
              url: '/account',
              views: {
                  'tab-account': {
                      templateUrl: 'templates/accounts.html',
                      controller: 'AccountsCtrl'
                  }
              }
          })

           .state('tab.provider', {
              url: '/provider',              
             template: '<ui-view/>'
             
           })

           .state('tab.provider.consultationRoom', {
              url: '/consultationRoom',
              views: {
                  'tab-provider@tab': {
                      templateUrl: 'templates/tab-videocall.html',
                      controller: 'VideoChatProviderCtrl'
                  }
              }
          })
           .state('tab.provider.consultationRoomNew', {
              url: '/consultationRoomNew',
              views: {
                  'tab-provider@tab': {
                      templateUrl: 'templates/tab-videocallNew.html',
                      controller: 'VideoChatProviderNewCtrl'
                  }
              }
          })
          .state('tab.provider.videoSessions', {
              url: '/videoSessions',
              views: {
                  'tab-provider@tab': {
                      templateUrl: 'templates/tab-videoSessions.html',
                      controller: 'VideoSessionsCtrl'
                  }
              }
          })

           .state('tab.provider.videoSessions.videocall', {
              url: '/videoDeepLinkSessions/:VideoCallSessionID',
              views: {
                  'tab-provider@tab': {
                      templateUrl: 'templates/videocallDeepLinkNew.html',
                      controller: 'VideoChatProviderNewDeepLinkCtrl'
                  }
              }
          })

             .state('tab.provider.providerAppointments', {
              url: '/providerAppointments',
              views: {
                  'tab-provider@tab': {
                      templateUrl: 'templates/tab-providerAppointments.html',
                      controller: 'ProviderAppointmentsCtrl'
                  }
              }
          })

    
       
        .state('tab.account.registration', {
             url: '/registration?customerID&mobileNumber',
             views: {
                 'tab-account@tab': {
                     templateUrl: 'templates/register-slide.html',
                     controller: 'RegistartionSlideCtrl'
                 }
             }
         })
        .state('tab.account.customeredit', {
            url: '/customeredit',
            views: {
                'tab-account@tab': {
                    templateUrl: 'templates/edit-customer-slide.html',
                    controller: 'CustomerEditSlideCtrl'
                }
            }
        })
        .state('tab.account.payments', {
            url: '/payments',
            views: {
                'tab-account@tab': {
                    templateUrl: 'templates/Payments.html',
                    controller: 'PaymentsCtrl'
                }
            }
        })

        .state('tab.account.mobilelogin', {
            url: '/mobilelogin',
            views: {
                'tab-account@tab': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('tab.account.emaillogin', {
            url: '/emaillogin',
            views: {
                'tab-account@tab': {
                    templateUrl: 'templates/edit-email-organization.html',
                    controller: 'EmailOrganizationCtrl'
                }
            }
        })
        .state('tab.account.mobilelogin.mobileverification', {
            url: '/mobileverification/:customerID/:mobileNumber',
            views: {
                'tab-account@tab': {
                    templateUrl: 'templates/verification-code.html',
                    controller: 'VerificationCodeCtrl'
                }
            }
        })
        .state('tab.account.emaillogin.emailverification', {
              url: '/emailverification/:email/:emailverificationCode/:provider',
              views: {
                  'tab-account@tab': {
                      templateUrl: 'templates/email-verification.html',
                      controller: 'emailVerificationCodeCtrl'
                  }
              }
        })

        /*
        .state('tab.security', {
            url: '/mobilelogin',
            views: {
                'tab-security': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('tab.security.emaillogin', {
            url: '/emaillogin',
            views: {
                'tab-security@tab': {
                    templateUrl: 'templates/edit-email-organization.html',
                    controller: 'EmailOrganizationCtrl'
                }
            }
        })
        .state('tab.security.mobileverification', {
            url: '/mobileverification/:customerID/:mobileNumber/:verificationCode',
            views: {
                'tab-security@tab': {
                    templateUrl: 'templates/verification-code.html',
                    controller: 'VerificationCodeCtrl'
                }
            }
        })
        .state('tab.security.emaillogin.emailverification', {
            url: '/emailverification/:email/:emailverificationCode/:provider',
            views: {
                'tab-security@tab': {
                    templateUrl: 'templates/email-verification.html',
                    controller: 'emailVerificationCodeCtrl'
                }
            }
        })
         */
         .state('security', {
             url: '/mobilelogin',
             templateUrl: 'templates/login.html',
              controller: 'LoginCtrl'                
             
         })
         .state('vsc', {
             url: '/vsc/:videSessionID',
             templateUrl: 'templates/VideoSessionLink.html',
              controller: 'VideoSessionLinkCtrl'                
             
         })
        .state('errorconnection', {
            url: '/errorconnection',
            templateUrl: 'templates/error-connection.html',
            controller: 'ErrorConnectionCtrl'

        })
  
        .state('securityemaillogin', {
            url: '/securityemaillogin',
            templateUrl: 'templates/edit-email-organization.html',
             controller: 'EmailOrganizationCtrl'
                
        })
        .state('securitymobileverification', {
            url: '/securitymobileverification/:customerID/:mobileNumber',
            templateUrl: 'templates/verification-code.html',
            controller: 'VerificationCodeCtrl'
                
        })
        .state('securityemailverification', {
            url: '/securityemailverification/:email/:emailverificationCode/:provider',
            templateUrl: 'templates/email-verification.html',
            controller: 'emailVerificationCodeCtrl'
                
        })
         .state('securitycustomeredit', {
             url: '/securitycustomeredit',
             templateUrl: 'templates/edit-customer-slide.html',
             controller: 'CustomerEditSlideCtrl'
                
         })
            .state('choice', {
             url: '/choice',
             templateUrl: 'templates/choice.html',
             controller: 'CustomerEditSlideCtrl'
                
         })
        .state('securityregistration', {
            url: '/securityregistration?customerID&mobileNumber',
           templateUrl: 'templates/register-slide.html',
            controller: 'RegistartionSlideCtrl'
                
        })

         .state('tab.messaging', {
          url: '/messaging/:carpoolid',
          views: {
              'tab-dash': {
                  templateUrl: 'templates/carpool-messaging.html',
                  controller: 'CarpoolMessagingCtrl'
              }
          }
      })
         .state('tab.CustInfo', {
             url: '/custInfo',
             views: {
                 'tab-account': {
                     templateUrl: 'templates/CustInfo.html',
                     controller: 'CustInfoCtrl'
                 }
             }
         })
         .state('tab.Organization', {
            url: '/organization/:provider',
            views: {
                'tab-account': {
                    templateUrl: 'templates/Organization.html',
                    controller: 'OrganizationCtrl'
                }
            }
        })
         .state('tab.Customer', {
            url: '/customer/:orgID',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/Customer.html',
                    controller: 'CustomerCtrl'
                }
            }
        })
         .state('tab.carpoolmap', {
             url: '/carpoolmap/:carpoolid',
             views: {
                 'tab-dash': {
                     templateUrl: 'templates/carpool-map.html',
                     controller: 'CarpoolMapCtrl'
                 }
             }
         })
         .state('tab.rides', {
             url: '/rides/:carpoolid/:customerid/:usagedate',
             views: {
                 'tab-dash': {
                     templateUrl: 'templates/rides.html',
                     controller: 'RidesCtrl'
                 }
             }
         })
         .state('tab.new-ride', {
           url: '/newride/:carpoolid/:customerid/:usagedate',
           views: {
               'tab-dash': {
                   templateUrl: 'templates/new-ride.html',
                   controller: 'NewRideCtrl'
               }
           }
       })
         .state('tab.new-carpool-ride', {
             url: '/newride/:carpoolid/:customerid/:usagedate/:from',
             views: {
                 'tab-carpools': {
                     templateUrl: 'templates/new-ride.html',
                     controller: 'NewRideCtrl'
                 }
             }
         })
         .state('tab.edit-ride', {
              url: '/editride/:rideid',
              views: {
                  'tab-dash': {
                      templateUrl: 'templates/edit-ride.html',
                      controller: 'EditRideCtrl'
                  }
              }
          })
        // .state('tab.expenses', {
        //    url: '/expenses/:carpoolid/:customerid/:usagedate',
        //    views: {
        //        'tab-dash': {
        //            templateUrl: 'templates/expenses.html',
        //            controller: 'ExpensesCtrl'
        //        }
        //    }
        //})
        // .state('tab.new-expense', {
        //     url: '/newexpense/:carpoolid/:customerid/:usagedate',
        //     views: {
        //         'tab-dash': {
        //             templateUrl: 'templates/new-expense.html',
        //             controller: 'NewExpenseCtrl'
        //         }
        //     }
        // })
        // .state('tab.edit-expense', {
        //     url: '/editexpense/:expenseid',
        //     views: {
        //         'tab-dash': {
        //             templateUrl: 'templates/edit-expense.html',
        //             controller: 'EditExpenseCtrl'
        //         }
        //     }
        // })
       
       

     
    ;


    $urlRouterProvider.otherwise('/search');

})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})
.config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "687ca388"
    },
     "push": {
      "sender_id": "451069755940",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  });
})

// .config( function($ionicAppProvider) {
//   $ionicAppProvider.identify({
//     app_id: '687ca388',
//     api_key: '227639d6cc568b162c7760868ded2712eb37fdfce4fdaae9',
//     dev_push: true
//   });
// })





  
