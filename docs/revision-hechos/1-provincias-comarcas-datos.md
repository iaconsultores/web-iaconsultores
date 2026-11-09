# Revisión de hechos 1: provincias, comarcas y datos de zonas

Revisor: fact-checker. Resultado: 94 afirmaciones comprobadas, 9 corregidas, 0 quitadas del todo (3 de las correcciones eliminan el detalle no demostrable), el resto verificadas. Pruebas (textos, datos, páginas locales): 162 pasan.

Fuentes abreviadas: WP-es = Wikipedia en español; CV = comunitatvalenciana.com (turismo oficial de la Generalitat).

## src/datos/provincias.ts (coordenadas, economía y lugar)

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Coordenadas Marina Alta 38.84°N 0.11°E con lugar «Penyal d'Ifac y el puerto, Calp» | corregida (eran las de Dénia, no las de Calp) | https://en.wikipedia.org/wiki/Calp (38.644°N 0.046°E) | `c` pasa a 38.64°N 0.04°E |
| Alicante 38.35°N 0.48°W; Elche 38.27°N 0.70°W; Orihuela 38.08°N 0.94°W; Elda 38.48°N 0.79°W; Alcoi 38.70°N 0.47°W; Benidorm 38.54°N 0.13°W; Valencia 39.47°N 0.38°W; Murcia 37.98°N 1.13°W; Albacete 38.99°N 1.86°W | verificada (coinciden con el municipio de referencia) | https://es.wikipedia.org/wiki/Anexo:Municipios_de_la_provincia_de_Alicante y fichas de cada municipio en WP-es | ninguno |
| Xixona: turrón y helado | verificada | https://alicanteplaza.es/alicanteplaza/maestros-heladeros-mejor-helado-artesano-turron-jijona | ninguno |
| Elche: calzado, palmeral, logística junto al aeropuerto; alfombras en Crevillent; pesca en Santa Pola | verificada (calzado y Santa Pola, ver zonas; aeropuerto en término de Elche) | https://es.wikipedia.org/wiki/Elche | ninguno |
| Vega Baja: cítricos, alcachofa, hortalizas, turismo residencial, salinas en la costa | verificada | https://es.wikipedia.org/wiki/Bajo_Segura ; https://alicanteplaza.es/alicanteplaza/orihuela1/citricos-alcachofa-almendro-y-brocoli-lideran-la-superficie-de-cultivo-en-la-vega-baja ; https://www.uv.es/sehumed/eswetlands/7ES016.htm | ninguno |
| Vinalopó: calzado Elda/Petrer/Villena; mármol Novelda y el Pinós; uva embolsada; vino | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó ; https://es.wikipedia.org/wiki/Alto_Vinalopó ; https://litosonline.com/en/article/novelda-showroom-marble-spain | ninguno |
| Alcoià: textil y papel en Alcoi, juguete en Ibi y Onil, plástico y metal | verificada | https://es.wikipedia.org/wiki/Hoya_de_Alcoy ; https://alicanteplaza.es/las-empresas-textiles-siguen-a-la-cabeza-en-lalcoia-y-el-comtat-alcanzan-el-30-de-la-facturacion-y-de-los-empleos | ninguno |
| Marina Baixa: hoteles y hostelería; chocolate en la Vila Joiosa | verificada | https://www.comunitatvalenciana.com/mediterraneo-en-accion/chocolate-villajoyosa | ninguno |
| Marina Alta: turismo residencial, náutica, gastronomía | verificada | https://es.wikipedia.org/wiki/Marina_Alta ; https://denia.net/en/?p=21796 | ninguno |
| Valencia: puerto, cítricos, agroalimentario, automoción; textil hogar en Ontinyent | verificada | https://www.valenciaport.com/en/valenciaport-congratulates-the-almussafes-plant-on-the-awarding-of-the-contract-for-new-electric-models ; https://www.camaravalencia.com/wp-content/uploads/2022/12/La_Valld_Albaida.pdf | ninguno |
| Murcia: agroalimentario y conservas, huerta, logística; mueble en Yecla; industria en Cartagena | verificada | https://mercasa.es/wp-content/uploads/2022/03/Region-de-Murcia.pdf ; https://es.hispanopedia.com/wiki/Yecla | ninguno |
| Albacete: cuchillería, agroalimentario, aeronáutica, renovables; calzado en Almansa | verificada | https://www.airbus.com/en/newsroom/press-releases/2017-11-airbus-helicopters-celebrates-10-year-presence-in-albacete-and ; https://www.eldebate.com/espana/castilla-la-mancha/20250629/albacete-seki-viaje-capitales-mundiales-cuchilleria_311644.html | ninguno |
| Lugares de escena: puerto y castillo de Santa Bárbara; naves de calzado y palmeras; naranjos y alcachofas junto al Segura; uva embolsada y canteras; fábricas textiles de Alcoi; hoteles de Benidorm; Penyal d'Ifac; grúas del puerto de Valencia; noria de Murcia; aerogeneradores de Albacete | verificada (elementos reales de cada lugar) | https://alicanteplaza.es/alicanteplaza/orihuela1/citricos-alcachofa-almendro-y-brocoli-lideran-la-superficie-de-cultivo-en-la-vega-baja ; https://castillalamancha.es/print/268774 (eólica de Albacete) | ninguno |

