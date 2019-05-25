/**
 * jQuery dorin's GUI
 *
**/

(function($) {

$.dg_isMobile = /Mobi/i.test(navigator.userAgent);

Date.prototype.standard = function()
{
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  var hour = this.getHours().toString();
  var min = this.getMinutes().toString();
  var sec = this.getSeconds().toString();
  return yyyy+"/"+(mm[1]?mm:"0"+mm[0])+"/"+(dd[1]?dd:"0"+dd[0])+' '+(hour[1]?hour:'0'+hour[0])+':'+(min[1]?min:'0'+min[0])+':'+(sec[1]?sec:'0'+sec[0]); // padding
};

$.fn.dg_triggerError = function(options)
{
  var form_element = this;
  var element = null;
  var class_name = '';
  var trigger_border = true;
  var hide_error = false;

  // Customizing options from the user
	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'error-class': class_name = value; break;
			case 'target': element = $(value); break;
			case 'trigger-border': trigger_border = value; break;
			case 'hide': hide_error = value; break;
		}
	});

  var div_error_messages = $(element).next('.error-messages:first');

  if ( !div_error_messages.length )
  {
    div_error_messages = $(form_element).find('.error-messages'); // get all error messages
    div_error_messages = $(div_error_messages).eq($(div_error_messages).index(element) + 1); // find the next from the element (do it this way because sometimes next div error messages is nested somewhere else)
  }

  if ( div_error_messages.length )
  {
    if ( hide_error )
    {
      $(div_error_messages).find("[class*='error-']").addClass('d-none');
      $(div_error_messages).addClass('d-none');

      if ( trigger_border )
        $(element).removeClass('border-danger');
    }
    else
    {
      var div_error = $(div_error_messages).find('.'+class_name+':first');

      if ( div_error.length )
      {
        $(div_error_messages).find("[class*='error-']").addClass('d-none');
        $(div_error_messages).removeClass('d-none');
        $(div_error).removeClass('d-none');

        if ( trigger_border )
          $(element).addClass('border-danger');
      }
    }
  }
}

$.fn.dg_validate = function()
{
	var form_element = this;
	var passed = true;

	// For each input element in this form
	$.each($(form_element).find('[dg_validate]'), function(index_element, element)
	{
		var options = $(element).attr('dg_validate').split(' ');

    var has_errors  = false;
    var messages = '';

    var div_error_messages = $(element).next('.error-messages:first');

    if ( !div_error_messages.length )
    {
      div_error_messages = $(form_element).find('.error-messages'); // get all error messages
      div_error_messages = $(div_error_messages).eq($(div_error_messages).index(element) + 1); // find the next from the element (do it this way because sometimes next div error messages is nested somewhere else)
    }

    if ( div_error_messages.length )
      $(div_error_messages).find("[class*='error-']").addClass('d-none');

		// For each options on this input element
		$.each(options, function(index_option, option)
		{
			var option_array = option.split(':');

      var element_value = $(element).val(); // console.log('('+option_array[0]+')');

			switch (option_array[0])
			{
				// Check for minimum number of characters
				case 'min-chars':
				{
          var min_chars = parseInt(option_array[1]);

					if ( element_value.length < min_chars )
					{
            has_errors  = true;

            // Let's check if there was a custom message
            if ( div_error_messages.length )
            {
              var div_error_class = '.error-'+option.replace(':', '-')+':first';
              var div_error = $(div_error_messages).find(div_error_class);

              if ( div_error.length )
              {
                $(div_error).removeClass('d-none');
                break;
              }
            }

            var message = '';

            var element_title = $(element).attr('title');
            var element_name = $(element).attr('name');
            var element_placeholder = $(element).attr('placeholder');

            if ( element_title && element_title.length )
            message = '<b>'+element_title+'</b> must have '+option_array[1]+'+ characters.';
            else if ( element_name && element_name.length )
            message = '<b>'+$.dg_ucwords(element_name)+'</b> must have '+option_array[1]+'+ characters.';
            else if ( element_placeholder && element_placeholder.length )
            message = '<b>'+$.dg_ucwords(element_placeholder)+'</b> must have '+option_array[1]+'+ characters.';
            else
            message = 'Input must have '+option_array[1]+'+ characters.';

            messages += '<p>'+message+'</p>';
					}

					break;
				}

        case 'email':
        {
          if ( element_value.length )
          {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;

            if ( !regex.test(element_value) )
  					{
              has_errors  = true;

              // Let's check if there was a custom message
              if ( div_error_messages.length )
              {
                var div_error_class = '.error-'+option+':first';
                var div_error = $(div_error_messages).find(div_error_class);

                if ( div_error.length )
                {
                  $(div_error).removeClass('d-none');
                  break;
                }
              }

              message = 'Invalid email syntax!';

              messages += '<p>'+message+'</p>';
  					}
          }

          break;
        }
			}
		});

    if ( has_errors )
    {
      $(element).addClass('border-danger');

      if ( div_error_messages.length )
      {
        $(div_error_messages).removeClass('d-none');

        if ( messages && messages.length )
        {
          var span_dynamic_message = $(div_error_messages).find('.error-dynamic:first');

          if ( !span_dynamic_message.length )
          {
            $(div_error_messages).append('<div class="error-dynamic"></div>');
            span_dynamic_message = $(div_error_messages).find('.error-dynamic:first');
          }

          $(span_dynamic_message).removeClass('d-none');
          $(span_dynamic_message).html(messages);
        }
      }

      passed = false;
    }
    else
    {
      $(element).removeClass('border-danger');

      if ( div_error_messages.length )
        $(div_error_messages).addClass('d-none');
    }
	});

	return passed;
}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

$.fn.dg_delay = function(delay, callback_function)
{
  var element = this;

  $(element).animate({'opacity':'1'}, delay, function()
  {
    if ( callback_function )
      callback_function();
  });
}
// Allows to reverse an array
$.fn.reverse = [].reverse;

$.strpos = function(haystack, needle, offset)
{
	var i = (haystack+'').indexOf(needle, (offset || 0));
	return i === -1 ? false : i;
}

$.fn.dg_disableEnter = function()
{
	$(this).on('keypress', function(e) {
	    return e.which !== 13;
	});
}

$.dg_substrMatch = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

$.sprintf = function(text, replace)
{
	return text.replace(/%s/g, replace);
}

// Change the url of the page after the domain
$.dg_changeUrl = function(page, url)
{
    if (typeof (history.pushState) != "undefined")
    {
        var obj = { Page: page, Url: url };
        history.pushState(obj, obj.Page, obj.Url);
        return true;
    }

    return false;
}

$.dg_ucwords = function(str)
{
	return (str + '')
    .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
      return $1.toUpperCase();
    });
}

