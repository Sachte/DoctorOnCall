angular.module('starter.services', ['ngResource'])

.factory('Account', function ($resource, applicationConfig) {

    // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
    // var resource = $resource(applicationConfig.apiUrl + 'api/Account/:id',
       var resource = $resource(applicationConfig.apiUrl + 'api/Account/:id',
        { Id: "@Id" },
        {
            'get': { method: 'GET', timeout: applicationConfig.serviceTimeout },
            'save': { method: 'POST', timeout: applicationConfig.serviceTimeout },
            'query': { method: 'GET', isArray: true, timeout: applicationConfig.serviceTimeout },           
            'update': { method: 'PUT', timeout: applicationConfig.serviceTimeout },
            // 'getByMobileNumber': { method: 'GET', params: { mobileNumber: '@mobileNumber', type: 'type' }, url: applicationConfig.apiUrl + 'api/Account/:mobileNumber/:type' },
            'getByMobileNumber': { method: 'GET',timeout: applicationConfig.serviceTimeout , params: { mobileNumber: '@mobileNumber', type: '@type' }, url: applicationConfig.apiUrl + 'api/Account?parameter1=:mobileNumber&parameter2=:type' },
            'getWithAccountBalance': { method: 'GET', timeout: applicationConfig.serviceTimeout, params: { accountid: '@accountid', withAccount: 'true', flag: 'true' }, url: applicationConfig.apiUrl + 'api/Account/:accountid/:withAccount/:flag' },

        
           
        });


    return resource;
})
    .factory('VideoCall', function ($resource, applicationConfig) {

        // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
        // var resource = $resource(applicationConfig.apiUrl + 'api/Account/:id',
        var resource = $resource(applicationConfig.apiUrl + 'api/VideoCall/:id',
         { Id: "@Id" },
         {
             'get': { method: 'GET', timeout: applicationConfig.serviceTimeout },
             'save': { method: 'POST', timeout: applicationConfig.serviceTimeout },
             'query': { method: 'GET', isArray: true, timeout: applicationConfig.serviceTimeout },
             'update': { method: 'PUT', timeout: applicationConfig.serviceTimeout },
             'GetOpenVideoSessions': { method: 'GET',isArray: true,   params: { publisherID: '@publisherID', subscriberID: '@subscriberID',role:'@role' }, url: applicationConfig.apiUrl + 'api/VideoCall/:publisherID/:subscriberID/:role' },
             'GetVideoNew': { method: 'GET',  params: { publisherID: '@publisherID', subscriberID: '@subscriberID',role:'@role',videoSessionID:'@videoSessionID',type:'@type'}, url: applicationConfig.apiUrl + 'api/VideoCall/:publisherID/:subscriberID/:role/:videoSessionID/:type' },
             'GetSubscriberFromQueue' :{ method: 'GET',  params: { publisherID: '@publisherID',type:'@type'}, url: applicationConfig.apiUrl + 'api/VideoCall/:publisherID/:type' },
             'GetStatusUpdate' :{ method: 'GET',  params: { subscriberID: '@subscriberID',p1:'@p1',p2:'@p2',p3:'@p3'}, url: applicationConfig.apiUrl + 'api/VideoCall/:subscriberID/:p1/:p2/:p3' }
            

         });


        return resource;
    })
 .factory('CustomerPayment', function ($resource, applicationConfig) {

     // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
     var resource = $resource(applicationConfig.apiUrl + 'api/CustomerPayment/:id',
         { Id: "@Id" },
         {
             'update': { method: 'PUT' }


         });


     return resource;
 })
 .factory('CustomerPaymentMethod', function ($resource, applicationConfig) {

        // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
        var resource = $resource(applicationConfig.apiUrl + 'api/CustomerPaymentMethod/:id',
            { Id: "@Id" },
            {
                'update': { method: 'PUT' }


            });


        return resource;
    })