## src/datos/zonas.ts (comarca/provincia, municipios, sectores)

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Baix Vinalopó: Elche, Crevillent, Santa Pola | verificada | https://alicanteplaza.es/alicanteplaza/la-dop-de-la-granada-mollar-de-elche-comienza-la-temporada-con-buenas-perspectivas (comarca) ; WP-es Bajo Vinalopó | ninguno |
| Vega Baja: Orihuela, Torrevieja, Almoradí, Callosa de Segura, Pilar de la Horadada, Guardamar, Rojales | verificada | https://es.wikipedia.org/wiki/Bajo_Segura | ninguno |
| Vinalopó Mitjà: Elda, Petrer, Novelda, Aspe, Monòver, el Pinós, Monforte del Cid | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó | ninguno |
| Alt Vinalopó: Villena, Sax, Biar, Beneixama, Salinas | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó | ninguno |
| Alcoià y Comtat: Alcoi, Ibi, Onil, Castalla, Banyeres de Mariola (Alcoià); Cocentaina, Muro d'Alcoi (Comtat) | verificada (Banyeres figura en la comarca del Alcoià) | https://es.wikipedia.org/wiki/Hoya_de_Alcoy | ninguno |
| Marina Baixa: Benidorm, la Vila Joiosa, Altea, l'Alfàs del Pi, la Nucia, Finestrat, Callosa d'en Sarrià | verificada | https://es.wikipedia.org/wiki/Marina_Baja | ninguno |
| Marina Alta: Dénia, Xàbia, Calp, Teulada-Moraira, Benissa, Pego, Ondara, Pedreguer | verificada | https://es.wikipedia.org/wiki/Marina_Alta | ninguno |
| l'Alacantí: Alicante, San Vicente, Sant Joan, El Campello, Mutxamel, Xixona | verificada | https://es.wikipedia.org/wiki/Campo_de_Alicante | ninguno |
| Padre de cada municipio (Elda/Petrer/Novelda/Aspe en Vinalopó Mitjà; Villena en Alt Vinalopó; Gandia/Ontinyent en Valencia; Almansa en Albacete; Murcia/Cartagena/Molina/Yecla en Región de Murcia) | verificada | WP-es de cada municipio | ninguno |
| Provincia de Valencia: Valencia, Gandia, Ontinyent, Xàtiva, Alzira, Sagunt; Albacete: Albacete, Almansa, Hellín, Villarrobledo, Caudete; Murcia: Murcia, Cartagena, Molina de Segura, Yecla, Lorca, Cieza | verificada | WP-es de cada municipio | ninguno |
| Sectores Baix Vinalopó (calzado, agricultura y palmeral, logística, alfombras, pesca y turismo) | verificada | ver tabla de baix-vinalopo.md | ninguno |
| Sectores Vega Baja (agricultura, industria agroalimentaria, turismo residencial, inmobiliario, comercio) | verificada | https://es.wikipedia.org/wiki/Bajo_Segura | ninguno |
| Sectores Vinalopó Mitjà (calzado, mármol, uva embolsada, vino, especias) | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó ; https://www.elperiodic.com/novelda/ayuntamiento-visita-verdu-canto-saffron-spain-aniversario_1081652 | ninguno |
| Sectores Alt Vinalopó (calzado, industria, agricultura y vino, logística, comercio) | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó ; https://www.diputacionalicante.es/wp-content/uploads/2020/07/guia-cultivos_COMARCAS-vinalop%C3%B3-ver-11.0.pdf | ninguno |
| Sectores Alcoià y Comtat (textil, juguete, plástico y metal, papel, alimentación) | verificada | https://alicanteplaza.es/alicanteplaza/alcoy-se-fija-dos-anos-y-30-acciones-para-robustecer-y-ampliar-su-tejido-industrial ; WP-es Hoya de Alcoy | ninguno |
| Sectores Marina Baixa (hoteles, turismo, chocolate, agricultura) | verificada | https://www.comunitatvalenciana.com/mediterraneo-en-accion/chocolate-villajoyosa ; DOP níspero | ninguno |
| Sectores Marina Alta (turismo residencial, servicios a residentes extranjeros, náutica, gastronomía, cítricos) | verificada | https://es.wikipedia.org/wiki/Marina_Alta ; https://lamarinaalta.com/en/municipio-ondara/ | ninguno |
| Sectores provincia de Valencia (agro y cítricos, logística portuaria, automoción, textil hogar, mueble, turismo) | verificada | https://www.valenciaport.com/en/?p=60293 ; https://turisme.dival.es/wp-content/uploads/2022/09/Horta-Sud_Connecta.pdf (triángulo del mueble) | ninguno |
| Sectores Región de Murcia y Albacete | verificada | ver tablas de region-de-murcia.md y provincia-de-albacete.md | ninguno |

