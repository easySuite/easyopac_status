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

        if (Drupal.settings.easyopac_status.settings.overrides) {
          $(this)
            .css('background-color', Drupal.settings.easyopac_status.settings.background_color)
            .find('.message').css('color', Drupal.settings.easyopac_status.settings.text_color);
        }

        // Hide bar on close icon click.
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
      url: '/easyopac_status/status',
      success: function (response) {
        let indicator = response.status.indicator;
        let $wrapper = $('#easyddb-status-wrapper');
        if (indicator !== 'none') {
          $wrapper.removeClass('hidden');

          // Update status bar content.
          if (indicator !== Drupal.settings.easyopac_status_display.indicator) {
            Drupal.settings.easyopac_status_display.indicator = indicator;

            let message = Drupal.t(response.status.description);
            if (Drupal.settings.easyopac_status.settings.overrides) {
              // Add overrides text.
              if (Drupal.settings.easyopac_status.settings.text) {
                message = Drupal.settings.easyopac_status.settings.text;
              }

              // Link to page.
              if (Drupal.settings.easyopac_status.settings.link_page && Drupal.settings.easyopac_status.settings.link) {
                message = '<a href="' + Drupal.settings.easyopac_status.settings.link + '">' + message + '</a>';

                // Add color style to the link.
                if (Drupal.settings.easyopac_status.settings.text_color) {
                  message = $(message).css('color', Drupal.settings.easyopac_status.settings.text_color);
                }
              }
            }

            $wrapper.find('.message').html(message);
          }
        }
        else {
          $wrapper.addClass('hidden');
        }

        $wrapper.find('.easyddb-status-inner').attr('class', 'easyddb-status-inner').addClass(indicator);
        setTimeout(callStatusService, 30000);
      }
    });
  }
})(jQuery);