// Format: dd/mm/yyyy
$.dg_dateDiff = function(date1,date2,type)
{
	var date1split = date1.split('/');
	date1 = date1split[1]+'/'+date1split[0]+'/'+date1split[2];

	var date2split = date2.split('/');
	date2 = date2split[1]+'/'+date2split[0]+'/'+date2split[2];

    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (type) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

$.fn.dg_plane = function(options, callback_function)
{
	var event = [];
	event.element = this;
	event.element_size = [];
	event.plane_size = [];
	event.date = new Date();
	event.content = 'empty';
	event.classe = 'bg-secondary';
	event.adaptive_width = true;
	event.offset_top = 0;
	event.offset_left = 0;
  event.oninit_function = null;

	// Customizing options from the user
	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'content': event.content = value; break;
			case 'class': event.class = value; break;
			case 'style': event.style = value; break;
			case 'adaptive-width': event.adaptive_width = value; break;
			case 'position': event.position = value; break;
			case 'offset-top': event.offset_top = value; break;
			case 'offset-left': event.offset_left = value; break;
			case 'request-type': event.request_type = value; break;
			case 'oninit': event.oninit_function = value; break;
		}
	});

	// First check if this element has a plane uniqid
	event.uniqid = $(event.element).attr('plane_uniqid');

	// Get the plane element
	event.plane = $('div[plane_uniqid="plane_'+event.uniqid+'"]');

	if ( event.request_type == 'uniqid' )
		return event.uniqid;

	if ( event.request_type == 'plane' )
		return event.plane;

	// If no uniqid there is no plane so generate one
	if ( !event.uniqid || !event.plane.length )
	{
		// Generate a unique id
		event.uniqid = event.date.valueOf();

		// Assign uniqid on the element you want the plane to appear for uniqueness
		$(event.element).attr({'plane_uniqid':event.uniqid});

		// Generate the plane html structure
		event.html = '<div plane_uniqid="plane_'+event.uniqid+'" class="'+event.class+'" style="position: absolute; top: 0; left: 0; cursor: move; margin: 0px; z-index: 888888; '+event.style+'"></div>';

		// Insert the plane into DOM
		$(event.element).before(event.html);
	}

	// Get the plane element
	event.plane = $('div[plane_uniqid="plane_'+event.uniqid+'"]');

	$(event.plane).html(event.content);

	if ( event.adaptive_width )
		$(event.plane).css({'width':event.element_size.width+'px'});

	// Get the element position (not the plane itself)
	event.element_pos = $(event.element).position();

	// Get element sizes (not the plane itself)
	event.element_size.width = $(event.element).outerWidth();
	event.element_size.height = $(event.element).outerHeight();

	// Get plane sizes
	event.plane_size.width = $(event.plane).outerWidth();
	event.plane_size.height = $(event.plane).outerHeight();

	switch ( event.position )
	{
		default:
		case 'bottom':
		$(event.plane).css({'left':(event.element_pos.left-(event.plane_size.width/2)+(event.element_size.width/2))+'px', 'top':(event.element_pos.top+event.element_size.height)+'px'});
		break;

		case 'bottom-left':
		$(event.plane).css({'left':event.element_pos.left+'px', 'top':(event.element_pos.top+event.element_size.height+event.offset_top)+'px'});
		break;

		case 'top-left':
		$(event.plane).css({'left':event.element_pos.left+'px', 'top':(event.element_pos.top-event.plane_size.height+event.offset_top)+'px'});
		break;

		case 'top':
		$(event.plane).css({'left':(event.element_pos.left-(event.plane_size.width/2)+(event.element_size.width/2))+'px', 'top':(event.element_pos.top-event.plane_size.height)+'px'});
		break;

		case 'right':
		$(event.plane).css({'left':(event.element_pos.left+event.element_size.width)+'px', 'top':(event.element_pos.top-(event.plane_size.height/2)+(event.element_size.height/2))+'px'});
		break;

		case 'left':
		$(event.plane).css({'left':(event.element_pos.left-event.plane_size.width)+'px', 'top':(event.element_pos.top-(event.plane_size.height/2)+(event.element_size.height/2))+'px'});
		break;
	}

	event.plane_pos = $(event.plane).offset();

	// After the plane is initialized, if there is a callback function, call it
	if ( callback_function )
		callback_function(event);

  if ( event.oninit_function )
    event.oninit_function(event);

	return event.plane;
}

$.dg_popup = function(options)
{
  var event = [];
  event.currentDate = new Date();
  event.uniqid = event.currentDate.valueOf();
  event.position = 'right';
  event.content = '';
  event.oninit_function = null;

	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'content': event.content = value; break;
			case 'position': event.position = value; break;
			case 'oninit': event.oninit_function = value; break;
		}
	});

  var html = '<div id="div_popup_uniqid_'+event.uniqid+'" style="display: none;"></div>';

  $('body').prepend(html);

  event.div_popup_uniqid = $('#div_popup_uniqid_'+event.uniqid);

  if ( event.div_popup_uniqid.length )
  {
    event.plane = $(event.div_popup_uniqid).dg_plane({'content':event.content, 'position':event.position, 'class':'bg-secondary pad5 rounded', 'adaptive-width':false, 'style':'box-shadow: 5px 5px 10px #A8A8A8;'});

    if ( event.oninit_function )
      event.oninit_function(event);
  }

  return event;
}

$.fn.dg_floater = function(options)
{
  var event = [];
  event.element = this;
  event.position = 'right';
  event.content = '';
  event.class = 'bg-secondary pad5 rounded';
  event.style = 'box-shadow: 5px 5px 10px #A8A8A8;';
  event.oninit_function = null;

  if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'content': event.content = value; break;
			case 'position': event.position = value; break;
			case 'oninit': event.oninit_function = value; break;
		}
	});

  $(event.element).dg_plane(
  {
    'content':event.content,
    'position':event.position,
    'class':event.class,
    'style':event.style,
    'oninit':function(event_plane)
    {
      event.floater = event_plane.plane;
      event.event_plane = event_plane;

      if ( event.oninit_function )
        event.oninit_function(event);
    }
  });
}

