;(function ( $, window, document, undefined ) {
    var pluginName = "lazyChat";
    var defaults = {
        language: 'en',
        title: 'LazyChat',
    };

    function Plugin ( element, options ) {
      this.element   = element;
      this.settings  = $.extend( {}, defaults, options );
      this._defaults = defaults;
      this._name     = pluginName;
      this.init();
      this.addEvents();
    }

    Plugin.prototype = {
        init: function () {            
            var currentLazyChatElem = $(this.element);

            currentLazyChatElem.find('.lazychat-title').text(this.settings.title);
        },
        addEvents: function() {
          var currentLazyChatElem = $(this.element);

          //////////////////
          // Toogle event //
          //////////////////
          
          currentLazyChatElem.find('.header .toggle-chat').on('click', function() {
            var toogleChatElem = $(this);
           
            if (toogleChatElem.text() == '-') {
              $('.lazychat .message').slideUp('fast');
              toogleChatElem.text('+');
            } else {
              $('.lazychat .message').slideDown('fast');
              toogleChatElem.text('-');
                
              $('.lazychat .message .timeline').animate({
                scrollTop: $('.lazychat .message .timeline')[0].scrollHeight
              }, 500);
            }
          });

          //////////////////////////
          // Enter keypress event //
          //////////////////////////

          currentLazyChatElem.find('.input input').on('keypress', function(event) {
            var inputMessageElem = $(this);
            var message = inputMessageElem.val();

            if (event.keyCode == 13 && $.trim(message) != '') {
              currentLazyChatElem.find('.message .timeline').animate({
                scrollTop: currentLazyChatElem.find('.message .timeline')[0].scrollHeight
              }, 500);
              
              var appendHTML = '';
      
              appendHTML += '<div class="client" data-message-id="">';
              appendHTML += '<div class="row">';
              appendHTML += '<div class="col-xs-12">';
              appendHTML += '<span class="pull-left" style="width: 85%"><i>Poucos segundos atrás</i><br>';
              appendHTML += '<div class="arrow"></div>';
              appendHTML += message+'</span>';
              appendHTML += '<div class="avatar pull-right" style="width: 13%">';
              appendHTML += '<img src="http://beta.buscapremiada.com/portal/assets/img/tmp/business/chat.png" alt="">';
              appendHTML += '</div>';
              appendHTML += '</div>';
              appendHTML += '</div>';
              appendHTML += '</div>';
              
              currentLazyChatElem.find('.message .timeline').append(appendHTML);
              inputMessageElem.val('');
          }
        });
      }
    };

    $.fn[ pluginName ] = function ( options ) {
      return this.each(function() {
        if ( !$.data( this, 'plugin_' + pluginName ) ) {
            $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
        }
      });
    };

})( jQuery, window, document );