/**
 * @file
 * JS behaviours.
 */

/**
 * Provide a farbtastic colorpicker for color widgets.
 */
(function ($) {
  'use strict';

  let message = '';

  Drupal.behaviors.easyopac_status_colors = {
    attach: function(context) {
      $('.easyddb-status-background-color, .easyddb-status-text-color', context).each(function (index, textfield) {
        $(textfield).css('background-color', $(textfield).val());
        $(textfield).css('color', 'white');
      });

      $('.easyddb-status-background-color, .easyddb-status-text-color', context).on('focus', function() {
        let edit_field = this;
        let type = $(edit_field).data('type');
        let picker = $(edit_field).closest('div').parent().find('.easyddb-status-' + type + '-colorpicker');

        // Hide all color pickers except this one.
        $(".easyddb-status-colorpicker").hide();
        $(picker).show();
        $.farbtastic(picker, function(color) {
          edit_field.value = color;

          $(edit_field).css('background-color', color);
          $(edit_field).css('color', this.RGBToHSL(this.unpack(color))[2] > 0.5 ? '#000' : '#fff');
        }).setColor(edit_field.value);
      });
    }
  };

  Drupal.behaviors.easyopac_status_popup = {
    attach: function (context) {
      $('#easyddb-status-wrapper', context).once('status-message', function () {
        let status = Drupal.settings.easyopac_status;
        let display = Drupal.settings.easyopac_status_display;
        if (status.length === 0 || !status.settings.active ||
            display.length === 0 || !display.status) {
          return;
        }

        callStatusService();
        $(this)
          .css('background-color', Drupal.settings.easyopac_status.settings.background_color)
          .toggleClass('hidden')
          // .find('.message').css('color', Drupal.settings.easyopac_status.settings.text_color)
          .find('a').css('color', Drupal.settings.easyopac_status.settings.text_color);

        // Hide bar on close click.
        $(this).find('.close-button').on('click', function () {
          $('#easyddb-status-wrapper').toggleClass('hidden');
          $.ajax({
            url: '/easyopac_status/close',
          });
        });
      });
    }
  };

  /**
   * Make periodically ajax request to the status service and populate DOM.
   */
  function callStatusService() {
    $.ajax({
      url: 'easyopac_status/status',
      success: function (response) {
        let indicator = Drupal.settings.easyopac_status_display.indicator;
        // debugger;
        if (!indicator && response.status.indicator !== indicator && message === '') {
          message = Drupal.t(response.status.description);

          if (Drupal.settings.easyopac_status.settings.show_text && Drupal.settings.easyopac_status.settings.text) {
            message += '<p>Drupal.settings.easyopac_status.settings.text</p>';
          }

          // Link to page.
          if (Drupal.settings.easyopac_status.settings.link_page && Drupal.settings.easyopac_status.settings.link) {
            message = '<a href="' + Drupal.settings.easyopac_status.settings.link + '">' + message + '</a>';
          }
          let $wrapper = $('#easyddb-status-wrapper');
          $wrapper.find('.message').html(message);
          $wrapper.find('.easyddb-status-inner').addClass(response.status.indicator);
        }
        setTimeout(callStatusService, 30000);
      }
    });
  }
})(jQuery);