## src/conocimiento/09-zonas-y-soluciones.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Comarcas citadas (l'Alacantí, Baix Vinalopó, Vega Baja, Vinalopó Mitjà, Alt Vinalopó, l'Alcoià y el Comtat, Marina Baixa, Marina Alta) pertenecen a la provincia de Alicante | verificada | WP-es de cada comarca (enlaces arriba) | ninguno |
| Calzado en Elche, Elda, Petrer, Almansa y Villena; juguete en Ibi; textil en Alcoi, Ontinyent y Crevillent; mármol en Novelda y el Pinós; mueble en Yecla; cuchillería en Albacete; Cartagena servicios industriales; uva del Vinalopó, turrón y helado de Xixona; cítricos de Gandia | verificada | https://es.wikipedia.org/wiki/Hoya_de_Alcoy ; https://es.wikipedia.org/wiki/Medio_Vinalopó ; https://www.camaravalencia.com/wp-content/uploads/2022/12/La_Valld_Albaida.pdf ; https://es.hispanopedia.com/wiki/Yecla ; Albacete (ver abajo) | ninguno |

## provincia-de-alicante.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Turismo en la costa, de la Marina Alta a la Vega Baja | verificada | https://es.wikipedia.org/wiki/Marina_Alta ; https://es.wikipedia.org/wiki/Bajo_Segura | ninguno |
| Tradición industrial a lo largo del Vinalopó y en las montañas de Alcoi: calzado, juguetes, textil, plástico, piedra natural | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó ; https://es.wikipedia.org/wiki/Hoya_de_Alcoy | ninguno |
| Cítricos y hortalizas en la huerta del Segura; uva de mesa y viña | verificada | https://es.wikipedia.org/wiki/Bajo_Segura ; https://www.diputacionalicante.es/wp-content/uploads/2020/07/guia-cultivos_COMARCAS-vinalop%C3%B3-ver-11.0.pdf | ninguno |
| Alicante: puerto, Universidad de Alicante, aeropuerto Alicante-Elche | verificada | https://es.wikipedia.org/wiki/Aeropuerto_de_Alicante-Elche | ninguno |
| Vinalopó, Vega Baja, Xixona, Ibi, Novelda y el Pinós como ejemplos | verificada | ver tablas de cada comarca | ninguno |
| Sur de Valencia, Murcia y Almansa a hora y media | no comprobada (distancia aprobada por el dueño) | n/a | ninguno |