$.dg_notification = function(options)
{
  var message = '';
  var type = 'success';
  var container_classes = 'js-doringui-notifications-container';
  var container_style = '';
  var notification_classes = 'js-doringui-notification js-doringui-notification-';
  var notification_style = '';
  var icon = '<i class="fa fa-info-circle"></i>';
  var title = '';
  var btn_dismiss_text = 'Dismiss';
  var notification_timeout = 5000;
  var do_action = '';
  var return_type = '';
  var group = '';

  if ( !options )
  {
    type = error;
    message = 'Invalid notification! (message missing)';
    return;
  }

  if ( $.type(options) === "object" )
  {
    $.each( options, function(index, value)
    {
      switch ( index )
      {
        case 'message': message = value; break;
        case 'type': type = value; break;
        case 'container-classes': container_classes = value; break;
        case 'container-style': container_style = value; break;
        case 'notification-classes': notification_classes = value; break;
        case 'notification-style': notification_style = value; break;
        case 'icon': icon = value; break;
        case 'title': title = value; break;
        case 'timeout': notification_timeout = value; break;
        case 'do': do_action = value; break;
        case 'return': return_type = value; break;
        case 'group': group = value; break;
      }
    });
  }
  else
    message = options;

  // first, the notification div
  var notification_div = $('#dg_notifications_div');

  if ( return_type == 'count' )
  {
    if ( notification_div.length )
    {
      return $(notification_div).find('.js-doringui-notifications-body:first div[rel]').length;
    }
    else
      return 0;
  }

  if ( do_action == 'dismiss' && notification_div.length )
  {
    $(notification_div).find('.js-doringui-notification-progressbar').stop(1);
    $(notification_div).remove();
    return;
  }

  if ( !notification_div.length )
  {
    var notification_div_html = '<div id="dg_notifications_div" class="'+container_classes+'" style="'+container_style+'">'+
                                    '<div class="js-doringui-notifications-action-btns">'+
                                      '<span id="btn_notifications_dismiss" class="dg-btn dg-btn-'+type+' dg-py-0">'+btn_dismiss_text+'</span>'+
                                    '</div>';

        if ( title.length )
         notification_div_html += '<div class="js-doringui-notifications-header">'+title+'</div>';


         notification_div_html += '<div class="js-doringui-notifications-body"></div>'+
                                '</div>';

    $('body').prepend(notification_div_html);

    notification_div = $('#dg_notifications_div');

    $('#btn_notifications_dismiss').click( function()
    {
      $.dg_notification({'do':'dismiss'});
    });
  }

  // notifications body
  var div_content = $(notification_div).find('.js-doringui-notifications-body:first');

  var num_notifications = $(div_content).find('div[rel]').length;

  if ( group.length )
  {
    var last_notification = $(div_content).find('div[rel="notification"]:last');
    var notification = $(div_content).find('div[group="'+group+'"]:last');
    var notification_progressbar = $(notification).find('.js-doringui-notification-progressbar:first');

    if ( notification.length && $(notification).attr('notificaiton_id') == $(last_notification).attr('notificaiton_id') )
    {
      $(notification_progressbar).before((icon.length ? icon+' ' : '')+message+'<br>');
    }
    else
    {
      var notification_html = '<div class="'+notification_classes+type+'" style="'+notification_style+'" rel="notification" group="'+group+'" notificaiton_id="'+num_notifications+'">'+
                                  (icon.length ? icon+' ' : '')+message+'<br>'+
                                  '<div class="js-doringui-notification-progressbar"></div>'+
                              '</div>';

      $(div_content).append(notification_html);
    }
  }
  else
  {
    var notification_html = '<div class="'+notification_classes+type+'" style="'+notification_style+'" rel="notification" group="gd_notifications_group" notificaiton_id="'+num_notifications+'">'+
                                (icon.length ? icon+' ' : '')+message+'<br>'+
                                '<div class="js-doringui-notification-progressbar"></div>'+
                            '</div>';

    $(div_content).append(notification_html);
  }

  var notification = $(div_content).find('div[rel="notification"]:last');
  var notification_progressbar = $(notification).find('.js-doringui-notification-progressbar:first');

  $(notification_progressbar).stop(1).css({'width':'100%'}).animate({'width':'0'}, notification_timeout, function()
  {
    $(notification).remove();

    var notifications_left = $(div_content).find('div[rel]').length;

    if ( notifications_left == 0 )
      $.dg_notification({'do':'dismiss'});
  });

  $(notification).mouseenter( function()
  {
    $(notification_progressbar).stop(1).css({'width':'100%'}).animate({'width':'0'}, notification_timeout, function()
    {
      $(notification).remove();

      var notifications_left = $(div_content).find('div[rel]').length;

      if ( notifications_left == 0 )
        $.dg_notification({'do':'dismiss'});
    });
  });

  // $(notification_div).click( function()
  // {
  //   console.log( $(div_content).html() );
  // });
}

// Check if two squares overlap
$.fn.dg_overlaps = function(target)
{
  var element = this;

  var element_offset = $(element).offset();
  var element_size = {width:$(element).outerWidth(), height:$(element).outerHeight()};

  var target_offset = $(target).offset();
  var target_size = {width:$(target).outerWidth(), height:$(target).outerHeight()};

  return element_offset.left < target_offset.left + target_size.width &&
         element_offset.left + element_size.width > target_offset.left &&
         element_offset.top < target_offset.top + target_size.height &&
         element_offset.top + element_size.height > target_offset.top;
}

// Checks if a div pops (enters/leaves) the viewport
$.fn.dg_pop = function(options)
{
  var event = [];
	event.elements = this;
  event.scrollAmount = 0;
  event.scrollTop = 0;
  event.oldScrollTop = 0;
  event.oninit_function = null;
  event.onenter_function = null;
  event.onleave_function = null;
  event.onscroll_function = null;
  event.onscrolledtop_function = null;

  if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'oninit': event.oninit_function = value; break;
			case 'onenter': event.onenter_function = value; break;
			case 'onleave': event.onleave_function = value; break;
			case 'onscroll': event.onscroll_function = value; break;
			case 'onscrolledtop': event.onscrolledtop_function = value; break;
		}
	});

  if ( event.oninit_function )
  {
    var scroll_top = $(window).scrollTop();
    event.oldScrollTop = event.scrollTop;
    event.scrollTop = scroll_top;
    var window_height = $(window).height();
    event.windowHeight = window_height;

    $.each(event.elements, function(index_element, element)
    {
      event.element = element;
      event.oninit_function(event);
    });
  }

  $(window).scroll(function()
  {
    var scroll_top = $(window).scrollTop();
    event.oldScrollTop = event.scrollTop;
    event.scrollTop = scroll_top;
    var window_height = $(window).height();
    event.windowHeight = window_height;
    event.scrollAmount = event.scrollTop - event.oldScrollTop;

    $.each(event.elements, function(index_element, element)
  	{
      var element_offset = $(element).offset();
      var element_height = $(element).outerHeight();

      if ( scroll_top+window_height > element_offset.top && scroll_top < element_offset.top + element_height )
      {
        if ( !element.entered )
        {
          element.entered = true;

          if ( event.onenter_function )
          {
            event.element = element;
            event.onenter_function(event);
          }
        }
      }
      else if ( element.entered )
      {
        element.entered = false;

        if ( event.onleave_function )
        {
          event.element = element;
          event.onleave_function(event);
        }
      }

      if ( event.onscroll_function )
      {
        event.element = element;
        event.onscroll_function(event);
      }

      if ( scroll_top == 0 && event.onscrolledtop_function )
      {
        event.element = element;
        event.onscrolledtop_function(event);
      }
    });
  });
}