.factory('CustomerEncounterPayment', function ($resource, applicationConfig) {

     // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
     var resource = $resource(applicationConfig.apiUrl + 'api/CustomerEncounterPayment/:id',
         { Id: "@Id" },
         {
             'update': { method: 'PUT' }


         });


     return resource;
 })
.factory('EmailValidation', function ($resource, applicationConfig) {

    // var resource = $resource(applicationConfig.apiUrl + 'api/Account?id=:id',
    var resource = $resource(applicationConfig.apiUrl + 'api/EmailValidation/:id/',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' },
            'getByEmail': { method: 'GET', params: {email:'@email',customerId:'@customerId'}, url: applicationConfig.apiUrl + 'api/EmailValidation/:email/:customerId'}
           
        });


    return resource;
})
.factory('Organization', function ($resource, applicationConfig) {

     var resource = $resource(applicationConfig.apiUrl + 'api/Organization/:id',
      { Id: "@Id" },
         {
             'update': { method: 'PUT' },
             'getByProvider': { method: 'GET', params: { provider: '@provider', p: '@p' }, url: applicationConfig.apiUrl + 'api/Organization/:provider/:p' }
         });


        return resource;
    })
    .factory('Prescription', function ($resource, applicationConfig) {

     var resource = $resource(applicationConfig.apiUrl + 'api/Prescription/:id',
      { Id: "@Id" },
         {
             'GetSubscribers': { method: 'GET', isArray: true, params: { searchTerm:'@searchTerm',isProvider:'@isProvider'}, url: applicationConfig.apiUrl + 'api/Prescription/:searchTerm/:isProvider'},
             'update': { method: 'PUT' }
         });


        return resource;
    })
.factory('GeoLocation', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/GeoLocation/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' }
        });


    return resource;
})
.factory('Geo', function ($q) {
    return {
        reverseGeocode: function (lat, lng) {
            console.log("GEO FACTORY");
            var q = $q.defer();
            var geocoder = new google.maps.Geocoder();
            console.log("geocoder");
            geocoder.geocode({
                'latLng': new google.maps.LatLng(lat, lng)
            }, function (results, status) {
                console.log("geocoder.geocode");
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log('Reverse', results);
                    if (results.length > 1) {
                        var r = results[1];
                        var a, types;
                        var parts = [];
                        var foundLocality = false;
                        var foundState = false;
                        for (var i = 0; i < r.address_components.length; i++) {
                            a = r.address_components[i];
                            types = a.types;
                            for (var j = 0; j < types.length; j++) {
                                if (!foundLocality && types[j] == 'locality') {
                                    foundLocality = true;
                                    parts.push(a.long_name);
                                } else if (!foundState && types[j] == 'administrative_area_level_1') {
                                    foundState = true;
                                    parts.push(a.short_name);
                                }
                            }
                        }
                        console.log('Reverse', parts);
                        q.resolve(parts.join(', '));
                    }
                } else {
                    console.log('reverse fail', results, status);
                    q.reject(results);
                }
            })

            return q.promise;
        },
        getLocation: function () {
            console.log("Geo.getLocation");
            var q = $q.defer();
            console.log("Calling Navigator.geolocation");
            navigator.geolocation.getCurrentPosition(function (position) {
                q.resolve(position);
                console.log(position);
            }, function (error) {
                q.reject(error);
            });

            return q.promise;
        },
        getDistance: function (lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1 / 180
            var radlat2 = Math.PI * lat2 / 180
            var radlon1 = Math.PI * lon1 / 180
            var radlon2 = Math.PI * lon2 / 180
            var theta = lon1 - lon2
            var radtheta = Math.PI * theta / 180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist

        }
        
    };
})
.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (localStorage.getItem("access_token")) {
                config.headers.Authorization = 'Bearer ' + localStorage.getItem("access_token");
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
})
.factory('MobileValidation', function ( $http, applicationConfig) {
    //Change this to $Resource
    var MobileValidation = {};
   
    MobileValidation.ValidateIfMobileNumberIsVerifiedAndGetAuthenticationToken = function (mobileNumber,deviceid) {
        var url = applicationConfig.apiUrl + "Token";
        return   $http({
                        method: 'POST',
                        url: url,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: { username: mobileNumber,password:deviceid, grant_type: "password" }
                     })

    };
    return MobileValidation;
      

})
.factory('Contacts', function ($resource, applicationConfig,$cordovaContacts) {
    var Contacts = {};
    Contacts.getContacts = function (searchStr) {
            var options = {};
            options.filter = searchStr;
            options.multiple = true;

            //get the phone contacts
         return $cordovaContacts.find(options);
          //  return [{ 'DisplayName': 'Sanjeev Rangaiah', 'MobileNumber': '2012181444', 'isMember': false }, { 'DisplayName': 'Kavitha Channaiah', 'MobileNumber': '2018881440', 'isMember': false }, { 'DisplayName': 'Sachet Vijay', 'MobileNumber': '2012181411', 'isMember': false }];

    }
    return Contacts;
})

 .factory('BillingFrequencies', function ($resource, applicationConfig) {

        var BillingFrequencies = {};
        BillingFrequencies.fetch = function () {
            return [{ 'BillingFrequencyID': '1', 'BillingFrequency': 'Weekly', 'Description': 'Billing Run will occur every Monday at 1 AM' }, { 'BillingFrequencyID': '2', 'BillingFrequency': 'Bi-Weekly', 'Description': 'Billing Run will occur every other Monday at 1 AM' }, { 'BillingFrequencyID': '3', 'BillingFrequency': 'Fortnightly', 'Description': 'Billing Run will occur on the 15th of every Month at 1 AM' }, { 'BillingFrequencyID': '4', 'BillingFrequency': 'Monthly', 'Description': 'Billing Run will occur on the 1stth of every Month at 1 AM' }];
        }
        return BillingFrequencies;
 })