## provincia-de-valencia.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Puerto de Valencia y logística; industria del automóvil con proveedores | verificada | https://www.valenciaport.com/en/?p=60293 | ninguno |
| «El mueble» alrededor de la capital | corregida (precisado: Horta Sud, el «triángulo del mueble» Benetússer, Sedaví, Alfafar) | https://turisme.dival.es/wp-content/uploads/2022/09/Horta-Sud_Connecta.pdf | «el mueble de la Horta Sud» |
| Ribera y Safor, tierra de naranjos y exportadores de cítricos; almacenes de confección | verificada | https://valenciaplaza.com/valenciaplaza/noticia27767 ; https://riunet.upv.es/bitstream/10251/15425/1/Tfc.%20Rebeca%20Talens%20definitiu.pdf | ninguno |
| Costa de Gandia y Cullera vive del turismo | verificada | https://www.enciclopedia.cat/EC-GEC-0057709 (Gandia: cítricos y turismo) ; Cullera en WP-es | ninguno |
| Vall d'Albaida con Ontinyent: textil hogar | verificada | https://www.camaravalencia.com/wp-content/uploads/2022/12/La_Valld_Albaida.pdf ; https://www.edcities.org/en/?p=1602 | ninguno |
| Costera con Xàtiva: industria, agricultura y comercio | verificada (Xàtiva, capital de la Costera) | https://es.wikipedia.org/wiki/Costera | ninguno |
| Sagunt: puerto e industria | verificada | https://valenciaplaza.com/la-gigafactoria-de-vw-en-sagunto-un-motor-para-la-reindustrializacion-valenciana (siderurgia, puerto, industria) | ninguno |
| Safor con Gandia y Oliva; Vall d'Albaida con Ontinyent, Albaida y Bocairent; Costera con Xàtiva; Ribera y Camp de Morvedre | verificada | https://es.wikipedia.org/wiki/La_Safor ; https://www.enciclopedia.cat/gran-enciclopedia-catalana/albaida | ninguno |

## region-de-murcia.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Huerta de Murcia, Vega del Segura, Campo de Cartagena, Guadalentín (Lorca), Vega Alta (Cieza): hortalizas, cítricos y fruta | verificada | https://www.mapa.gob.es/ministerio/pags/Biblioteca/Revistas/pdf_Vrural/Vrural_2012_344_15_18.pdf ; https://mercasa.es/wp-content/uploads/2022/03/Region-de-Murcia.pdf | ninguno |
| Conserveras de Molina de Segura y su entorno | verificada | https://es-academic.com/dic.nsf/eswiki/818103 ; https://www.edcities.org/en/?p=1724 | ninguno |
| Cartagena: puerto, industria química y energética en el valle de Escombreras, tradición naval | verificada | https://www.investinmurcia.com/wp-content/uploads/2023/01/Quimica-farmacia.pdf ; https://digitum.um.es/digitum/bitstream/10201/21922/1/10%20El%20puerto%20de%20Cartagena%20su%20evolucion%20reciente.pdf | ninguno |
| Yecla: industria del mueble y bodegas con denominación de origen propia | verificada | https://es.hispanopedia.com/wiki/Yecla ; https://es.hispanopedia.com/wiki/Yecla_(vino) | ninguno |
| Costa del Mar Menor y La Manga vive del turismo; Murcia concentra comercio, sanidad, universidad | verificada (general, WP-es Región de Murcia) | https://es.wikipedia.org/wiki/Regi%C3%B3n_de_Murcia | ninguno |
| Molina de Segura, Lorca, Cieza, Águilas, Noroeste como municipios/zonas de la Región | verificada | WP-es | ninguno |
| Murcia a una hora y Cartagena a una hora y cuarto | no comprobada (distancia aprobada) | n/a | ninguno |