$.fn.dg_scrollBackground = function(options)
{
  var event = [];
  event.elements = this;
  event.speed = 100;
  event.topoffset = 0.0;
  event.repeat = false;
  event.oninit_function = null;

  if ( options )
  $.each( options, function(index, value)
  {
  	switch ( index )
  	{
  		case 'speed': event.speed = value; break;
  		case 'repeat': event.repeat = value; break;
  		case 'oninit': event.oninit_function = value; break;
  	}
  });

  var speed = 100 / event.speed;

  $(event.elements).each( function()
	{
		var element = this;
		event.element = element;

		event.topoffset = parseFloat($(element).css('backgroundPositionY'));

    // console.log('event.topoffset '+event.topoffset);

    $(element).dg_pop({
        'onscroll': function(pop_event)
        {
          //console.log('pop_event.entered '+pop_event.element.entered);
          if ( pop_event.element.entered )
          {
            event.topoffset += pop_event.scrollAmount / speed;

            if ( !event.repeat )
            {
              if ( event.topoffset < 0 )
                event.topoffset = 0;

              if ( event.topoffset > 100 )
                event.topoffset = 100;
            }

            $(element).css('backgroundPositionY', event.topoffset+'%');
          }
        }
    });

		// Call Function after initialization
    if ( event.oninit_function )
      event.oninit_function(event);
	});
}

$.fn.dg_overlapsLeft = function(target, width)
{
  var element = this;

  var element_offset = $(element).offset();
  var element_size = {width:$(element).outerWidth(), height:$(element).outerHeight()};

  var target_offset = $(target).offset();
  var target_size = {width:$(target).outerWidth(), height:$(target).outerHeight()};

  return element_offset.left < target_offset.left + target_size.width &&
         element_offset.left + width > target_offset.left &&
         element_offset.top < target_offset.top + target_size.height &&
         element_offset.top + element_size.height > target_offset.top;
}

$.fn.dg_hasPoint = function(pointX, pointY)
{
  var element = this;

  var element_offset = $(element).offset();
  var element_size = {width:$(element).outerWidth(), height:$(element).outerHeight()};

  return pointX < element_offset.left + element_size.width && pointX > element_offset.left &&
         pointY < element_offset.top + element_size.height && pointY > element_offset.top;
}

$.fn.dg_drag = function(options)
{
  var event = [];
  event.elements = this;
  event.class = '';
  event.style = '';
  event.postinit_function = null;
  event.oninit_function = null;
  event.ondrag_function = null;
  event.ondrop_function = null;
  event.onenter_function = null;
  event.onleave_function = null;
  event.plane = null;
  event.lock_movement = {x:null,y:null};
  event.receivers = event.elements;
  event.collision_type = 'left';

  if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'postinit': event.postinit_function = value; break;
			case 'oninit': event.oninit_function = value; break;
			case 'ondrag': event.ondrag_function = value; break;
			case 'ondrop': event.ondrop_function = value; break;
			case 'onenter': event.onenter_function = value; break; // dragged element enters receiver
			case 'onleave': event.onleave_function = value; break; // dragged element enters receiver
			case 'receivers': event.receivers = $(value); break;
			case 'lock-x': event.lock_movement.x = value; break;
			case 'lock-y': event.lock_movement.y = value; break;
			case 'collision': event.collision_type = value; break;
		}
	});

  $(event.elements).each( function()
	{
		var element = this;

    $(element).off('dragstart');
    $(element).off('drag');
    $(element).off('dragend');

    $(element).on('dragstart', function(e)
    {
      // e.preventDefault();

      if ( event.postinit_function )
      {
        event.element = element;
        event.postinit_function(event);
      }

      var element_offset= $(element).offset();

      element.mouse_offset = {x:e.pageX - element_offset.left + 2, y:e.pageY - element_offset.top + 2};

      var dragged_content = '<div class=" js-doringui-arrow-corners js-doringui-corner-right-bottom" style="position: absolute; margin-left: -30px; margin-top: -27px;"></div>'+$(element).html();

      event.plane = $(element).dg_plane({'content': dragged_content, 'class':'bg-secondary p-2 rounded', 'adaptive-width':false, 'style':'position:fixed; box-shadow: 10px 10px 60px #afafaf; display: none;'});

      if ( event.oninit_function )
      {
        event.element = element;
        event.oninit_function(event);
      }
    });

    $(element).on('drag', function(e)
    {
      var offset = {x:e.pageX - $(window).scrollLeft() - element.mouse_offset.x, y:e.pageY - $(window).scrollTop() - element.mouse_offset.y};

      if ( !event.lock_movement.x )
        $(event.plane).css({'left':offset.x+'px'});

      if ( !event.lock_movement.y )
        $(event.plane).css({'top':offset.y+'px'});

      if ( !$(event.plane).is(':visible') )
        $(event.plane).fadeIn(200);

      // Test if element hovers a receiver
      $(event.receivers).each( function()
    	{
    		var receiver = this;

        // If receiver is also not the dragged element
        if ( receiver != element )
        {
          var touched = false;

          switch (event.collision_type)
          {
            default:
            case 'left':
            {
              touched = $(event.plane).dg_overlapsLeft(receiver, 5);
              break;
            }

            case 'point':
            {
              var plane_offset = $(event.plane).offset();
              touched = $(receiver).dg_hasPoint(plane_offset.left, plane_offset.top);
              break;
            }

            case 'plane':
            {
              touched = $(event.plane).dg_overlaps(receiver);
              break;
            }
          }

          // If left side of the dragged item is over the receiving item
          if ( touched )
          {
            if ( !receiver.entered )
            {
              receiver.entered = true;

              if ( event.onenter_function )
              {
                event.element = element;
                event.receiver = receiver;
                event.onenter_function(event);
              }
            }
          }
          else
          {
            if ( receiver.entered )
            {
              receiver.entered = false;

              if ( event.onleave_function )
              {
                event.element = element;
                event.receiver = receiver;
                event.onleave_function(event);
              }
            }
          }
        }
      });

      if ( event.ondrag_function )
      {
        event.element = element;
        event.ondrag_function(event);
      }
    });

    // 'ondrop'
    $(element).on('dragend', function(e)
    {
      $(event.plane).remove();

      $(event.receivers).each( function()
    	{
    		var receiver = this;

        if ( receiver.entered == true )
        {
          receiver.entered == false;

          if ( event.onleave_function )
          {
            event.element = element;
            event.receiver = receiver;
            event.onleave_function(event);
          }
        }
      });

      if ( event.ondrop_function )
      {
        event.element = element;
        event.ondrop_function(event);
      }
    });
  });
}

$.fn.dg_clickedOutside = function(options)
{
  var event = [];
  event.elements = this;
  event.onclick_function = null;

  if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'onclick': event.onclick_function = value; break;
		}
	});

  $(document).click(function(e)
  {
    $(event.elements).each( function()
  	{
  		var element = this;
      var clicked_element = e.target;

      // If the target of the click isn't the container
      if( !$(element).is(clicked_element) && $(element).has(clicked_element).length === 0 )
      {
        if ( event.onclick_function )
        {
          event.element = element;
          event.onclick_function(event);
        }
      }
    });
  });
}