.factory('ExpenseTypes', function ($resource, applicationConfig) {

    var ExpenseTypes = {};
    ExpenseTypes.fetch = function () {
        return [{ 'ExpenseTypeID': '1', 'ExpenseType': 'Gas', 'Description': 'Expense related to Gas' }, { 'ExpenseTypeID': '2', 'ExpenseType': 'Vehicle Cleaning', 'Description': 'Expense related to Vehicle Cleaning' }, { 'ExpenseTypeID': '3', 'ExpenseType': 'Toll Fees', 'Description': 'Expense related to Toll Fees' }, { 'ExpenseTypeID': '4', 'ExpenseType': 'Parking Fees', 'Description': 'Expense related to Parking Fees Fees' }, { 'ExpenseTypeID': '5', 'ExpenseType': 'Other Expenses', 'Description': 'Other Expenses (Do not Include Lease Fee)' }];
    }
    return ExpenseTypes;
})

.factory('Ride', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/Ride/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' },
           // 'GetByCarpoolIDAndDate': { method: 'GET', isArray: true, params: { carpoolID: '@carpoolID', rideDate: '@rideDate' }, url: applicationConfig.apiUrl + 'api/Ride/:carpoolID/:rideDate' },
            'GetByCustomerIDAndDate': { method: 'GET', isArray: true, params: { customerID: '@customerID', rideDate: '@rideDate' }, url: applicationConfig.apiUrl + 'api/Ride/:customerID/:rideDate' },
            'GetByIdTypeAndDate': { method: 'GET', isArray: true, params: { id: '@id', type: '@type', rideDate: '@rideDate' }, url: applicationConfig.apiUrl + 'api/Ride/:id/:type/:rideDate' },
            'GetRideRequestsAndCarpoolInvites': { method: 'GET', isArray: false, params: { customerID: '@customerID', rideDate: '@rideDate', type: 'type', type: 'flag' }, url: applicationConfig.apiUrl + 'api/Ride/:customerID/:rideDate/:type/:flag' },
            'GetByDateLocationAndDirection': { method: 'GET', isArray: true, params: { rideDate: '@rideDate', fromLat: '@fromLat', fromLng: '@fromLong', toLat: '@toLat', toLng: '@toLng', fromWithinRadiusOf: '@fromWithinRadiusOf', toWithinRadiusOf: '@toWithinRadiusOf', direction: '@direction' }, url: applicationConfig.apiUrl + 'api/Ride/:rideDate/:fromLat/:fromLng/:toLat/:toLng/:fromWithinRadiusOf/:toWithinRadiusOf/:direction/' },

        });
    return resource;
})
.factory('Encounter', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/Encounter/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' },
           // 'GetByCarpoolIDAndDate': { method: 'GET', isArray: true, params: { carpoolID: '@carpoolID', rideDate: '@rideDate' }, url: applicationConfig.apiUrl + 'api/Ride/:carpoolID/:rideDate' },
          'GetProviderByDateAndLocation': { method: 'GET', isArray: true, params: { serviceDate: '@serviceDate', fromLatitude: '@fromLatitude', fromLng: '@fromLongitude', searchRadius: '@searchRadius'}, url: applicationConfig.apiUrl + 'api/Encounter/:serviceDate/:fromLatitude/:fromLongitude/:searchRadius/'}
        });
    return resource;
})