## provincia-de-albacete.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Tradición cuchillera de la capital (navajas, cuchillos, tijeras) | verificada | https://www.eldebate.com/espana/castilla-la-mancha/20250629/albacete-seki-viaje-capitales-mundiales-cuchilleria_311644.html ; https://www.directoalpaladar.com/viajes/china-fue-estocada-falta-relevo-generacional-puntilla-asi-sobrevive-cuchilleria-artesanal-albacete | ninguno |
| Industria aeronáutica en Albacete | verificada | https://www.airbus.com/en/newsroom/press-releases/2017-11-airbus-helicopters-celebrates-10-year-presence-in-albacete-and | ninguno |
| Cereal, viñedo y queso manchego | verificada | https://www.wikipedia.org/wiki/Villarrobledo ; https://castillalamancha.es/print/268774 | ninguno |
| Parques eólicos y solares | verificada | https://castillalamancha.es/print/268774 ; https://www.renewableenergymagazine.com/panorama/el-gobierno-de-castillala-mancha-tramita-60-20221129 | ninguno |
| Almansa: tradición en el calzado | verificada | https://ninos.kiddle.co/Almansa (apoyo) ; https://www.ppab.es/files/noticias/documentos/pp-clmnotadeprensaagudorespaldalasdocx | ninguno |
| Almansa: cruce de la autovía Alicante-Madrid (A-31) y la de Valencia (A-35) | verificada | https://en.wikipedia.org/wiki/Autov%C3%ADa_A-31 ; https://en.wikipedia.org/wiki/Autov%C3%ADa_A-35 | ninguno |
| Caudete pegado a Villena, Hellín camino de Murcia, Villarrobledo con viñedo | verificada | https://www.wikipedia.org/wiki/Villarrobledo ; https://rutadelvinodelamancha.com/en/?p=8489 ; WP-es Caudete | ninguno |
| Bodegas, queserías y cooperativas | verificada | ver arriba (queso manchego, viñedo) | ninguno |

## alacanti.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| San Vicente del Raspeig acoge el campus de la Universidad de Alicante | verificada | https://es.wikipedia.org/wiki/Universidad_de_Alicante | ninguno |
| Sant Joan d'Alacant: hospital y campus universitario de ciencias de la salud (UMH) | verificada | https://en.wikipedia.org/wiki/Miguel_Hern%C3%A1ndez_University_of_Elche ; https://alicanteplaza.es/la-umh-se-expandeen-el-campus-de-sant-joan-asi-sera-el-nuevo-edificio-concepcion-aleixandre | ninguno |
| El Campello mantiene puerto pesquero (lonja) | verificada | https://www.comunitatvalenciana.com/es/alacant-alicante/el-campello/donde-ir-de-compras/lonja-subasta-de-pescado | ninguno |
| Mutxamel: zonas residenciales, comercio y pequeña industria | corregida (solo está demostrada la industria: polígonos Riodel y Els Plans) | https://alicanteplaza.es/alicanteplaza/noticia21762 ; https://www.elperiodic.com/mutxamel/ayuntamiento-mutxamel-invierte-134000-euros-modernizacion-senaletica-seguridad-zonas-verdes-poligono-industrial-riodel_821283 | «combina zonas residenciales con polígonos industriales como Riodel» |
| Xixona: turrón y helado, tradición heladera extendida por España | verificada | https://alicanteplaza.es/alicanteplaza/alacanti/xixona-reparte-helado-artesanal-para-reivindicar-su-tradicion-heladera-y-a-sus-maestros-heladeros | ninguno |
| Agost conserva su oficio alfarero | verificada | https://comunitatvalenciana.com/es/inspirate/artesania-agost | ninguno |
| Puerto de Alicante, comercio, sanidad, servicios, turismo urbano y de playa; playa de San Juan; Agost en la comarca | verificada | WP-es Alicante / Campo de Alicante | ninguno |
| Distancia de 10 a 30 minutos | no comprobada (aprobada) | n/a | ninguno |

## baix-vinalopo.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Elche, uno de los centros del calzado en España | verificada | https://es.wikipedia.org/wiki/Elche | ninguno |
| Aeropuerto de Alicante-Elche, Elche Parque Empresarial, campus principal de la UMH en Elche | verificada | https://es.wikipedia.org/wiki/Aeropuerto_de_Alicante-Elche ; https://en.wikipedia.org/wiki/Miguel_Hern%C3%A1ndez_University_of_Elche | ninguno |
| Camp d'Elx: granada mollar y hortalizas | verificada | https://agroambient.gva.es/documents/366567370/368758033/DU-GRANADA-ELCHE-2022.pdf/bf893379-6056-407d-ad3a-babc409bb1c1 ; https://mapa.gob.es/images/es/granada_mollar_elche_2023_02_27_tcm30-210330.pdf | ninguno |
| Palmeral con dátiles | verificada | https://es.wikipedia.org/wiki/Palmeral_de_Elche | ninguno |
| Crevillent: alfombras y textil, agricultura | verificada | https://es.wikipedia.org/wiki/Crevillente | ninguno |
| Santa Pola: puerto pesquero con lonja, salinas, playas, hostelería | verificada | https://www.uv.es/sehumed/eswetlands/7ES016.htm ; https://www.calpe.es/sites/default/files/2019-11/archivo531.pdf ; https://www.elespanol.com/alacant/viure/gastronomia/20250701/mejor-municipio-alicante-comer-marisco-llega-directo-barcos-restaurantes-trt/1003743826958_0.html | ninguno |
| Autovías hacia Alicante, Murcia y el interior | verificada | WP-es Elche | ninguno |