// var outside_click_listener_array = [];
//
// $.fn.dg_outsideClick = function(callback_function)
// {
// 	var event = [];
// 	event.element = this;
// 	event.callback_function = callback_function;
//
// 	outside_click_listener_array.push(event);
// }
//
// // This will register clicks on the document and call functions for it
// $(document).click( function(e)
// {
// 	var outside_click_listeners_to_remove = [];
//
// 	// Check for clicks outside the elements specified
// 	$.each(outside_click_listener_array, function(index, object)
// 	{
// 		// First check if element still exists
// 		if ( !object.element.length )
// 		{
// 			if ( !$(e.target).is(object.element) )
// 			{
// 				object.callback_function(object.event);
// 			}
// 		}
// 		else
// 			outside_click_listeners_to_remove.push(index);
// 	});
//
// 	if ( outside_click_listener_array.length )
// 	$.each(outside_click_listener_array, function(index, object)
// 	{
// 		outside_click_listener_array.splice(object, 1);
// 	});
// });

$.fn.dg_increaser = function(options)
{
	var event = [];
	event.elements = this;
	event.min_value = -8888888;
	event.max_value = 8888888;
	event.reset_value = 0;
	event.up_element = '';
	event.down_element = '';
  event.reversed = false;
  event.type = 'int';
	event.onchange_function = null;
  event.old = 0;

	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'min-value': event.min_value = value; break;
			case 'max-value': event.max_value = value; break;
			case 'reset-value': event.reset_value = value; break;
			case 'type': event.type = value; break;
			case 'up-element': event.up_element = value; break;
			case 'down-element': event.down_element = value; break;
			case 'reversed': event.reversed = value; break;
			case 'onchange': event.onchange_function = value; break;
		}
	});

	function validateIncreaser(event, increaser)
	{
    event.old = $(event.element).val();

    if ( event.type == 'float' )
		  event.value = parseFloat($(event.element).val());
    else
		  event.value = parseInt($(event.element).val());

		if ( isNaN(event.value) )
			event.value = event.reset_value;

		event.value += increaser;

		if ( event.value < event.min_value )
			event.value = event.min_value;

		if ( $(event.element).is('[max_value]') )
		{
			var element_max_value = $(event.element).attr('max_value');

			if ( event.value > element_max_value )
				event.value = element_max_value;
		}
		else if ( event.value > event.max_value )
			event.value = event.max_value;

    if ( ! increaser || event.value != event.old )
    {
      $(event.element).val(event.value);

  		if ( event.onchange_function )
  			event.onchange_function(event);
    }
	}

	$(event.elements).each( function()
	{
		var element = this;

		if ( event.up_element.length )
		{
      var next_element = event.reversed ? $(element).prev(event.up_element) : $(element).next(event.up_element);

			$(next_element).click( function()
			{
				event.element = element;
				validateIncreaser(event, 1);
			});
		}

		if ( event.down_element.length )
		{
      var prev_element = event.reversed ? $(element).next(event.up_element) : $(element).prev(event.up_element);

			$(prev_element).click( function()
			{
				event.element = element;
				validateIncreaser(event, -1);
			});
		}

		// Return/Enter key pressed
		$(element).keydown( function(e)
		{
			if ( e.keyCode == 13 )
			{
				event.element = element;
				validateIncreaser(event, 0);
				$(element).blur();
			}
		});

		$(element).change( function()
		{
			event.element = element;
			validateIncreaser(event, 0);
		});
	});
}

$.fn.dg_editer = function(options)
{
	var event = [];
	event.elements = this;
	event.input_type = 'text';
	event.input_class = 'form-control';
	event.input_placeholder = '';
	event.input_value = '';
	event.position = 'top-left';
	event.target = '';
  event.arrow_tip_offset = 25;
	event.update_target = true;
	event.title_class = 'bg-secondary p-2';
  event.close_on_return = true;
	event.onreturn_function = null;
	event.oninit_function = null;

	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'target': event.target = value; break;
			case 'input-type': event.input_type = value; break;
			case 'show-submit': event.show_submit = value; break;
			case 'close-on-return': event.close_on_return = value; break;
			case 'input-class': event.input_class = value; break;
      case 'input-value': event.input_value = value; break;
			case 'input-placeholder': event.input_placeholder = value; break;
			case 'position': event.position = value; break;
			case 'update-target': event.update_target = value; break;
			case 'title': event.title_text = value; break;
			case 'title-class': event.title_class = value; break;
			case 'onreturn': event.onreturn_function = value; break;
			case 'oninit': event.oninit_function = value; break;
		}
	});

	$(event.elements).each( function()
	{
		var element = this;
		$(element).css({'cursor':'pointer'});

		$(element).click( function()
		{
			event.element = element;
      event.element_offset = $(element).offset();
			var target = element;

			// If a specified target is set (jquery text selector like '#div_id')
			if ( event.target.length )
				target = $(element).find(event.target);

			var input_value = $(target).text();

			if ( typeof(event.input_value) != "undefined" && event.input_value !== null )
				input_value = event.input_value;

			if ( !event.input_placeholder.length )
				event.input_placeholder = input_value.length ? input_value : $(target).text();

			// Add top/bottom arrow
			var html = '<div rel="arrow" class=" js-doringui-chevrons js-doringui-chevron-'+(event.position == 'bottom-left' ? 'up' : 'down')+'" style="position: absolute;"></div>';

      // Highlighter
      html += '<div rel="highlighter" class="border border-secondary highlighter rounded" style="position: absolute;"></div>';

      // Title
			if ( event.title_text )
				html += '<div rel="title" class="'+event.title_class+'" style="position: absolute;">'+event.title_text+'</div>';

			// Add the editer input
			html += '<input type="text" class="'+event.input_class+'" placeholder="'+event.input_placeholder+'" value="'+input_value+'">';

      // Lets close the other editers
      $('.dg_editer').remove();

			event.editer = $(element).dg_plane({'content':html, 'position':event.position, 'offset-top':event.position == 'bottom-left' ? 15 : -15, 'class':'bg-dark p-1 rounded dg_editer', 'adaptive-width':false, 'style':'box-shadow: 5px 5px 10px #A8A8A8; width: 200px;'}, function(event_plane)
			{
				event.event_plane = event_plane;
				event.input = $(event.event_plane.plane).find('input:first');
        event.plane_offset = $(event.event_plane.plane).offset();

				// position the plane black arrow
				event.arrow = $(event_plane.plane).find('div[rel="arrow"]:first');

				if ( event.position == 'bottom-left' )
					$(event.arrow).css({'margin-left':'10px', 'margin-top':'-15px'});
				else
					$(event.arrow).css({'margin-left':'10px', 'top':event_plane.plane_size.height+'px'});

        //
        event.plane_arrow_tip_offset = (event_plane.element_size.width/2)-event.arrow_tip_offset;
        $(event.event_plane.plane).css({'margin-left':event.plane_arrow_tip_offset+'px'});

        // Highlighter
        event.highlighter = $(event_plane.plane).find('div[rel="highlighter"]:first');
        $(event.highlighter).css({
                                    'margin-left':(event.element_offset.left-event.plane_offset.left-8-event.plane_arrow_tip_offset)+'px',
                                    'margin-top':(event.element_offset.top-event.plane_offset.top-8)+'px',
                                    'width':(event_plane.element_size.width+8)+'px',
                                    'height':(event_plane.element_size.height+8)+'px'
                                });

        $(event.highlighter).click( function()
        {
          $(event_plane.plane).remove();
        });

        // Title
				if ( event.title_text )
				{
					event.title = $(event_plane.plane).find('div[rel="title"]:first');

					if ( event.position == 'bottom-left' )
						$(event.title).css({'margin-left':'10px', 'margin-top':'-15px'});
					else
						$(event.title).css({'margin-left':-(($(event.title).outerWidth()/2)-(event_plane.plane_size.width/2)+6)+'px', 'top':-($(event.title).outerHeight()+5)+'px'});
				}

				$(event.input).focus();
				$(event.input)[0].setSelectionRange(input_value.length, input_value.length);

				$(event.input).keydown( function(e)
				{
					if ( e.keyCode == 27 )
						$(event_plane.plane).remove();

					// If key Enter/Return pressed
					if ( e.keyCode == 13 )
					{
						var value = $(event.input).val();
						event.value = value;

						if ( event.update_target )
							$(target).text(value);

						if ( event.close_on_return )
						{
							$(event_plane.plane).remove();
						}

						if ( event.onreturn_function )
							event.onreturn_function(event);
					}
				});

				// $(event.input).dg_outsideClick( function(event_click)
				// {
				// 	// $(event_plane.plane).remove();
				// 	alert('click');
				// });

				// Call Function after initialization
        if ( event.oninit_function )
          event.oninit_function(event);
			});
		});
	});
}