.factory('Appointment', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/Appointment/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' },
             'GetSubsribers': { method: 'GET', isArray: true, params: { searchTerm:'@searchTerm',isProvider:'@isProvider'}, url: applicationConfig.apiUrl + 'api/Appointment/:searchTerm/:isProvider'},
      
              'GetAppointmentsByProviderAndDate': { method: 'GET', isArray: true, params: { providerId:'@providerId',subscriberId:'@subscriberId', appointmentDate:'@appointmentDate',isProvider:'@isProvider'}, url: applicationConfig.apiUrl + 'api/Appointment/:providerId/:subscriberId/:appointmentDate/:isProvider'},
        //    'GetAppointmentsByProvider': { method: 'GET', isArray: true, params: { providerId:'@providerId',subscriberId:'@subscriberId', appointmentDate:'@appointmentDate', isProvider:'@isProvider'}, url: applicationConfig.apiUrl + 'api/Appointment/:providerId/:subscriberId/:appointmentDate/:isProvider'}
   
        });
    return resource;
})

.factory('Expense', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/Expense/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' },
            'GetByCarpoolIDAndDate': { method: 'GET', isArray: true, params: { carpoolID: '@carpoolID', rideDate: '@rideDate' }, url: applicationConfig.apiUrl + 'api/Expense/:carpoolID/:rideDate' }

        });


    return resource;
})

.factory('Carpool', function ($resource, applicationConfig) {

        var resource = $resource(applicationConfig.apiUrl + 'api/Carpool/:id',
            { Id: "@Id" },
            {
                'update': { method: 'PUT' },
                'getCarpoolMessages': { method: 'GET', isArray: true, params: { carpoolID: '@carpoolID', lastMessageID: '@lastMessageID' }, url: applicationConfig.apiUrl + 'api/Carpool/:carpoolID/:lastMessageID' }

            });


        return resource;
})

.factory('CarpoolActivate', function ($resource, applicationConfig) {

    var resource = $resource(applicationConfig.apiUrl + 'api/CarpoolActivation/:id',
        { Id: "@Id" },
        {
            'update': { method: 'PUT' }
        });


    return resource;
})



.factory('ErrorLogger', function ($resource, applicationConfig) {

        var resource = $resource(applicationConfig.apiUrl + 'api/Error/:id',
            { Id: "@Id" },
            {
                'update': { method: 'PUT' }
            });


        return resource;
    })