## vega-baja.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| La Vega Baja (Baix Segura), comarca más al sur de la provincia | verificada | https://es.wikipedia.org/wiki/Bajo_Segura | ninguno |
| Huerta de cítricos y hortalizas, alcachofa como producto emblemático | verificada | https://alicanteplaza.es/alicanteplaza/orihuela1/citricos-alcachofa-almendro-y-brocoli-lideran-la-superficie-de-cultivo-en-la-vega-baja ; https://valencianews.es/comarcas/toni-perez-alcachofa-vega-baja/ | ninguno |
| Orihuela: capital histórica, término de la huerta al mar, Orihuela Costa | verificada | WP-es Orihuela | ninguno |
| Almoradí «centro agrícola y comercial para muchos pueblos de alrededor» | corregida (no hay fuente; sí está demostrado su papel en la alcachofa) | https://www.comunitatvalenciana.com/es/alacant-alicante/almoradi/eventos/congreso-nacional-de-la-alcachofa-en-almoradi | «Almoradí es uno de los centros de la alcachofa» |
| Callosa de Segura: larga tradición industrial ligada al cáñamo | verificada | https://www.comunitatvalenciana.com/es/alacant-alicante/callosa-de-segura/museos/cm-museo-etnologico-municipal-del-canamo-y-huerta ; https://boe.es/boe/dias/2024/08/07/pdfs/BOE-A-2024-16390.pdf | ninguno |
| Torrevieja con sus lagunas saladas; población muy internacional | verificada | https://www.uv.es/sehumed/eswetlands/7ES016.htm | ninguno |
| Guardamar, Pilar de la Horadada y Rojales en la comarca, con turismo residencial | verificada | https://es.wikipedia.org/wiki/Bajo_Segura | ninguno |

## vinalopo-mitja.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Elda y Petrer viven del calzado; industria auxiliar | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó | ninguno |
| Elda y Petrer «forman una sola ciudad a efectos prácticos» | corregida (formulación sin respaldo oficial) | https://es.wikipedia.org/wiki/Medio_Vinalopó | «son vecinas pegadas una a otra» |
| Novelda: piedra natural y núcleo del mármol «junto con el Pinós», aserraderos | corregida (demostrado: Novelda referencia, canteras en Pinós y otros; Corredor del Mármol) | https://litosonline.com/en/article/novelda-showroom-marble-spain ; https://aquimediosdecomunicacion.com/2020/11/04/en-el-corredor-del-marmol-del-vinalopo-contamos-con-yacimientos-de-gran-prestigio-a-nivel-mundial ; https://alicanteplaza.es/levantina-sigue-de-compras-ahora-la-antigua-cantera-de-marmoles-damaso-en-el-pinos | Reescrito sin «núcleo» ni «aserraderos» |
| Novelda, conocida por especias y condimentos | verificada | https://www.elperiodic.com/novelda/ayuntamiento-visita-verdu-canto-saffron-spain-aniversario_1081652 ; https://www.lamoncloa.gob.es/lang/en/presidente/news/paginas/2026/20260910-carmencita-especias-plant.aspx | ninguno |
| Aspe, Novelda y Monforte del Cid: uva de mesa embolsada (DOP) | verificada | https://mapa.gob.es/es/alimentacion/temas/calidad-diferenciada/uva_vinalopo_2015_05_29_tcm30-210665.pdf ; https://es.wikipedia.org/wiki/Medio_Vinalopó | ninguno |
| Uva que llega a muchas mesas en Nochevieja | verificada | https://gastronosfera.com/tendencias/las-uvas-del-vinalopo-protagonistas-de-nochevieja | ninguno |
| Monòver y el Pinós con viñedo y bodegas | verificada | https://es.wikipedia.org/wiki/Medio_Vinalopó | ninguno |
| Villena y Sax como «más arriba» (Alt Vinalopó) | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó | ninguno |

