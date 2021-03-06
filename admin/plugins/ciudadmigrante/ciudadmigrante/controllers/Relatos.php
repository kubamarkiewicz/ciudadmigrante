<?php namespace CiudadMigrante\CiudadMigrante\Controllers;

use Backend\Classes\Controller;
use BackendMenu;

class Relatos extends Controller
{
    public $implement = [
        'Backend\Behaviors\ListController','Backend\Behaviors\FormController','Backend\Behaviors\ReorderController'    ];
    
    public $listConfig = 'config_list.yaml';
    public $formConfig = 'config_form.yaml';
    public $reorderConfig = 'config_reorder.yaml';

    public function __construct()
    {
        parent::__construct();
        BackendMenu::setContext('CiudadMigrante.CiudadMigrante', 'main-menu-item', 'side-menu-item3');
    }


    public function formExtendFields($form)
    {
        if ($form->getField('latlng')->value) {
            list($lat, $lng) = explode(',', $form->getField('latlng')->value);
            $form->getField('latlng')->value = '{"lat":'.$lat.',"lng":'.$lng.'}';
        }
    }
}
