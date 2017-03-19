angular.module('myapp.directives', [])

  .directive('onValidSubmit', ['$parse', '$timeout', function ($parse, $timeout) {
      return {
          require: '^form',
          restrict: 'A',
          link: function (scope, element, attrs, form) {
              form.$submitted = false;
              var fn = $parse(attrs.onValidSubmit);
              element.on('submit', function (event) {
                  scope.$apply(function () {
                      element.addClass('ng-submitted');
                      form.$submitted = true;
                      if (form.$valid) {
                          if (typeof fn === 'function') {
                              fn(scope, { $event: event });
                          }
                      }
                  });
              });
          }
      }

  }])
  .directive('validated', ['$parse', function ($parse) {
      return {
          restrict: 'AEC',
          require: '^form',
          link: function (scope, element, attrs, form) {
              var inputs = element.find("*");
              for (var i = 0; i < inputs.length; i++) {
                  (function (input) {
                      var attributes = input.attributes;
                      if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                          var field = form[attributes.name.value];
                          if (field != void 0) {
                              scope.$watch(function () {
                                  return form.$submitted + "_" + field.$valid;
                              }, function () {
                                  if (form.$submitted != true) return;
                                  var inp = angular.element(input);
                                  if (inp.hasClass('ng-invalid')) {
                                      element.removeClass('has-success');
                                      element.addClass('has-error');
                                  } else {
                                      element.removeClass('has-error').addClass('has-success');
                                  }
                              });
                          }
                      }
                  })(inputs[i]);
              }
          }
      }
  }])
  .directive('mhToggle', function($ionicGesture, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            template:
            '<div class="wrap">' +
          //  '<div ng-transclude></div>' +
            '<label class="toggle">' +
            '<input type="checkbox">' +
            '<div class="track">' +
            '<div class="handle"></div>' +
            '</div>' +
            '</label>' +
            '</div>',

            compile: function(element, attr) {
                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-checked': attr.ngChecked,
                    'ng-disabled': attr.ngDisabled,
                    'ng-true-value': attr.ngTrueValue,
                    'ng-false-value': attr.ngFalseValue,
                    'ng-change': attr.ngChange
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

      
                if(attr.toggleClass) {
                    element[0].getElementsByTagName('label')[0].classList.add(attr.toggleClass);
                }

                return function($scope, $element, $attr) {
                    var el, checkbox, track, handle;

                    el = $element[0].getElementsByTagName('label')[0];
                    checkbox = el.children[0];track = el.children[1];
                    handle = track.children[0];

                    var ngModelController = angular.element(checkbox).controller('ngModel');

                    $scope.toggle = new ionic.views.Toggle({
                        el: el,
                        track: track,
                        checkbox: checkbox,
                        handle: handle,
                        onChange: function() {
                            if(checkbox.checked) {
                                ngModelController.$setViewValue(true);
                            } else {
                                ngModelController.$setViewValue(false);
                            }
                            $scope.$apply();
                        }
                    });

                    $scope.$on('$destroy', function() {
                        $scope.toggle.destroy();
                    });
                };
            }

        };
    })