## alt-vinalopo.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Comarca del interior que se asoma a la Meseta; Villena capital | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó | ninguno |
| Villena: industria del calzado, otras fábricas, comercio, logística junto a la autovía Alicante-Madrid | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó ; https://en.wikipedia.org/wiki/Autov%C3%ADa_A-31 | ninguno |
| Campo de viñedo, olivo, almendro y cereal; bodegas y cooperativas | verificada | https://www.diputacionalicante.es/wp-content/uploads/2020/07/guia-cultivos_COMARCAS-vinalop%C3%B3-ver-11.0.pdf ; https://www.winedering.com/es/winery-bodegas-francisco-gmez_d2879 | ninguno |
| Sax con su castillo; Biar, Beneixama, Salinas, Camp de Mirra y la Cañada | verificada | https://es.wikipedia.org/wiki/Alto_Vinalopó | ninguno |
| Caudete y Almansa comparten oficio y carreteras con Villena | verificada | https://en.wikipedia.org/wiki/Autov%C3%ADa_A-31 | ninguno |

## alcoia-comtat.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Alcoi: textil, papel, metal, alimentación | verificada | https://alicanteplaza.es/alicanteplaza/alcoy-se-fija-dos-anos-y-30-acciones-para-robustecer-y-ampliar-su-tejido-industrial ; https://alicanteplaza.es/las-empresas-textiles-siguen-a-la-cabeza-en-lalcoia-y-el-comtat-alcanzan-el-30-de-la-facturacion-y-de-los-empleos | ninguno |
| Campus universitario politécnico en Alcoi | verificada | https://www.upv.es/entidades/epsa/el-campus/historia-del-campus/ | ninguno |
| «Empresas de textil técnico y de hogar» | corregida (solo está demostrado el sector textil en general) | https://alicanteplaza.es/las-empresas-textiles-siguen-a-la-cabeza-en-lalcoia-y-el-comtat-alcanzan-el-30-de-la-facturacion-y-de-los-empleos | «empresas textiles, papeleras» |
| Foia de Castalla, valle del juguete: Ibi, Onil, Castalla | verificada | https://elordenmundial.com/mapas-y-graficos/mapa-valle-juguete-alicante-polo-juguetero-espana/ ; https://es.wikipedia.org/wiki/Hoya_de_Alcoy | ninguno |
| Onil con tradición de muñecas | verificada | https://www.comunitatvalenciana.com/mediterraneo-en-accion/museo-de-la-muneca-onil | ninguno |
| Banyeres de Mariola: papel y textil | verificada | https://es.wikipedia.org/wiki/Hoya_de_Alcoy | ninguno |
| Cocentaina, centro comercial e industrial; feria de Tots Sants | verificada | https://alicanteplaza.es/alicanteplaza/el-gobierno-declara-la-fira-de-tots-sants-de-cocentaina-como-fiesta-de-interes-turistico-internacional ; https://alicanteplaza.es/alicanteplaza/cocentaina-se-situa-a-la-cabeza-en-empleo-textil-y-confeccion-en-la-provincia-con-1278-trabajadores | ninguno |
| Muro d'Alcoi (Comtat) con industria y agricultura | verificada (en el Comtat; actividad general) | WP-es Muro de Alcoy | ninguno |
| Campaña de Navidad en el juguete | verificada | https://www.festivalesdeespana.com/festival/navidad-onil ; https://www.comunitatvalenciana.com/itinerarios/valle-del-juguete | ninguno |

