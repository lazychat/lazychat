;(function ( $, window, document, undefined ) {
    var pluginName = "lazyChat";
    var defaults = {
        base_url: ''
        language: 'en',
        title: 'LazyChat',
        listen: 'anonymous'
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
            var bodyElem = $(this.element);
            var listen = this.settings.listen;
            var base_url = this.settings.base_url;

            bodyElem.find('.lazychat .lazychat-title').text(this.settings.title);

            (function requestMessageLoop(){
              setTimeout(function() {
                window.clearTimeout();

                $(document).find('.lazychat').each(function() {
                  var lazyChatElem = $(this);

                  if (lazyChatElem.is(':visible')) {
                    $.ajax({
                      type: 'POST',
                      url: base_url+'/php/public/get-message',
                      data: { server: lazyChatElem.find('input[name=request-id]').val(), client: listen },
                      success: function(data) {
                        eval(data);

                        var updateScroll = false;
                
                        var timelineElem = lazyChatElem.find('.message .timeline');
                        var scrollTop    = timelineElem.scrollTop();
                        var scrollHeight = (timelineElem[0].scrollHeight - timelineElem.outerHeight()) - 3;

                        if (scrollTop >= scrollHeight) {
                          updateScroll = true;
                        }

                        for (var key in messagesArray) {            
                          if (lazyChatElem.find('[data-message-id='+messagesArray[key]._id.$id+']').length <= 0) {
                            var chatClass = messagesArray[key]._message.client == listen ? 'client' : 'assistant';
                            
                            var appendHTML = '';

                            appendHTML += '<div class="'+chatClass+'" data-message-id="'+messagesArray[key]._id.$id+'">';
                            appendHTML += '<div class="row">';
                            appendHTML += '<div class="col-xs-12">';
                            appendHTML += '<span class="message-content">';
                            appendHTML += '<div class="arrow"></div>';
                            appendHTML += messagesArray[key]._message.content;
                            appendHTML += '<br><i>Poucos segundos atrás</i></span>';
                            appendHTML += '<div class="avatar">';
                            appendHTML += '<img src="http://www.cosmicgirlgames.com/images/menu/flat.png" width="30" alt="">';
                            appendHTML += '</div>';
                            appendHTML += '</div>';
                            appendHTML += '</div>';
                            appendHTML += '</div>';
                                            
                            lazyChatElem.find('.message .timeline').append(appendHTML);
                          }
                        }

                        if (updateScroll) {
                          timelineElem.animate({
                            scrollTop: timelineElem[0].scrollHeight
                          }, 300);
                        }
                    }
                  });
                }
                });

                requestMessageLoop();
              }, 1000);
            })();
        },
        addEvents: function() {
          var bodyElem = $(this.element);
          var listen = this.settings.listen;
          var base_url = this.settings.base_url;

          ///////////////////////////////
          // LazyChat new window event //
          ///////////////////////////////

          bodyElem.find('.lazychat-window').on('click', function(event) {
            event.preventDefault();

            var newWindowElem = $(this);
            var connectionID = newWindowElem.attr('data-connection');

            if (listen != connectionID) {
              // Window Construction
              var windowLayout = bodyElem.find('.lazychat-layout').html().replace('{{ request-id }}', '<input type="hidden" name="request-id" value="'+connectionID+'">');
              bodyElem.append(windowLayout);
            } else {
              console.log('ERRO! Listen is equal window id');
            }
          });

          //////////////////
          // Toogle event //
          //////////////////
          
          $(document).on('click', '.lazychat .header .toggle-chat', function() {
            var toogleChatElem = $(this);
            var lazyChatElem = $(this).parent().parent().parent();
           
            if (toogleChatElem.text() == '-') {
              lazyChatElem.find('.message').slideUp('fast');
              toogleChatElem.text('+');
            } else {
              lazyChatElem.find('.message').slideDown('fast');
              toogleChatElem.text('-');
                
              lazyChatElem.find('.message .timeline').animate({
                scrollTop: lazyChatElem.find('.message .timeline')[0].scrollHeight
              }, 300);
            }
          });

          //////////////////////////
          // Enter keypress event //
          //////////////////////////

          $(document).on('keypress', '.lazychat .input input', function(event) {
            var inputMessageElem = $(this);
            var message = $.trim(inputMessageElem.val());
            var server = $(this).parent().parent().parent().find('input[name=request-id]').val();
            var timeLineElem = $(this).parent().parent().parent().find('.timeline');

            if (event.keyCode == 13 && message != '') {     
              $.post(base_url+'/php/public/save-message', { server: server, client: listen, message: message }, function(messageId) {
                var appendHTML = '';

                appendHTML += '<div class="client" data-message-id="'+messageId+'">';
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
                
                bodyElem.find('.lazychat .message .timeline').append(appendHTML);
                inputMessageElem.val('');

                timeLineElem.animate({
                  scrollTop: timeLineElem[0].scrollHeight
                }, 300);
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