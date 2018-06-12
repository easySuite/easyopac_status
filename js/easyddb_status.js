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

  Drupal.behaviors.easyddb_status_colors = {
    attach: function(context) {
      $('.easyddb-status-background-color, .easyddb-status-text-color', context).each(function (index, textfield) {
        $(textfield).css('background-color', $(textfield).val());
        $(textfield).css('color', 'white');
      });

      $('.easyddb-status-background-color, .easyddb-status-text-color', context).on('focus', function() {
        let edit_field = this;
        let type = $(edit_field).data('type');
        let picker = $(edit_field).closest('div').parent().find(`.easyddb-status-${type}-colorpicker`);

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

  Drupal.behaviors.easyddb_status_popup = {
    attach: function (context) {
      $('#easyddb-status-wrapper', context).once('status-message', function () {
        let status = Drupal.settings.easyddb_status;
        let display = Drupal.settings.easyddb_status_display;
        if (status.length === 0 || !status.settings.active ||
            display.length === 0 || !display.status) {
          return;
        }

        callStatusService();
        $(this)
          .css('background-color', Drupal.settings.easyddb_status.settings.background_color)
          .toggleClass('hidden')
          .find('.message').css('color', Drupal.settings.easyddb_status.settings.text_color)
          .find('a').css('color', Drupal.settings.easyddb_status.settings.text_color);

        // Hide bar on close click.
        $(this).find('.close-button').on('click', function () {
          $('#easyddb-status-wrapper').toggleClass('hidden');
          $.ajax({
            url: '/easyddb_status/close',
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
      url: `https://${Drupal.settings.easyddb_status.admin.page}.${Drupal.settings.easyddb_status.admin.url}`,
      success: function (response) {
        let indicator = Drupal.settings.easyddb_status_display.indicator;

        if (!indicator && response.status.indicator !== indicator && message === '') {
          message = Drupal.t(response.status.description);

          if (Drupal.settings.easyddb_status.settings.show_text && Drupal.settings.easyddb_status.settings.text) {
            message += `<p>${Drupal.settings.easyddb_status.settings.text}</p>`;
          }

          // Link to page.
          if (Drupal.settings.easyddb_status.settings.link_page && Drupal.settings.easyddb_status.settings.link) {
            message = `<a href="${Drupal.settings.easyddb_status.settings.link}" style="color: ${Drupal.settings.easyddb_status.settings.text_color}">${message}
          </a>`;
          }
          $('#easyddb-status-wrapper').find('.message').html(message);
        }

        setTimeout(callStatusService, 5000);
      }
    });
  }
})(jQuery);
