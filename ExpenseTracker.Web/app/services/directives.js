(function() {
    'use strict';

    var app = angular.module('app');

    app.directive('ccSidebar', ['$window', function ($window) {
        // Repositions the sidebar on window resize 
        // and opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        var $win = $($window);
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $win.resize(resize);
            $dropdownElement.click(dropdown);

            function resize() {
                $win.width() >= 765 ? $sidebarInner.slideDown(350) : $sidebarInner.slideUp(350);
            }

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    }]);

    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="icon-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="icon-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });
    

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="icon-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="icon-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('icon-chevron-up');
                    iElement.addClass('icon-chevron-down');
                } else {
                    iElement.removeClass('icon-chevron-down');
                    iElement.addClass('icon-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="icon-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="icon-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown() : element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('focusOn', function () {
        return function (scope, elem, attr) {
            scope.$on('focusOn', function (e, name) {
                if (name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    });    

    app.directive('validMoney', function () {
        'use strict';
      var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

      function link(scope, el, attrs, ngModelCtrl) {
        var min = parseFloat(attrs.min || 0);
        var precision = parseFloat(attrs.precision || 2);
        var lastValidValue;

        function round(num) {
          var d = Math.pow(10, precision);
          return Math.round(num * d) / d;
        }

        function formatPrecision(value) {
          return parseFloat(value).toFixed(precision);
        }

        function formatViewValue(value) {
          return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
        }


        ngModelCtrl.$parsers.push(function (value) {
          // Handle leading decimal point, like ".5"
          if (value.indexOf('.') === 0) {
            value = '0' + value;
          }

          // Allow "-" inputs only when min < 0
          if (value.indexOf('-') === 0) {
            if (min >= 0) {
              value = null;
              ngModelCtrl.$setViewValue('');
              ngModelCtrl.$render();
            } else if (value === '-') {
              value = '';
            }
          }

          var empty = ngModelCtrl.$isEmpty(value);
          if (empty || NUMBER_REGEXP.test(value)) {
            lastValidValue = (value === '')
              ? null
              : (empty ? value : parseFloat(value));
          } else {
            // Render the last valid input in the field
            ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
            ngModelCtrl.$render();
          }

          ngModelCtrl.$setValidity('number', true);
          return lastValidValue;
        });
        ngModelCtrl.$formatters.push(formatViewValue);

        var minValidator = function(value) {
          if (!ngModelCtrl.$isEmpty(value) && value < min) {
            ngModelCtrl.$setValidity('min', false);
            return undefined;
          } else {
            ngModelCtrl.$setValidity('min', true);
            return value;
          }
        };
        ngModelCtrl.$parsers.push(minValidator);
        ngModelCtrl.$formatters.push(minValidator);

        if (attrs.max) {
          var max = parseFloat(attrs.max);
          var maxValidator = function(value) {
            if (!ngModelCtrl.$isEmpty(value) && value > max) {
              ngModelCtrl.$setValidity('max', false);
              return undefined;
            } else {
              ngModelCtrl.$setValidity('max', true);
              return value;
            }
          };

          ngModelCtrl.$parsers.push(maxValidator);
          ngModelCtrl.$formatters.push(maxValidator);
        }

        // Round off
        if (precision > -1) {
          ngModelCtrl.$parsers.push(function (value) {
            return value ? round(value) : value;
          });
          ngModelCtrl.$formatters.push(function (value) {
            return value ? formatPrecision(value) : value;
          });
        }

        el.bind('blur', function () {
          var value = ngModelCtrl.$modelValue;
          if (value) {
            ngModelCtrl.$viewValue = formatPrecision(value);
            ngModelCtrl.$render();
          }
        });
      }

      return {
        restrict: 'A',
        require: 'ngModel',
        link: link
      };
    });

})();