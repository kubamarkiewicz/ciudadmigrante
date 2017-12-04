
/* Rename this file to "api.js" */

window.config = window.config || {};

window.config.api = {

    "urls" : {
        "get_puntosdeacogida" 		: "admin/api/puntosdeacogida",
        "add_puntodeacogida"		: "admin/api/puntosdeacogida",
        "get_relatos" 				: "admin/api/relatos",
        "get_espacios" 				: "admin/api/espacios",
        "get_espacio" 				: "admin/api/espacio/:id",
        "get_categories" 			: "admin/api/categories",
        "getTranslations"			: "admin/api/translations",
        "missingTranslation"		: "admin/api/translation"
    }

}