// Will produce a random number between vaues
$.dg_rand = function(m,n)
{
	m = parseInt(m);
	n = parseInt(n);

	return Math.floor( Math.random() * (n - m + 1) ) + m;
}

// usage $(element).on('postpaster OR prepaster', function() { do stuff }).pasteEvents();
$.fn.pasteEvents = function( delay )
{
    if (delay == undefined) delay = 20;

    return $(this).each(function()
	{
        var $el = $(this);

        $el.on("paste", function()
		{
            $el.trigger("prepaste");

            setTimeout(function() { $el.trigger("postpaste"); }, delay);
        });
    });
};

// Set parameters for a given url (removes existing ones)
$.dg_setURLParameters = function(url, parameters)
{
	return url.replace(/\?.*$/, "") + "?" + $.param(parameters);
}

// Replaces strings with data values
$.dg_template = function(options)
{
	var event = [];
	event.bpos = 0; // bracket position
	event.item_name = 'data';
	event.item_length = event.item_name.length + 2;

	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'html': event.html = value; break;
			case 'data': event.data = value; break;
			case 'item-name': event.item_name = value; break;
		}
	});

	while (event.bpos != -1)
	{
	    event.bpos = event.html.indexOf("{"+event.item_name+".", event.bpos+1);

	    if ( event.bpos == -1 )
	    	break;

	    event.bpos_end = event.html.indexOf("}", event.bpos+1);
	    var item_name = event.html.substr(event.bpos+event.item_length, event.bpos_end-event.bpos-event.item_length);

	    // alert( event.html+'\n'+'event.bpos:'+event.bpos+'\n'+item_name );

	    var regexp = new RegExp('\\{'+event.item_name+'.'+item_name+'\\}', 'g');
		event.html = event.html.replace(regexp, event.data[item_name]);
	}

	return event.html;
}