.directive('ionGooglePlace', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$ionicPlatform',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        function ($ionicTemplateLoader, $ionicBackdrop, $ionicPlatform, $q, $timeout, $rootScope, $document) {
            return {
                require: '?ngModel',
                restrict: 'AE',
                template: '<input type="text" readonly="readonly" required="required" class="ion-google-place" autocomplete="off" >',
                replace: true,
                scope: {
                    displayaddress: '=ngDisplayaddress',
                    ngModel: '=?',
                    geocodeOptions: '='
                },
                link: function (scope, element, attrs, ngModel) {
                    var unbindBackButtonAction;

                    scope.locations = [];
                    var geocoder = new google.maps.Geocoder();
                    var searchEventTimeout = undefined;

                    var POPUP_TPL = [
                        '<div class="ion-google-place-container modal">',
                            '<div class="bar bar-header item-input-inset">',
                                '<label class="item-input-wrapper">',
                                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                                    '<input class="google-place-search" type="search" ng-model="searchQuery" placeholder="' + (attrs.searchPlaceholder || 'Enter an address, place or ZIP code') + '">',
                                '</label>',
                                '<button class="button button-clear">',
                                    attrs.labelCancel || 'Cancel',
                                '</button>',
                            '</div>',
                            '<ion-content class="has-header has-header">',
                                '<ion-list>',
                                    '<ion-item ng-repeat="location in locations" type="item-text-wrap" ng-click="selectLocation(location)">',
                                        '{{location.formatted_address}}',
                                    '</ion-item>',
                                '</ion-list>',
                            '</ion-content>',
                        '</div>'
                    ].join('');

                    var popupPromise = $ionicTemplateLoader.compile({
                        template: POPUP_TPL,
                        scope: scope,
                        appendTo: $document[0].body
                    });

                    popupPromise.then(function (el) {
                        var searchInputElement = angular.element(el.element.find('input'));

                        scope.selectLocation = function (location) {
                            ngModel.$setViewValue(location);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();

                            if (unbindBackButtonAction) {
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        };

                        scope.$watch('searchQuery', function (query) {
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function () {
                                if (!query) return;
                                if (query.length < 3);

                                var req = scope.geocodeOptions || {};
                                req.address = query;
                                geocoder.geocode(req, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        scope.$apply(function () {
                                            scope.locations = results;
                                        });
                                    } else {
                                        // @TODO: Figure out what to do when the geocoding fails
                                    }
                                });
                            }, 350); // we're throttling the input by 350ms to be nice to google's API
                        });

                        scope.$watch('displayaddress', function () {

                            element.val(scope.displayaddress);
                            scope.searchQuery = scope.displayaddress;
                        });

                        var onClick = function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            $ionicBackdrop.retain();
                            unbindBackButtonAction = $ionicPlatform.registerBackButtonAction(closeOnBackButton, 250);

                            el.element.css('display', 'block');
                            searchInputElement[0].focus();
                            setTimeout(function () {
                                searchInputElement[0].focus();
                            }, 0);
                        };

                        var onCancel = function (e) {
                            scope.searchQuery = '';
                            $ionicBackdrop.release();
                            el.element.css('display', 'none');

                            if (unbindBackButtonAction) {
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        };

                        closeOnBackButton = function (e) {
                            e.preventDefault();

                            el.element.css('display', 'none');
                            $ionicBackdrop.release();

                            if (unbindBackButtonAction) {
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        }

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);
                    });

                    if (attrs.placeholder) {
                        element.attr('placeholder', attrs.placeholder);
                    }


                    ngModel.$formatters.unshift(function (modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function (viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function () {
                        if (!ngModel.$viewValue) {
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue.formatted_address || '');
                        }
                    };

                    scope.$on("$destroy", function () {
                        if (unbindBackButtonAction) {
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }
                    });
                }
            };
        }
])

.directive('ngAutocomplete', function ($parse) {
    return {

        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function (scope, element, attrs, model) {

            //options for autocomplete
            var opts

            //convert options provided to opts
            var initOpts = function () {
                opts = {}
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                    }
                }
            }
            initOpts()

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
                        //              if (scope.details) {
                        scope.details = scope.gPlace.getPlace();
                        //              }
                        scope.ngAutocomplete = element.val();
                    });
                })
            }
            newAutocomplete()

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
                newAutocomplete()
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
})

