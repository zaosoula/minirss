$(document).ready(function() {

  var data = JSON.parse(localStorage.getItem('minirss'));
  console.log(data);
  if (data == undefined) {
    feed_setup()
  } else {
    feed_sync(data);
  }


  $('.iconlink.fa-cog').click(function() {
    feed_setup();
  });
  $('.iconlink.fa-refresh').click(function() {
    feed_sync(data);
  });

});

function feed_setup() {
  $('.iconlink.fa-cog,.iconlink.fa-refresh,.feed-container').hide();
  $('.feed-setup').removeClass('hide');
  $('.feed-setup .addlink').click(function(e) {
    e.preventDefault();
    $(this).before($('.feed-setup .feed-input:last').parent().clone().removeClass('has-error').find('input').val("").parent());
    $('.feed-input-container').sortable({
      items: '.form-group',
      handle: '.drag-icon'
    });
  });
  var datatmp = [];
  var data = JSON.parse(localStorage.getItem('minirss'));
  console.log(data);
  if (data != undefined) {
    $.each(data, function(i, item) {
      $('.feed-setup .feed-input:last').parent().before($('.feed-setup .feed-input:last').parent().clone().removeClass('has-error').find('input').val(item.url).parent());
      $('.feed-input-container').sortable({
        items: '.form-group',
        handle: '.drag-icon'
      })
    });
  }

  $('.feed-setup .validlink').click(function() {

    var validLink = $(this);
    if (validLink.data('checked')) {
      localStorage.setItem("minirss", JSON.stringify(datatmp));
      setTimeout(function() {
        window.location.reload();
      }, 500);
    } else {
      datatmp = [];
      $('.feed-setup .feed-input').each(function(i, item) {
        $(this).parent().find('.feed-input-status').remove();

        var regexUrl = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

        if (regexUrl.test($(this).val())) {
          $(this).after('<i class="feed-input-status fa fa-refresh fa-spin"></i>').parent().removeClass('has-error');
          console.log(i, 'GET FEED', datatmp);
          var currentElement = $(this);
          getFeed($(this).val(), function(data) {

            if (data.rss != undefined) {

              datatmp.push({
                url: currentElement.val(),
                order: i + 1
              });
              currentElement.data('added', true);
              currentElement.parent().find('.feed-input-status').removeClass('fa-refresh fa-spin').addClass('fa-check');
              currentElement.parent().addClass('has-success');

              var canNext = true;

              $('.feed-setup .feed-input').each(function(i, item) {
                if (!$(this).data('added') && canNext) {
                  canNext = false;
                }
              });

              if (canNext) {
                validLink.data('checked', true).click();
              }

              console.log('DATA3', datatmp);
            } else {
              console.log('NO RESSS');
              currentElement.parent().find('.feed-input-status').removeClass('fa-refresh fa-spin').addClass('fa-times');
              currentElement.parent().addClass('has-error');
            }
          });
        } else if ($(this).val() == "") {
          console.log('empty');
          $(this).parent().remove();
        } else {
          console.log($(this).val('no regex'));
          $(this).parent().addClass('has-error');
          $(this).parent().find('.feed-input-status').removeClass('fa-refresh fa-spin').addClass('fa-times');

        }

      });
    }

  });
}

function feed_sync(data) {
  var rssCount = data.length;
  $('.iconlink.fa-refresh').addClass('fa-spin');
  $.each(data, function(i, item) {
    getFeed(item.url, function(data) {
      channel = data.rss.channel;
      items = data.rss.channel.item;
      feedDom = $('.feed-sample').find('.feed-col').clone().attr('style', 'order:' + item.order);
      if (channel.image.url != "")
        feedDom.find('.feed-header').html('<div class="col-md-12"><img src="' + channel.image.url + '" alt="' + channel.image.title + '" style="width:80px;"></div>');

      feedDom.find('.feed-header').append(' <div class="col-md-12"><h1>' + channel.title + '</h1><h3 class="feed-description">' + channel.description + '</h3></div>');

      $.each(items, function(i, item) {
        if (i < 10) {
          feedDom.find('.feed-items').append('<li><h2><a href="' + item.link + '" title="' + item.title + '" target="_blank">' + item.title + '</a></h2><p>Acer vient de lever le voile sur son Predator X27, un moniteur nouvelle génération dédié aux joueurs.&nbsp;[Lire la suite]</p></li>');
        }
      });
      $('.feed-container').prepend(feedDom);
      if (i + 1 == rssCount) {
        $('.iconlink.fa-refresh').removeClass('fa-spin');
      }
    })
  })
}

function getFeed(url, callback) {
  $.ajax({
    url: 'request/get.php',
    method: 'POST',
    data: {
      u: url
    },
    dataType: 'xml',
    success: function(data) {
      callback($.xml2json(data)['#document']);
    },
    error: function() {
      callback({});
    }
  });
}