$.fn.dg_autocomplete = function(options)
{
	var event = [];
	event.element = this;
	event.html_header = '';
	event.html_footer = '';
	event.item_html = '<div>{data}</div>';
	event.items_html = [];
	event.items_html_active = [];
	event.data = null;
	event.item_counter = 1;
	event.populate_item = 'data';
	event.style = {'box-shadow':'0 10px 10px #8E8D8D', 'border-radius':'5px'};
	event.plane = 0;
	event.plane.length = 0;
	event.position = 'bottom-left';
	event.oninit_function = null;
	event.onchange_function = null;
	event.onrequest_function = null;
	event.onreturn_function = null;
	event.onresponse_function = null;
	event.onfocus_function = null;
	event.onblur_function = null;
	event.onselect_function = null;

	if ( options )
	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case 'remote': event.remote = value; break;
			case 'item-html': event.item_html = value; break;
			case 'item-html-active': event.item_html_active = value; break;
			case 'html-header': event.html_header = value; break;
			case 'html-footer': event.html_footer = value; break;
			case 'populate-item': event.populate_item = value; break;
			case 'html-empty': event.html_empty = value; break;
			case 'style': event.style = value; break;
			case 'position': event.position = value; break;
			case 'oninit': event.oninit_function = value; break;
			case 'onchange': event.onchange_function = value; break;
			case 'onrequest': event.onrequest_function = value; break;
			case 'onreturn': event.onreturn_function = value; break;
			case 'onresponse': event.onresponse_function = value; break;
			case 'onfocus': event.onfocus_function = value; break;
			case 'onblur': event.onblur_function = value; break;
			case 'onselect': event.onselect_function = value; break;
		}
	});

  event.selectElement = function(event, item_number)
  {
    if ( event.items_html.length )
    {
      event.items_html = [];
      event.items_html_active = [];
      event.data = event.datas[item_number];

      event.data.length = 1;

      event.active_value = event.data[event.populate_item];

      $(event.element).val( event.active_value );
      $(event.element)[0].setSelectionRange(event.active_value.length, event.active_value.length);
    }
    else
    {
      event.data = 0;
      event.data.length = 0;
    }

    if ( event.onreturn_function )
      event.onreturn_function(event);

    $(event.plane).remove();
    event.plane = 0;
    event.plane.length = 0;
  }

	// $(event.element).blur( function()
	// {
	// 	if ( event.plane.length )
	// 	{
	// 		if ( event.items_html.length )
	// 		{
	// 			event.items_html = [];
	// 			event.items_html_active = [];
	// 		}
  //
  //     if ( event.onblur_function )
  //       event.onblur_function(event);
  //
	// 		$(event.plane).remove();
	// 		event.plane = 0;
	// 		event.plane.length = 0;
	// 	}
	// });

	$(event.element).keyup( function(e)
	{
		// Press return/enter key
		if ( e.keyCode == 13 )
		{
      event.selectElement(event, event.item_counter-1);
		}
    // Up and Down arrows
		else if ( (e.keyCode == 38 || e.keyCode == 40) && event.items_html.length )
		{
			if ( e.keyCode == 38 )
				event.item_counter -= 1;
			else
				event.item_counter += 1;

			if ( event.item_counter < 1 )
				event.item_counter = 1;
			if ( event.item_counter > event.items_html.length )
				event.item_counter = event.items_html.length;

			event.html = event.html_header;

			$.each(event.items_html, function(i, item)
			{
				event.html += i == event.item_counter-1 ? event.items_html_active[i] : event.items_html[i];
			});

			event.plane = $(event.element).dg_plane({'position':event.position, 'content':event.html});
			$(event.plane).css(event.style);
			event.html += event.html_footer;

      // Add listeners to the items
      $.each($(event.plane).find('[rel="item"]'), function(ind, elm)
      {
        $(elm).click(function()
        {
          var item_number = $(elm).attr('ac_item_number');
          event.selectElement(event, item_number);
        });
      });

			event.data = event.datas[event.item_counter-1]; // Data of the chosen item
			event.active_value = event.datas[event.item_counter-1][event.populate_item];
			$(event.element).val( event.active_value );
			$(event.element)[0].setSelectionRange(event.active_value.length, event.active_value.length);

      if ( event.onselect_function )
        event.onselect_function(event);
		}
		// For every key pressed (if it's not left and right arrows) update the dropdown
		else if ( event.keyCode != 37 || event.keyCode != 39 )
		{
			event.updated = $(event.element).val() != event.searched;
			event.searched = $(event.element).val();
			event.active_value = event.searched;

      if ( event.onchange_function )
        event.onchange_function(event);

			if ( !event.searched.length )
			{
				event.items_html = [];
				event.items_html_active = [];
				$(event.plane).remove();
				event.plane = 0;
				event.plane.length = 0;
			}
			else if ( event.updated && event.remote.length )
			{
				event.remote = $.dg_setURLParameters(event.remote, {'query':event.searched});
				event.item_counter = 1;

				$.get(event.remote, function(data)
				{
					if ( data.length )
					{
						event.datas = data.reverse();

						event.items_html = [];
						event.items_html_active = [];

						event.html = event.html_header;

						// For each data add an item to the dropdown
						$.each(data, function(i, data_item)
						{
							var item_html = $.dg_template({'html':event.item_html, 'data':data_item});
							var item_html_active = $.dg_template({'html':event.item_html_active, 'data':data_item});

              // create element and set string as it's content
              var $div_item_html = $('<div>').html(item_html);

              if ( !$div_item_html.find('[rel="item"]').length )
              {
                var tmp_item = $div_item_html.find('div:first, span:first');

                $(tmp_item).attr('rel', 'item');
                $(tmp_item).attr('ac_item_number', i);

                item_html = $div_item_html.html();
              }

              var $div_item_html_active = $('<div>').html(item_html_active);

              if ( !$div_item_html_active.find('[rel="item"]').length )
              {
                var tmp_item = $div_item_html_active.find('div:first, span:first');

                $(tmp_item).attr('rel', 'item');
                $(tmp_item).attr('ac_item_number', i);

                item_html_active = $div_item_html_active.html();
              }

              var html_item_final = item_html;

							// First item is selected
							if ( i == 0 )
							{
								event.data = event.datas[0];
								html_item_final = item_html_active;
							}

              event.html += html_item_final;

							event.items_html.push(item_html);
							event.items_html_active.push(item_html_active);
						});

						event.html += event.html_footer;

						event.plane = $(event.element).dg_plane({'position':event.position, 'content':event.html});
						$(event.plane).css(event.style);

            // Add listeners to the items
            $.each($(event.plane).find('[rel="item"]'), function(ind, elm)
            {
              $(elm).click(function()
              {
                var item_number = $(elm).attr('ac_item_number');
                event.selectElement(event, item_number);
              });
            });

            if ( event.onresponse_function )
              event.onresponse_function(event);
					}
					else
					{
						event.items_html = [];
						event.items_html_active = [];
						event.plane = $(event.element).dg_plane({'position':event.position, 'content':event.html_empty});
						$(event.plane).css(event.style);
					}
				});
			}
		}
	});

	return event;
}

// Will add a string limit on any textarea or input text box and shows the current number of chars and the max allowed on the right corner
$.fn.dg_limit = function(options, callback_function)
{
	var element = this;

	var currentDate = new Date();
	var uniqid = currentDate.valueOf();

	var max_length = 255;
	var hide_counter = 0;

	var box_length = 0;

	$.each( options, function(index, value)
	{
		switch ( index )
		{
			case "limit": max_length = value; break;
			case "hide_counter": hide_counter = value; break;
		}
	});

	$(element).focus( function()
	{
		box_length = $(element).val().length;

		if ( box_length > max_length )
		{
			box_length = max_length;
			$(element).val( $(element).val().substr(0,max_length) );
		}

		if (!hide_counter)
		{
			$(element).before("<div class='bg-secondary js-doringui-limit' style='border-radius: 4px; padding: 0px; padding-left: 3px; padding-right: 3px; line-height: 12px;' id='dg_limit_counter_"+uniqid+"'>"+box_length+"/"+max_length+"</div>");

			var $counter = $(element).prev("div[id=dg_limit_counter_"+uniqid+"]");

			$counter.css({'margin-left': ($(element).outerWidth()-$counter.outerWidth()-5)+'px'}).fadeIn('fast');
		}

		$(element).keyup( function()
		{
			box_length = $(element).val().length;

			if ( box_length > max_length )
			{
				box_length = max_length;
				$(element).val( $(element).val().substr(0,max_length) );
			}

			if (!hide_counter)
				$counter.text(box_length+"/"+max_length);

			if ( callback_function )
				if ( typeof callback_function == 'function')
					callback_function( element, box_length );
		});
	});

	$(element).change( function()
	{
		if ( box_length > max_length )
		{
			box_length = max_length;
			$(element).val( $(element).val().substr(0,max_length) );
		}

		if ( callback_function )
			if ( typeof callback_function == 'function')
				callback_function( element, box_length );
	});

	$(element).blur( function()
	{
		if ( box_length > max_length )
		{
			box_length = max_length;
			$(element).val( $(element).val().substr(0,max_length) );
		}

		$(element).prev("div[id=dg_limit_counter_"+uniqid+"]").remove();

		if ( callback_function )
			if ( typeof callback_function == 'function')
				callback_function( element, box_length );
	});

	return element;
}

var dg_diacritics_map = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
];

// Returns the age of a person based on birthday and today date
$.fn.dg_age = function()
{
	var element = this;

	if ( $(element).dg_match({'type':'date'}) )
	{
		var today = new Date();
		var birthday = new Date( element.val() );

		return Math.floor(Math.ceil(today - birthday) / (1000 * 60 * 60 * 24 * 365));
	}

	return 0;
}

