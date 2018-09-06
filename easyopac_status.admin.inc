<?php
/**
 * @file
 * Administration config form.
 */

/**
 * @param array $form
 *   Form elements in renderable array.
 * @param array $form_state
 *   Status of the form elements.
 *
 * @return mixed
 *   Renderable array with all the form elements.
 */
function easyopac_status_admin_settings_form($form, &$form_state) {
  global $base_url;
  $configs = variable_get('easyopac_status', []);
  $form['#tree'] = TRUE;

  $form['easyopac_status']['admin'] = [
    '#type' => 'fieldset',
    '#title' => t('Admin configs'),
    '#collapsible' => !empty($configs['admin']) ? !empty(array_filter($configs['admin'])) : FALSE,
    '#collapsed' => TRUE,
  ];
  $form['easyopac_status']['admin']['url'] = [
    '#type' => 'textfield',
    '#title' => t('API url'),
    '#default_value' => !empty($configs['admin']['url']) ? $configs['admin']['url'] : 'statuspage.io/api/v2/status.json',
    '#attributes' => [
      'placeholder' => t('statuspage.io/api/v2/status.json'),
    ],
    '#required' => TRUE,
  ];
  $form['easyopac_status']['admin']['page'] = [
    '#type' => 'textfield',
    '#title' => t('Page ID'),
    '#default_value' => !empty($configs['admin']['page']) ? $configs['admin']['page'] : 'mzgxvjlqnlzh',
    '#required' => TRUE,
  ];
  $form['easyopac_status']['admin']['key'] = [
    '#type' => 'textfield',
    '#title' => t('User API Key'),
    '#default_value' => !empty($configs['admin']['key']) ? $configs['admin']['key'] : '',
    '#attributes' => [
      'placeholder' => t('fd68825f-da80-4cbb-90bf-cd31277dd593'),
    ],
  ];

  $form['easyopac_status']['settings'] = [
    '#type' => 'fieldset',
    '#title' => t('Status bar'),
    '#collapsible' => FALSE,
  ];
  $form['easyopac_status']['settings']['active'] = [
    '#type' => 'checkbox',
    '#title' => t('Enable automatic status update.'),
    '#default_value' =>!empty($configs['settings']['active']) ? $configs['settings']['active'] : 0,
  ];
  $form['easyopac_status']['settings']['show_text'] = [
    '#type' => 'checkbox',
    '#title' => t('Custom text (Will also be shown together with the automatic updates - if any)'),
    '#default_value' => !empty($configs['settings']['show_text']) ? $configs['settings']['show_text'] : 0,
  ];
  $form['easyopac_status']['settings']['text'] = [
    '#type' => 'textfield',
    '#default_value' => !empty($configs['settings']['text']) ? $configs['settings']['text'] : '',
    '#attributes' => [
      'placeholder' => t('Something is wrong with the library system.'),
    ],
  ];
  $form['easyopac_status']['settings']['link_page'] = [
    '#type' => 'checkbox',
    '#title' => t('Link to page'),
    '#default_value' => !empty($configs['settings']['link_page']) ? $configs['settings']['link_page'] : 0,
  ];
  $form['easyopac_status']['settings']['link'] = [
    '#type' => 'textfield',
    '#default_value' => !empty($configs['settings']['link']) ? $configs['settings']['link'] : '',
    '#attributes' => [
      'placeholder' => t('@url/example', ['@url' => $base_url]),
    ],
  ];
  $form['easyopac_status']['settings']['background_color'] = [
    '#type' => 'textfield',
    '#title' => t('Background color'),
    '#default_value' => !empty($configs['settings']['background_color']) ? $configs['settings']['background_color'] : '#fff',
    '#maxlength' => 8,
    '#size' => 8,
    '#suffix' => '<div class="easyddb-status-colorpicker easyddb-status-background-colorpicker"></div>',
    '#attributes' => [
      'class' => ['easyddb-status-background-color'],
      'data-type' => ['background'],
    ],
    '#attached' => [
      'library' => [
        ['system', 'farbtastic'],
      ],
    ],
  ];
  $form['easyopac_status']['settings']['text_color'] = [
    '#type' => 'textfield',
    '#title' => t('Text color'),
    '#default_value' => !empty($configs['settings']['text_color']) ? $configs['settings']['text_color'] : '#000',
    '#maxlength' => 8,
    '#size' => 8,
    '#suffix' => '<div class="easyddb-status-colorpicker easyddb-status-text-colorpicker"></div>',
    '#attributes' => [
      'class' => ['easyddb-status-text-color'],
      'data-type' => ['text'],
    ],
  ];

  return system_settings_form($form);
}