.directive('googleplace', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                scope.$apply(function () {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
})
.directive('standardTimeMeridian', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            etime: '=etime'
        },
        template: "<strong>{{stime}}</strong>",
        link: function (scope, elem, attrs) {

            scope.stime = epochParser(scope.etime, 'time');

            function prependZero(param) {
                if (String(param).length < 2) {
                    return "0" + String(param);
                }
                return param;
            }

            function epochParser(val, opType) {
                if (val === null) {
                    return "00:00";
                } else {
                    var meridian = ['AM', 'PM'];

                    if (opType === 'time') {
                        var hours = parseInt(val / 3600);
                        var minutes = (val / 60) % 60;
                        var hoursRes = hours > 12 ? (hours - 12) : hours;

                        var currentMeridian = meridian[parseInt(hours / 12)];

                        return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                    }
                }
            }

            scope.$watch('etime', function (newValue, oldValue) {
                scope.stime = epochParser(scope.etime, 'time');
            });

        }
    };
})
.directive('ionAffix', ['$ionicPosition', '$compile', function ($ionicPosition, $compile) {

    // keeping the Ionic specific stuff separated so that they can be changed and used within an other context

    // see https://api.jquery.com/closest/ and http://ionicframework.com/docs/api/utility/ionic.DomUtil/
    function getParentWithClass(elementSelector, parentClass) {
        return angular.element(ionic.DomUtil.getParentWithClass(elementSelector[0], parentClass));
    }

    // see http://underscorejs.org/#throttle
    function throttle(theFunction) {
        return ionic.Utils.throttle(theFunction);
    }

    // see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // see http://ionicframework.com/docs/api/utility/ionic.DomUtil/
    function requestAnimationFrame(callback) {
        return ionic.requestAnimationFrame(callback);
    }

    // see https://api.jquery.com/offset/
    // see http://ionicframework.com/docs/api/service/$ionicPosition/
    function offset(elementSelector) {
        return $ionicPosition.offset(elementSelector);
    }

    // see https://api.jquery.com/position/
    // see http://ionicframework.com/docs/api/service/$ionicPosition/
    function position(elementSelector) {
        return $ionicPosition.position(elementSelector);
    }

    function applyTransform(element, transformString) {
        // do not apply the transformation if it is already applied
        if (element.style[ionic.CSS.TRANSFORM] == transformString) {
        }
        else {
            element.style[ionic.CSS.TRANSFORM] = transformString;
        }
    }

    function translateUp(element, dy, executeImmediately) {
        var translateDyPixelsUp = dy == 0 ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, -' + dy + 'px, 0px)';
        // if immediate execution is requested, then just execute immediately
        // if not, execute in the animation frame.
        if (executeImmediately) {
            applyTransform(element, translateDyPixelsUp);
        }
        else {
            // see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
            // see http://ionicframework.com/docs/api/utility/ionic.DomUtil/
            requestAnimationFrame(function () {
                applyTransform(element, translateDyPixelsUp);
            });
        }
    }

    var CALCULATION_THROTTLE_MS = 500;

    return {
        // only allow adding this directive to elements as an attribute
        restrict: 'A',
        // we need $ionicScroll for adding the clone of affix element to the scroll container
        // $ionicScroll.element gives us that
        require: '^$ionicScroll',
        link: function ($scope, $element, $attr, $ionicScroll) {
            // get the affix's container. element will be affix for that container.
            // affix's container will be matched by "affix-within-parent-with-class" attribute.
            // if it is not provided, parent element will be assumed as the container
            var $container;
            if ($attr.affixWithinParentWithClass) {
                $container = getParentWithClass($element, $attr.affixWithinParentWithClass);
                if (!$container) {
                    $container = $element.parent();
                }
            }
            else {
                $container = $element.parent();
            }

            var scrollMin = 0;
            var scrollMax = 0;
            var scrollTransition = 0;
            // calculate the scroll limits for the affix element and the affix's container
            var calculateScrollLimits = function (scrollTop) {
                var containerPosition = position($container);
                var elementOffset = offset($element);

                var containerTop = containerPosition.top;
                var containerHeight = containerPosition.height;

                var affixHeight = elementOffset.height;

                scrollMin = scrollTop + containerTop;
                scrollMax = scrollMin + containerHeight;
                scrollTransition = scrollMax - affixHeight;
            };
            // throttled version of the same calculation
            var throttledCalculateScrollLimits = throttle(
                calculateScrollLimits,
                CALCULATION_THROTTLE_MS,
                { trailing: false }
            );

            var affixClone = null;

            // creates the affix clone and adds it to DOM. by default it is put to top
            var createAffixClone = function () {
                var clone = $element.clone().css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                });

                // if directive is given an additional CSS class to apply to the clone, then apply it
                if ($attr.affixClass) {
                    clone.addClass($attr.affixClass);
                }

                // remove the directive matching attribute from the clone, so that an affix is not created for the clone as well.
                clone.removeAttr('ion-affix').removeAttr('data-ion-affix').removeAttr('x-ion-affix');

                angular.element($ionicScroll.element).append(clone);

                // compile the clone so that anything in it is in Angular lifecycle.
                $compile(clone)($scope);

                return clone;
            };

            // removes the affix clone from DOM. also deletes the reference to it in the memory.
            var removeAffixClone = function () {
                if (affixClone)
                    affixClone.remove();
                affixClone = null;
            };

            $scope.$on("$destroy", function () {
                // 2 important things on destroy:
                // remove the clone
                // unbind the scroll listener
                // see https://github.com/aliok/ion-affix/issues/1
                removeAffixClone();
                angular.element($ionicScroll.element).off('scroll');
            });


            angular.element($ionicScroll.element).on('scroll', function (event) {
                var scrollTop = (event.detail || event.originalEvent && event.originalEvent.detail).scrollTop;
                // when scroll to top, we should always execute the immediate calculation.
                // this is because of some weird problem which is hard to describe.
                // if you want to experiment, always use the throttled one and just click on the page
                // you will see all affix elements stacked on top
                if (scrollTop == 0) {
                    calculateScrollLimits(scrollTop);
                }
                else {
                    throttledCalculateScrollLimits(scrollTop);
                }

                // when we scrolled to the container, create the clone of element and place it on top
                if (scrollTop >= scrollMin && scrollTop <= scrollMax) {

                    // we need to track if we created the clone just now
                    // that is important since normally we apply the transforms in the animation frame
                    // but, we need to apply the transform immediately when we add the element for the first time. otherwise it is too late!
                    var cloneCreatedJustNow = false;
                    if (!affixClone) {
                        affixClone = createAffixClone();
                        cloneCreatedJustNow = true;
                    }

                    // if we're reaching towards the end of the container, apply some nice translation to move up/down the clone
                    // but if we're reached already to the container and we're far away than the end, move clone to top
                    if (scrollTop > scrollTransition) {
                        translateUp(affixClone[0], Math.floor(scrollTop - scrollTransition), cloneCreatedJustNow);
                    } else {
                        translateUp(affixClone[0], 0, cloneCreatedJustNow);
                    }
                } else {
                    removeAffixClone();
                }
            });
        }
    }
}])
.directive('hideTabs', function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, $el) {
            $rootScope.hideTabs = 'tabs-item-hide';
            $scope.$on('$destroy', function () {
                $rootScope.hideTabs = '';
            });
        }
    };
})
