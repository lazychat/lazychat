jQuery(function($){    
  moment.lang('pt-br');
    

  var conversationIdElem = $('.chat input[name=conversation-id]');
  var dateConsultElem   = $('.chat input[name=date-consult]');
  conversationIdElem.val('aa404c86b2aeb2b4981439cf3b1a3286ae9e88dc');
  
  /*$.post('/openchat/hash-start', function(data) {
    conversationIdElem.val(data);
    var conversationId = conversationIdElem.val();
  });*/
  
  function update_timeline_scroll() {
    var timelineElem         = $('.chat .message .timeline');
    var timelineScrollTop    = timelineElem.scrollTop();
    var timelineScrollHeight = timelineElem[0].scrollHeight;
   
    timelineElem.animate({
      scrollTop: timelineScrollHeight
    }, 500);
  }
  
   $('.chat .header .toggle-chat').on('click', function() {
    	var elem = $(this);
     
    	if (elem.text() == '-') {
    		$('.chat .message').slideUp();
    		elem.text('+');
    	} else {
    		$('.chat .message').slideDown();
    		elem.text('-');
          
          	$('.chat .message .timeline').animate({
              scrollTop: $('.chat .message .timeline')[0].scrollHeight
            }, 500);
    	}
    });

    $('.chat .input input').on('keypress', function(event) {      
        var currentElem = $(this);
        var message = currentElem.val();

        if (event.keyCode == 13 && $.trim(message) != '') {
          $('.chat .message .timeline').animate({
            scrollTop: $('.chat .message .timeline')[0].scrollHeight
          }, 500);
          
          $.post('/openchat/save-message', {conversation_id: conversationIdElem.val(), user_name: 'Juliano Amaral', message: message}, function(messageId) {            
              if (messageId != '') {
                  
                var dateFromNow = moment().fromNow();
                var appendHTML = '';
        
                appendHTML += '<div class="client" data-message-id="'+messageId+'">';
                appendHTML += '<div class="row">';
                appendHTML += '<div class="col-xs-12">';
                appendHTML += '<span class="pull-left" style="width: 85%"><i>'+dateFromNow+'</i><br>';
                appendHTML += '<div class="arrow"></div>';
                appendHTML += message+'</span>';
                appendHTML += '<div class="avatar pull-right" style="width: 13%">';
                appendHTML += '<img src="http://beta.buscapremiada.com/portal/assets/img/tmp/business/chat.png" alt="">';
                appendHTML += '</div>';
                appendHTML += '</div>';
                appendHTML += '</div>';
              	appendHTML += '</div>';
                
                $('.chat .message .timeline').append(appendHTML);
            	currentElem.val('');
              }
            });
        }
    });
  
    (function requestMessageLoop(){
      	setTimeout(function() {
        	$.ajax({
              url: '/openchat/get-message',
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
                
                    appendHTML += '<div class="client" data-message-id="'+messagesArray[key]._id.$id+'">';
                    appendHTML += '<div class="row">';
                    appendHTML += '<div class="col-xs-12">';
                    appendHTML += '<span class="pull-left" style="width: 85%"><i>'+dateFromNow+'</i><br>';
                    appendHTML += '<div class="arrow"></div>';
                    appendHTML += messagesArray[key].message.message+'</span>';
                    appendHTML += '<div class="avatar pull-right" style="width: 13%;">';
                    appendHTML += '<img src="http://beta.buscapremiada.com/portal/assets/img/tmp/business/chat.png" alt="">';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                  	appendHTML += '</div>';
                                    
                    $('.chat .message .timeline').append(appendHTML);
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
;});