.factory('SignalRSvc', function ($, $rootScope, applicationConfig) {
    var proxy = null;
    var initialize = function(){
        $.getScript( applicationConfig.apiUrl + 'signalr/hubs', function () {
            $.connection.hub.url = applicationConfig.apiUrl + 'signalr';
            $.connection.hub.qs = { "customerID": localStorage.getItem("customerid")};
            proxy = $.connection.signalRMessageServiceProviderHub;
            $.connection.hub.url = applicationConfig.apiUrl + 'signalr/hubs'

            proxy.on('acceptGreet', function (message) {
                $rootScope.$emit("acceptGreet",message);
            });
            proxy.on('addCarpoolMessage', function (message) {
                $rootScope.$emit("addCarpoolMessage", message);
            });
            proxy.on('addCarpoolLocation', function (carpoollocation) {
                $rootScope.$emit("addCarpoolLocation", carpoollocation);
            });
            $.connection.hub.stop();
            console.log('Connection should have stopped');
            $.connection.hub.start().done(function () {
                console.log('connection started');
            });
            
        });
           
    };
    var sendRequest = function () {
        proxy.invoke('greetAll');
    };

    var sendCarpoolMessage = function (carpoolID, message, parentMsgID) {
        if (proxy == null) initialize();
        proxy.invoke('sendMessageToCarpool', carpoolID, message,"");
    };
    var sendCarpoolLocation = function (carpoolID, customerID,deviceId,latitude, longitude, accuracy, speed,heading,timestamp) {
        if (proxy == null) initialize();
        if (deviceId == null) deviceId = 'undefined';
        if (speed == null) speed = 0;
        if (heading == null) heading = '';
        $.connection.hub.start();
        proxy.invoke('sendGeoLocationToCarpool', carpoolID, customerID, deviceId, latitude, longitude, accuracy, speed,heading, timestamp);
    };
    return {
        initialize: initialize,
        sendRequest: sendRequest,
        sendCarpoolMessage: sendCarpoolMessage,
        sendCarpoolLocation: sendCarpoolLocation
    };
    
    
})

.factory("ContactsService", ['$q', function ($q) {

        var formatContact = function (contact) {
            var givenName = contact.name.givenName == undefined ? "" : contact.name.givenName;
            var familyName = contact.name.familyName == undefined ? "" : contact.name.familyName;
            return {
                

                "displayName": contact.name.formatted || givenName + " " + familyName || "Mystery Person",
                "emails": contact.emails || [],
                "phones": contact.phoneNumbers || [],
                "photos": contact.photos || []
            };

        };

        var pickContact = function () {

            var deferred = $q.defer();

            if (navigator && navigator.contacts) {

                navigator.contacts.pickContact(function (contact) {

                    deferred.resolve(formatContact(contact));
                },
					function (error){
						deferred.reject("Bummer.  No contacts in desktop browser");
        

				}
                
                );

            } else {
                deferred.reject("Bummer.  No contacts in desktop browser");
            }

            return deferred.promise;
        };

        return {
            pickContact: pickContact
        };
    }])

.factory('Camera', ['$q', function ($q) {

    return {
        getPicture: function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }
}])

.factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork) {

    return {
        isOnline: function () {
            if (ionic.Platform.isWebView()) {
               // return $cordovaNetwork.isOnline();
               return true;
            } else {
               // return navigator.onLine;
                 return true;
            }
        },
        isOffline: function () {
            if (ionic.Platform.isWebView()) {
               // return !$cordovaNetwork.isOnline();
                return false;
            } else {
               // return !navigator.onLine;
               return false;
            }
        },
        startWatching: function () {
            if (ionic.Platform.isWebView()) {

                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log("went online");
                    //deviceOnline
                    $rootScope.$emit("deviceOnline", {onlineStatus:true});
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log("went offline");
                });

            }
            else {

                window.addEventListener("online", function (e) {
                    console.log("went online");
                    $rootScope.$emit("deviceOnline", { onlineStatus: true });

                }, false);

                window.addEventListener("offline", function (e) {
                    console.log("went offline");
                }, false);
            }
        }
    }
})

