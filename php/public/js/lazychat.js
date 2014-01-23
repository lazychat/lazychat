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

            (function requestMessageLoop(){
              setTimeout(function() {
                $.ajax({
                    url: '/php/public/get-message',
                    type: 'POST',
                    data: {conversation_id: conversationIdElem.val(), date_consult: dateConsultElem.val()},
                    dataType: "html",
                    success: function (data) {
                      eval(data);
                      
                      var updateScroll = false;
                      
                      var timelineElem = $('.chat .message .timeline');
                      var scrollTop    = timelineElem.scrollTop();
                      var scrollHeight = timelineElem[0].scrollHeight - (timelineElem.outerHeight());
                      
                      if (scrollTop == scrollHeight) {
                        updateScroll = true;
                      }
                      
                      for (var key in messagesArray) {            
                        if ($('.chat .timeline').find('[data-message-id='+messagesArray[key]._id.$id+']').length <= 0) {
                          var dateFromNow = moment(messagesArray[key].message.change_date).fromNow();
                          var appendHTML = '';
                          
                          var appendHTML = '';
                          appendHTML += '<div class="assistant" data-message-id="+messageId+">';
                          appendHTML += '<div class="row">';
                          appendHTML += '<<di>                                                                                                                                                                                                                                                                                </di>v class="col-xs-12">';
                          appendHTML += '<span class="message-content">';
                          appendHTML += '<div class="arrow"></div>';
                          appendHTML += messagesArray[key].message.message;
                          appendHTML += '<br><i>Poucos segundos atrás</i></span>';
                          appendHTML += '<div class="avatar">';
                          appendHTML += '<img src="http://www.cosmicgirlgames.com/images/menu/flat.png" width="30" alt="">';
                          appendHTML += '</div>';
                          appendHTML += '</div>';
                          appendHTML += '</div>';
                          appendHTML += '</div>';          'lazychat.js'
                                          
                          currentLazyChatElem.find('.timeline').append(appendHTML);
                        }
                      };
                      
                      var newScrollTop    = timelineElem.scrollTop();
                      var newScrollHeight = timelineElem[0].scrollHeight - (timelineElem.height() + 20);
                      
                      if (updateScroll && newScrollTop != newScrollHeight) {
                        update_timeline_scroll();
                      }
                      
                      if (typeof newStorageDate != 'undefined') {
                        dateConsultElem.val(newStorageDate);
                      }
                      
                      requestMessageLoop();
                    },
                  });
              }, 500);
            })();
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
            var message = $.trim(inputMessageElem.val());

            if (event.keyCode == 13 && message != '') {            
              $.post('/php/public/save-message', { message: message }, function(messageId) {
                var appendHTML = '';

                // http://m1.behance.net/rendition/modules/85530099/disp/9733ab203bbfb89d5639c189bccdc046.png
                // http://www.cosmicgirlgames.com/images/menu/flat.png

                appendHTML += '<div class="assistant" data-message-id="+messageId+">';
                appendHTML += '<div class="row">';
                appendHTML += '<div class="col-xs-12">';
                appendHTML += '<span class="message-content">';
                appendHTML += '<div class="arrow"></div>';
                appendHTML += message;
                appendHTML += '<br><i>Poucos segundos atrás</i></span>';
                appendHTML += '<div class="avatar">';
                appendHTML += '<img src="http://www.cosmicgirlgames.com/images/menu/flat.png" width="30" alt="">';
                appendHTML += '</div>';
                appendHTML += '</div>';
                appendHTML += '</div>';
                appendHTML += '</div>';
                
                currentLazyChatElem.find('.message .timeline').append(appendHTML);
                inputMessageElem.val('');

                currentLazyChatElem.find('.message .timeline').animate({
                  scrollTop: currentLazyChatElem.find('.message .timeline')[0].scrollHeight
                }, 200);
              });
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