## marina-baixa.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Benidorm: hoteles, apartamentos y ocio con visitantes de muchos países todo el año | verificada | https://es.wikipedia.org/wiki/Benidorm | ninguno |
| La Vila Joiosa: casas de colores, tradición chocolatera, puerto pesquero | verificada | https://www.comunitatvalenciana.com/mediterraneo-en-accion/chocolate-villajoyosa ; https://www.boe.es/boe/dias/2026/02/14/pdfs/BOE-A-2026-3453.pdf | ninguno |
| Altea: Facultad de Bellas Artes de la UMH en el municipio | verificada | https://bbaa.umh.es/files/2024/05/CAMPUS_Altea.pdf | ninguno |
| L'Alfàs del Pi: comunidad numerosa de residentes del norte de Europa | verificada | https://en.wikipedia.org/wiki/L%27Alf%C3%A0s_del_Pi ; https://www.xataka.com/magnet/alicante-colonia-nordica-celebra-su-propia-constitucion-l-alfas-pi-tiene-20-000-habitantes-30-noruegos | ninguno |
| La Nucia y Finestrat con urbanizaciones, comercio e instalaciones deportivas | corregida (solo queda lo demostrable de forma general) | https://es.wikipedia.org/wiki/Marina_Baja | «han crecido con urbanizaciones y servicios» |
| Callosa d'en Sarrià conocida por sus nísperos | verificada | https://portalagrari.gva.es/documents/366567370/366661129/DU-NISPEROS-CALLOSA.pdf/ ; https://www.mapa.gob.es/images/es/nisperos_callosa_en_sarria_2016_04_19_tcm30-210943.pdf | ninguno |
| Cooperativas de nísperos y cítricos | verificada | mismas fuentes DOP Nísperos | ninguno |

## marina-alta.md

| Afirmación | Veredicto | Fuente | Cambio hecho |
|---|---|---|---|
| Esquina norte de la provincia, entre el Montgó, el cabo de la Nau y el Penyal d'Ifac | verificada | https://es.wikipedia.org/wiki/Marina_Alta | ninguno |
| Turismo residencial con muchos vecinos de otros países de Europa | verificada | https://es.wikipedia.org/wiki/Marina_Alta | ninguno |
| Dénia: puerto con barcos a las Baleares | verificada | https://es.wikipedia.org/wiki/D%C3%A9nia | ninguno |
| Dénia: gastronomía reconocida, gamba roja como emblema | verificada (Ciudad Creativa de la Gastronomía UNESCO, 2015) | https://denia.net/en/?p=21796 ; https://denia.net/la-gamba-roja-de-denia1 | ninguno |
| Calp mantiene lonja y puerto pesquero | verificada | https://www.calpe.es/sites/default/files/2019-11/archivo531.pdf ; https://www.spainseeker.com/en/food/calpe-pescado-de-lonja | ninguno |
| Teulada-Moraira y Benissa: viñedo de moscatel | verificada | https://www.comunitatvalenciana.com/en/be-inspired/marina-alta-vineyards ; https://www.spain.info/es/destino/teulada/ | ninguno |
| Pego: arroz del marjal | verificada | https://comunitatvalenciana.com/es/alacant-alicante/pego/espacios-naturales/parque-natural-de-la-marjal-de-pego-y-oliva | ninguno |
| Zona de Ondara y Pedreguer con «comercios y servicios para toda la comarca» | corregida (no demostrado; sí lo es la agricultura de cítricos de Ondara) | https://es.hispanopedia.com/wiki/Ondara ; https://www.enciclopedia.cat/gran-enciclopedia-catalana/ondara-1 | «en los llanos de Ondara y Pedreguer, quedan cítricos y huerta» |
| Cítricos y huerta en los llanos | verificada | https://www.macma.org/tourism/seasonal/between-orange-trees-in-the-shade-of-segaria | ninguno |
| Safor, Oliva y Gandia en la provincia de Valencia | verificada | https://es.wikipedia.org/wiki/La_Safor | ninguno |

## Notas

- Las distancias y la afirmación «a menos de hora y media» no se han tocado (aprobadas por el dueño).
- Marrón Imperial no se cita en ningún texto (no es del Pinós: sus canteras están en Yecla y Jumilla).
- Fuentes de calidad media usadas como apoyo coincidente: Wikipedia (es/en) y Hispanopedia; para las afirmaciones críticas hay además fuente oficial o primaria (GVA, MAPA, Junta de Castilla-La Mancha, Airbus, UMH, UPV, BOE, ayuntamientos).
- Algunas filas citan la ficha de Wikipedia del municipio sin enlace exacto cuando la afirmación es de geografía básica; esas filas son de bajo riesgo.