.factory ('ReportBuilderSvc',[function(){
   var generateReport= function (item) {
            var age=0;
            if((new Date()).getMonth() > new Date(item.customer.dob).getMonth())
            {
                age = (new Date()).getFullYear() -  new Date(item.customer.dob).getFullYear();
            }
            else{
                age=(new Date()).getFullYear() -  new Date(item.customer.dob).getFullYear()-1;
            }
            //create an array of progress for the (6) categories presented
            var completions = 
                [(Math.random() * 100).toFixed(1),
                (Math.random() * 100).toFixed(1),
                (Math.random() * 100).toFixed(1),
                (Math.random() * 100).toFixed(1),
                (Math.random() * 100).toFixed(1),
                (Math.random() * 100).toFixed(1)];
            //use this array for each row bar, and return the document declaration object
            // plz see the pdfMake.org site for examples of document definitions
            return {
                content: [                    
                
                        {
                            columns: [

                            {
                                image: item.icontexturl,
                                width: 60
                            },
                        {alignment: 'right', text: 'Prescription \n\n', fontSize: 20, bold:true},

                        {alignment:'right',text:'\n8/7/2016'}

                            ]},
                       
                        {
                            columns:[
                      { text: 'Patient \n', fontSize: 15, bold:true},
                      { text: 'Doctor \n', fontSize: 15, bold:true}

                            ]
                        },
                    {
                        alignment: 'justify',
                        columns: [
                        {
                            text: item.customer.FirstName+' '+item.customer.LastName+'\nAge:'+age+'\n' + item.customer.HomeLocation.formatted_address+'\n'+item.customer.MobileNumber+'\n'
                        },
                        {
                            text: item.provider.FirstName+' '+item.provider.LastName+'\nRegistration Number: '+item.provider.ProviderLicense +'\n' +item.provider.EndLocation.formatted_address+'\n'+item.provider.MobileNumber+'\n'
                        }
                        
                       ]
                   },
                    {
                       image: item.prescriptionsymbol,      
                       width: 60,
                       height:60
                    },

                    item.prescriptionText,
                    {
                        image: item.imageUrl
                    },
                     {
                         text:'\nRefill:' + item.refills + '\n\n Signed electronically.'
                     }
                    

                ]
            };
		}
        return {
           
                generateReport:generateReport
        };
        

}

])
.factory ('ReportSvc', ['$q', '$rootScope', '$timeout', 'ReportBuilderSvc', function($q, $rootScope, $timeout, ReportBuilderSvc){
 
         this.runReportAsync = _runReportAsync;
		 this.runReportDataURL = _runReportDataURL;
		 this.runReportImage = _runReportImage;
         this.runReportDoc= _runReportDoc;
//
// RUN ASYNC: runs the report async mode w/ progress updates and delivers a local fileUrl for use
//
		 function _runReportAsync(player, transcript,item) {
             var deferred = $q.defer();
			 
             showLoading('1.Processing Transcript');
             generateReportDef(item).then(function(docDef) {
                 showLoading('2. Generating Report');
                 return generateReportDoc(docDef);
             }).then(function(pdfDoc) {
                 showLoading('3. Buffering Report');
                 return generateReportBuffer(pdfDoc);
             }).then(function(buffer) {
                 showLoading('4. Saving Report File');
                 return generateReportBlob(buffer);
             }).then(function(pdfBlob) {
                 showLoading('5. Opening Report File');
                 return saveFile(pdfBlob);
             }).then(function(filePath) {
                 hideLoading();
                 deferred.resolve(filePath);
             }, function(error) {
               //  hideLoading();
                 console.log('Error: ' + error.toString());
                 deferred.reject(error);
             });
             return deferred.promise;
		 }

		 function _runReportImage(player, transcript, item) {
		     var deferred = $q.defer();

		     showLoading('1.Processing Transcript');
		     generateReportDef(item).then(function (docDef) {
		         showLoading('2. Generating Report');
		         return generateReportDoc(docDef);
		     }).then(function (pdfDoc) {
		         showLoading('3. Buffering Report');
		         return generateReportBuffer(pdfDoc);
		     }).then(function (buffer) {
		         showLoading('4. Saving Report File');
		         return generateReportBlob(buffer);
		     }).then(function (pdfBlob) {
		         hideLoading();
		         deferred.resolve(pdfBlob);
		     }, function (error) {
		         //  hideLoading();
		         console.log('Error: ' + error.toString());
		         deferred.reject(error);
		     });
		     return deferred.promise;
		 }
         function _runReportDoc(player, transcript, item) {
		     var deferred = $q.defer();

		     showLoading('1.Processing Transcript');
		     generateReportDef(item).then(function (docDef) {
		          hideLoading();
                  deferred.resolve(docDef);
		     
		     }, function (error) {
		         //  hideLoading();
		         console.log('Error: ' + error.toString());
		         deferred.reject(error);
		     });
		     return deferred.promise;
		 }
//
// RUN DATAURL: runs the report async mode w/ progress updates and stops w/ pdfDoc -> dataURL string conversion
//
		 function _runReportDataURL(player, transcript,item) {
             var deferred = $q.defer();
			 
             showLoading('1.Processing Transcript');
             generateReportDef(item).then(function(docDef) {
                 showLoading('2. Generating Report');
                 return generateReportDoc(docDef);
             }).then(function(pdfDoc) {
                 showLoading('3. Convert to DataURL');
                 return getDataURL(pdfDoc);
             }).then(function(outDoc) {
                 hideLoading();
                 deferred.resolve(outDoc);
             }, function(error) {
                 hideLoading();
                 console.log('Error: ' + error.toString());
                 deferred.reject(error);
             });
             return deferred.promise;
         }
//
// 1.GenerateReportDef: use currentTranscript to craft reportDef JSON for pdfMake to generate report
//
		var generateReportDef =function (item) {
            var deferred = $q.defer();
			
            // removed specifics of code to process data for drafting the doc
            // layout based on player, transcript, courses, etc.
            // currently mocking this and returning a pre-built JSON doc definition
            
			//use rpt service to generate the JSON data model for processing PDF
            // had to use the $timeout to put a short delay that was needed to 
            // properly generate the doc declaration
            $timeout(function() {
                var dd = {};
                dd = ReportBuilderSvc.generateReport(item)
				deferred.resolve(dd);
            }, 100);
            
            return deferred.promise;
		}
//
// 2.GenerateRptFileDoc: take JSON from rptSvc, create pdfmemory buffer, and save as a local file
//	in: json docDef, out: pdfDoc object
//
		var generateReportDoc = function (docDefinition) {
			//use the pdfmake lib to create a pdf from the JSON created in the last step
			var deferred = $q.defer();
			try {
                //use the pdfMake library to create in memory pdf from the JSON
				var pdfDoc = pdfMake.createPdf( docDefinition );
                deferred.resolve(pdfDoc);
			}
			catch (e) {
				deferred.reject(e);
			}
			
			return deferred.promise;
		}
//
// 3.GenerateRptBuffer: pdfKit object pdfDoc --> buffer array of pdfDoc
//	in: pdfDoc object	out: buffer[]
//
		var generateReportBuffer = function (pdfDoc) {
			//use the pdfmake lib to get a buffer array of the pdfDoc object
			var deferred = $q.defer();
			try {
                //get the buffer from the pdfDoc
				pdfDoc.getBuffer(function(buffer) {
                    $timeout(function() {
					   deferred.resolve(buffer);
                    }, 100);
				});
			}
			catch (e) {
				deferred.reject(e);
			}
			
			return deferred.promise;
		}
//
// 3b.getDataURL: pdfKit object pdfDoc --> encoded dataUrl
//	in: pdfDoc object	out: dataUrl
//
		 var getDataURL = function (pdfDoc) {
			//use the pdfmake lib to create a pdf from the JSON created in the last step
			var deferred = $q.defer();
			try {
                //use the pdfMake library to create in memory pdf from the JSON
				pdfDoc.getDataUrl(function(outDoc) {
					deferred.resolve(outDoc);
				});
			}
			catch (e) {
				deferred.reject(e);
			}
			
			return deferred.promise;
		 }
//
// 4.GenerateReportBlob: buffer --> new Blob object
// in: buffer[]		out: Blob object
//
		var generateReportBlob = function (buffer) {
			//use the global Blob object from pdfmake lib to creat a blob for file processing
			var deferred = $q.defer();
			try {
                //process the input buffer as an application/pdf Blob object for file processing
                var pdfBlob = new Blob([buffer], {type: 'application/pdf'});
                $timeout(function() {
                    deferred.resolve(pdfBlob);
                }, 100);
			}
			catch (e) {
				deferred.reject(e);
			}
			
			return deferred.promise;
		}
//
// 5.SaveFile: use the File plugin to save the pdfBlob and return a filePath to the client
//
		var saveFile = function (pdfBlob) {
			var deferred = $q.defer();
			
			var filePath = "";
			try {
				console.log('SaveFile: requestFileSystem');
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
                //window.requestFileSystem(cordova.file.cacheDirectory, 0, gotFS, fail);
                //window.resolveLocalFileSystemURI("file:///example.txt", onResolveSuccess, fail);
                
			}
			catch (e) {
				console.error('SaveFile_Err: ' + e.message);
				deferred.reject(e);
				throw({code:-1401,message:'unable to save report file'});
			}			

			function gotFS(fileSystem) {
				console.error('SaveFile: gotFS --> getFile');
				fileSystem.root.getFile("DoctorOnCallPrescription.pdf", {create: true, exclusive: false}, gotFileEntry, fail);
			}

			function gotFileEntry(fileEntry) {
				console.error('SaveFile: gotFileEntry --> (filePath) --> createWriter');
				filePath = fileEntry.toURL();
				fileEntry.createWriter(gotFileWriter, fail);
			}

			function gotFileWriter(writer) {
				console.error('SaveFile: gotFileWriter --> write --> onWriteEnd(resolve)');
				writer.onwriteend = function(evt) {
                    console.log('writer Success: ' + evt.toString());
                   $timeout(function() {
                      deferred.resolve(filePath);
                    }, 100);
				};
				writer.onerror = function(e) {
                    console.log('writer error: ' + e.toString());
					deferred.reject(e);
				};
				writer.write(pdfBlob);
			}

            function fail(error) {
				console.log(error.code);
				deferred.reject(error);
			}
			
			return deferred.promise;
		}
//
// Loading UI Functions: utility functions to show/hide loading UI
//
       var showLoading= function (msg) {
            $rootScope.$broadcast('ReportSvc::Progress', msg);
        }
        var hideLoading = function (){
            $rootScope.$broadcast('ReportSvc::Done');
        }
 

        return {
            generateReportDef: generateReportDef,
            generateReportDoc:generateReportDoc,
            generateReportBuffer:generateReportBuffer,
            getDataURL:getDataURL,
            generateReportBlob:generateReportBlob,
            saveFile:saveFile,
            showLoading:showLoading,
            hideLoading:hideLoading,
            runReportAsync: this.runReportAsync,
		    runReportDataURL :this.runReportDataURL,
		    runReportImage:this.runReportImage ,
            runReportDoc:this.runReportDoc

        };

  }])

       