$.dg_repairLink = function(options)
{
	var value = '';
	var tolower = 0;
  var replace_with = '-';
  var remove_last_replace = false;

	if ( options )
	$.each( options, function(index, option_value)
	{
		switch ( index )
		{
			case "value": value = option_value; break;
			case "to-lower": tolower = option_value; break;
			case "replace-with": replace_with = option_value; break;
			case "remove-last-replace": remove_last_replace = option_value; break;
		}
	});

	if ( value )
	{
		var diacritics_map = dg_diacritics_map;

		for (var i=0; i < diacritics_map.length; i++)
		{
			value = value.replace(diacritics_map[i].letters, diacritics_map[i].base).replace(/[^a-zA-Z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÐÒÓÔÕÖÙÚÛÜÝŸàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]/g, replace_with).replace(replace_with+replace_with, replace_with);
		}

		if ( tolower )
			value = value.toLowerCase();

    if ( value.substr(0, 1) == replace_with )
      value = value.substr(1, value.length);

    if ( remove_last_replace && value.substr(value.length-1) == replace_with )
      value = value.substr(0, value.length-1);
	}

	return value;
}

$.fn.dg_val = function(options)
{
	var value = $(this).val();

	$.each( options, function(index, option_value)
	{
		switch ( index )
		{
			case "line-break":
			{
				value = value.replace( /\n+/g, option_value );
				break;
			}
		}
	});

	return value;
}

// We get string as : variable1=value1|variable2=value2
$.dg_values = function( haystack, var_name, var_value )
{
	var new_value = '';
	var found = 0;

	if ( haystack != 'undefined' && haystack != null )
	if ( haystack.length )
	{
		// We obtain array with variable=value
		var var_array = haystack.split( '|' );

		if ( $.isArray(var_array) )
		{
			$.each( var_array, function ( i, val )
			{
				var array_val = val.split('=');

				if ( array_val[0] == var_name )
				{
					new_value += var_name+'='+var_value+'|';

					found = 1;
				}
				else if ( array_val[1].length )
					new_value += array_val[0]+'='+array_val[1]+'|';
			});

			new_value = new_value.substr( 0, new_value.length-1 );
		}
	}

	if ( !found )
		new_value += ( new_value ? '|' : '' )+var_name+'='+var_value;

	return new_value;
}

$.fn.dg_radio = function(options)
{
  var event = [];
  event.radios = this;
  event.onchange_function = null;
	event.color = '#0582FF';
	event.color_off = '#A0A0A0';

  if ( options )
	$.each(options, function(index, value)
	{
		switch ( index )
		{
			case "color": event.color = value; break;
			case "color-off": event.color_off = value; break;
			case "onchange": event.onchange_function = value; break;
		}
	});

  event.updateRadioVisual = function(event)
  {
    event.state = $(event.element).is(':checked') ? true : false;

    if ( event.state )
    {
      $(event.div_radiobox).css({'background-color':event.color});
      $(event.div_checked_sign).fadeIn(600);
    }
    else
    {
      $(event.div_radiobox).css({'background-color':event.color_off});
      $(event.div_checked_sign).fadeOut(200);
    }
  }

  event.updateAllVisuals = function()
  {
    $(event.radios).each( function()
  	{
      event.element = this;
      event.div_radiobox = $(event.element).next('div[rel=dg_radiobox]:first');
  		event.div_checked_sign = $(event.div_radiobox).find('div.js-doringui-checked-sign:first');

      event.updateRadioVisual(event);
    });
  }

  $(event.radios).change( function()
  {
    event.updateAllVisuals();

    event.element = this;

    // Call function onchange if another radio is selected
    if ( event.onchange_function )
    {
      event.state = true;
      event.onchange_function(event);
    }
  });

  // Checkboxes
	$(event.radios).each( function()
	{
    var element = this;

    event.div_radiobox = $(element).next('div[rel="dg_radiobox"]:first');

    $(element).css({'display':'none'});

  	if ( event.div_radiobox.length )
  		event.div_radiobox.remove();

    event.html = '<div rel="dg_radiobox" class="js-doringui js-doringui-radiobox">'+
                    '<div class="js-doringui-radiobox-checked">'+
  							       '<div class=" js-doringui-checked-sign"></div>'+
                    '</div>'+
	                '</div>';

		$(element).after(event.html);

    event.div_radiobox = $(element).next('div[rel=dg_radiobox]:first');
		event.div_checked_sign = $(event.div_radiobox).find('div.js-doringui-checked-sign:first');

    event.element = element;
    event.updateRadioVisual(event);

    $(event.div_radiobox).click( function()
    {
      var element = $(this).prev('input:first');

      if ( !$(element).is(':checked') )
      {
        $(element).prop('checked', true);
        $(element).change();
      }
    });
  });
}

// Will transform the checkboxes in a nice slide (on/off)
$.fn.dg_checkbox = function(options)
{
	var event = [];
	event.color = '#0582FF';
	event.color_off = '#A0A0A0';
	event.onchange_function = null;
  event.disableClick = false;

	if ( options )
	$.each(options, function(index, value)
	{
		switch ( index )
		{
			case "color": event.color = value; break;
			case "color-off": event.color_off = value; break;
			case "onchange": event.onchange_function = value; break;
			case "disable-click": event.disableClick = value; break;
		}
	});

	// Checkboxes
	$(this).each( function()
	{
		var element = this;
		event.element = element;

		$(element).css({'display':'none'});

		var div_checkbox = $(element).next('div[rel=dg_checkbox]');

		if ( div_checkbox.length )
			div_checkbox.remove();

		var html = '<div rel="dg_checkbox" class="js-doringui js-doringui-checkbox">'+
    						'<div class=" js-doringui-checked-sign js-doringui-checkbox-checked-sign"></div>'+
    						'<div class="js-doringui-checkbox-switcher"></div>'+
    					'</div>';

		$(element).after(html);

		div_checkbox = $(element).next('div[rel=dg_checkbox]:first');
		var div_switch = $(div_checkbox).find('div.js-doringui-checkbox-switcher:first');
		var div_checked_sign = $(div_checkbox).find('div.js-doringui-checked-sign:first');

		event.state = $(element).is(':checked') ? 1 : 0;

		if ( event.state )
		{
			$(div_switch).animate({'margin-left':22}, 90);
			$(div_checkbox).css({'background-color':event.color});
			$(div_checked_sign).fadeIn(550);
		}
		else
		{
			$(div_switch).animate({'margin-left':1}, 90);
			$(div_checkbox).css({'background-color':event.color_off});
			$(div_checked_sign).fadeOut(90);
		}

    if ( !event.disableClick )
		$(div_checkbox).click( function()
		{
			$(element).click();
		});

		$(element).change( function()
		{
			event.element = element;
			event.state = $(element).is(':checked')?1:0;
			event.div_checkbox = div_checkbox;
			event.div_switch = div_switch;
			event.div_checked_sign = div_checked_sign;

			if ( event.state )
			{
				$(div_switch).animate({'margin-left':22}, 90);
				$(div_checkbox).css({'background-color':event.color});
				$(div_checked_sign).fadeIn(550);
			}
			else
			{
				$(div_switch).animate({'margin-left':1}, 90);
				$(div_checkbox).css({'background-color':event.color_off});
				$(div_checked_sign).fadeOut(90);
			}

			if ( event.onchange_function )
				event.onchange_function(event);

		});
	});
}
})(jQuery);
