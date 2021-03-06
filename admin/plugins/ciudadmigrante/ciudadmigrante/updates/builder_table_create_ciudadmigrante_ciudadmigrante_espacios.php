<?php namespace CiudadMigrante\CiudadMigrante\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateCiudadmigranteCiudadmigranteEspacios extends Migration
{
    public function up()
    {
        Schema::create('ciudadmigrante_ciudadmigrante_espacios', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 255);
            $table->integer('sort_order');
            $table->boolean('publicado');
            $table->text('descripcion');
            $table->string('latlng');
            $table->string('direccion');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('ciudadmigrante_ciudadmigrante_espacios');
    }
}
