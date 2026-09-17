-- SISAT: esquema completo para instalaciones nuevas (MariaDB 10.2.1 o posterior).
-- Los IDs administrativos 1=Activo, 2=Inactivo, 3=Mantenimiento son estables.
CREATE DATABASE IF NOT EXISTS sisat
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sisat;

CREATE TABLE estado (
    est_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Estado',
    est_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    est_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Estado',
    PRIMARY KEY (est_id),
    UNIQUE KEY uk_estado_codigo (est_codigo),
    UNIQUE KEY uk_estado_nombre (est_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Estados';

CREATE TABLE fase (
    fas_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Fase',
    fas_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    fas_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la Fase',
    PRIMARY KEY (fas_id),
    UNIQUE KEY uk_fase_codigo (fas_codigo),
    UNIQUE KEY uk_fase_nombre (fas_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Fases de Tickets';

CREATE TABLE constancia (
    con_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Constancia',
    con_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    con_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la Constancia',
    PRIMARY KEY (con_id),
    UNIQUE KEY uk_constancia_codigo (con_codigo),
    UNIQUE KEY uk_constancia_nombre (con_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Estados Documentales';

CREATE TABLE situacion (
    sit_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Situación',
    sit_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    sit_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la Situación',
    PRIMARY KEY (sit_id),
    UNIQUE KEY uk_situacion_codigo (sit_codigo),
    UNIQUE KEY uk_situacion_nombre (sit_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Situaciones de Actas';

CREATE TABLE prioridad (
    pri_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Prioridad',
    pri_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    pri_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la Prioridad',
    PRIMARY KEY (pri_id),
    UNIQUE KEY uk_prioridad_codigo (pri_codigo),
    UNIQUE KEY uk_prioridad_nombre (pri_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Prioridades';

CREATE TABLE solicitud (
    sol_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Tipo de Solicitud',
    sol_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    sol_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Tipo de Solicitud',
    PRIMARY KEY (sol_id),
    UNIQUE KEY uk_solicitud_codigo (sol_codigo),
    UNIQUE KEY uk_solicitud_nombre (sol_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Tipos de Solicitud';

CREATE TABLE rol (
    rol_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Rol',
    rol_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    rol_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Rol',
    PRIMARY KEY (rol_id),
    UNIQUE KEY uk_rol_codigo (rol_codigo),
    UNIQUE KEY uk_rol_nombre (rol_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Roles';

CREATE TABLE clase (
    cla_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Clase de Archivo',
    cla_codigo VARCHAR(50) NOT NULL COMMENT 'Código Estable',
    cla_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la Clase de Archivo',
    PRIMARY KEY (cla_id),
    UNIQUE KEY uk_clase_codigo (cla_codigo),
    UNIQUE KEY uk_clase_nombre (cla_nombre)
) ENGINE=InnoDB COMMENT='Catálogo de Clases de Archivo';

CREATE TABLE area (
    are_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Área',
    are_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Área',
    are_descripcion TEXT NULL COMMENT 'Descripción del Área',
    are_fkestado INT(11) NOT NULL COMMENT 'Estado del Área',
    are_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de Actualización',
    CONSTRAINT chk_area_estado CHECK (are_fkestado IN (1, 2)),
    PRIMARY KEY (are_id),
    UNIQUE KEY uk_area_nombre (are_nombre),
    CONSTRAINT fk_area_estado FOREIGN KEY (are_fkestado) REFERENCES estado (est_id)
) ENGINE=InnoDB COMMENT='Áreas Institucionales';

CREATE TABLE usuario (
    usu_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Usuario',
    usu_fkarea INT(11) NOT NULL COMMENT 'Área del Usuario',
    usu_fkestado INT(11) NOT NULL COMMENT 'Estado del Usuario',
    usu_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Usuario',
    usu_apellido VARCHAR(200) NOT NULL COMMENT 'Apellidos del Usuario',
    usu_correo VARCHAR(200) NOT NULL COMMENT 'Correo Electrónico',
    usu_contrasena TEXT NOT NULL COMMENT 'Hash de Contraseña',
    usu_puesto VARCHAR(200) NOT NULL COMMENT 'Puesto del Usuario',
    usu_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Registro',
    usu_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de Actualización',
    CONSTRAINT chk_usuario_estado CHECK (usu_fkestado IN (1, 2)),
    PRIMARY KEY (usu_id),
    UNIQUE KEY uk_usuario_correo (usu_correo),
    CONSTRAINT fk_usuario_area FOREIGN KEY (usu_fkarea) REFERENCES area (are_id),
    CONSTRAINT fk_usuario_estado FOREIGN KEY (usu_fkestado) REFERENCES estado (est_id)
) ENGINE=InnoDB COMMENT='Usuarios del Sistema';

CREATE TABLE perfil (
    per_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Perfil',
    per_fkusuario INT(11) NOT NULL COMMENT 'Usuario del Perfil',
    per_fkrol INT(11) NOT NULL COMMENT 'Rol del Perfil',
    PRIMARY KEY (per_id),
    UNIQUE KEY uk_perfil_usuario_rol (per_fkusuario, per_fkrol),
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (per_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_perfil_rol FOREIGN KEY (per_fkrol) REFERENCES rol (rol_id)
) ENGINE=InnoDB COMMENT='Roles Asignados a Usuarios';

CREATE TABLE sistema (
    sis_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Sistema',
    sis_fkarea INT(11) NOT NULL COMMENT 'Área Responsable del Sistema',
    sis_fkestado INT(11) NOT NULL COMMENT 'Estado del Sistema',
    sis_clave VARCHAR(200) NOT NULL COMMENT 'Clave del Sistema',
    sis_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del Sistema',
    sis_descripcion TEXT NOT NULL COMMENT 'Descripción del Sistema',
    sis_url TEXT NULL COMMENT 'Dirección del Sistema',
    sis_observacion TEXT NULL COMMENT 'Observaciones del Sistema',
    sis_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Registro',
    sis_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de Actualización',
    PRIMARY KEY (sis_id),
    UNIQUE KEY uk_sistema_clave (sis_clave),
    CONSTRAINT fk_sistema_area FOREIGN KEY (sis_fkarea) REFERENCES area (are_id),
    CONSTRAINT fk_sistema_estado FOREIGN KEY (sis_fkestado) REFERENCES estado (est_id)
) ENGINE=InnoDB COMMENT='Sistemas Institucionales';

CREATE TABLE responsable (
    res_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Responsable',
    res_fksistema INT(11) NOT NULL COMMENT 'Sistema Asignado',
    res_fkusuario INT(11) NOT NULL COMMENT 'Usuario Responsable',
    res_fkestado INT(11) NOT NULL COMMENT 'Estado de la Asignación',
    res_principal TINYINT(1) NOT NULL COMMENT 'Indicador de Responsable Principal',
    res_inicio DATETIME NOT NULL COMMENT 'Fecha de Inicio',
    res_fin DATETIME NULL DEFAULT NULL COMMENT 'Fecha de Fin',
    res_usuario_vigente INT(11) GENERATED ALWAYS AS (CASE WHEN res_fin IS NULL THEN res_fkusuario ELSE NULL END) PERSISTENT COMMENT 'Usuario de Asignación Vigente',
    res_principal_vigente INT(11) GENERATED ALWAYS AS (CASE WHEN res_fin IS NULL AND res_principal = 1 THEN res_fksistema ELSE NULL END) PERSISTENT COMMENT 'Clave Única del Principal Vigente',
    PRIMARY KEY (res_id),
    UNIQUE KEY uk_responsable_sistema_usuario (res_fksistema, res_usuario_vigente),
    UNIQUE KEY uk_responsable_principal (res_principal_vigente),
    CONSTRAINT chk_responsable_principal CHECK (res_principal IN (0, 1)),
    CONSTRAINT chk_responsable_vigencia CHECK ((res_fkestado = 1 AND res_fin IS NULL) OR (res_fkestado = 2 AND res_fin IS NOT NULL)),
    CONSTRAINT fk_responsable_sistema FOREIGN KEY (res_fksistema) REFERENCES sistema (sis_id),
    CONSTRAINT fk_responsable_usuario FOREIGN KEY (res_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_responsable_estado FOREIGN KEY (res_fkestado) REFERENCES estado (est_id),
    CONSTRAINT chk_responsable_periodo CHECK (res_inicio <= res_fin)
) ENGINE=InnoDB COMMENT='Responsables de Sistemas';

CREATE TABLE desarrollador (
    des_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Desarrollador',
    des_fksistema INT(11) NOT NULL COMMENT 'Sistema Asignado',
    des_fkusuario INT(11) NOT NULL COMMENT 'Usuario Desarrollador',
    des_fkestado INT(11) NOT NULL COMMENT 'Estado de la Asignación',
    des_inicio DATETIME NOT NULL COMMENT 'Fecha de Inicio',
    des_fin DATETIME NULL DEFAULT NULL COMMENT 'Fecha de Fin',
    des_usuario_vigente INT(11) GENERATED ALWAYS AS (CASE WHEN des_fin IS NULL THEN des_fkusuario ELSE NULL END) PERSISTENT COMMENT 'Usuario de Asignación Vigente',
    PRIMARY KEY (des_id),
    UNIQUE KEY uk_desarrollador_sistema_usuario (des_fksistema, des_usuario_vigente),
    CONSTRAINT chk_desarrollador_vigencia CHECK ((des_fkestado = 1 AND des_fin IS NULL) OR (des_fkestado = 2 AND des_fin IS NOT NULL)),
    CONSTRAINT fk_desarrollador_sistema FOREIGN KEY (des_fksistema) REFERENCES sistema (sis_id),
    CONSTRAINT fk_desarrollador_usuario FOREIGN KEY (des_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_desarrollador_estado FOREIGN KEY (des_fkestado) REFERENCES estado (est_id),
    CONSTRAINT chk_desarrollador_periodo CHECK (des_inicio <= des_fin)
) ENGINE=InnoDB COMMENT='Desarrolladores Asignados a Sistemas';

CREATE TABLE ticket (
    tic_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Ticket',
    tic_fksistema INT(11) NOT NULL COMMENT 'Sistema Relacionado',
    tic_fkarea INT(11) NOT NULL COMMENT 'Área Solicitante',
    tic_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Registró el Ticket',
    tic_fkprioridad INT(11) NOT NULL COMMENT 'Prioridad del Ticket',
    tic_fksolicitud INT(11) NOT NULL COMMENT 'Tipo de Solicitud',
    tic_fkfase INT(11) NOT NULL COMMENT 'Fase Operativa del Ticket',
    tic_fkconstancia INT(11) NOT NULL COMMENT 'Estado Documental del Ticket',
    tic_folio VARCHAR(200) NOT NULL COMMENT 'Folio del Ticket',
    tic_titulo VARCHAR(200) NOT NULL COMMENT 'Título del Ticket',
    tic_descripcion TEXT NOT NULL COMMENT 'Descripción del Problema',
    tic_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Registro',
    tic_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de Actualización',
    PRIMARY KEY (tic_id),
    UNIQUE KEY uk_ticket_folio (tic_folio),
    CONSTRAINT fk_ticket_sistema FOREIGN KEY (tic_fksistema) REFERENCES sistema (sis_id),
    CONSTRAINT fk_ticket_area FOREIGN KEY (tic_fkarea) REFERENCES area (are_id),
    CONSTRAINT fk_ticket_usuario FOREIGN KEY (tic_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_ticket_prioridad FOREIGN KEY (tic_fkprioridad) REFERENCES prioridad (pri_id),
    CONSTRAINT fk_ticket_solicitud FOREIGN KEY (tic_fksolicitud) REFERENCES solicitud (sol_id),
    CONSTRAINT fk_ticket_fase FOREIGN KEY (tic_fkfase) REFERENCES fase (fas_id),
    CONSTRAINT fk_ticket_constancia FOREIGN KEY (tic_fkconstancia) REFERENCES constancia (con_id)
) ENGINE=InnoDB COMMENT='Tickets de Soporte';

CREATE TABLE asignacion (
    asi_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Asignación',
    asi_fkticket INT(11) NOT NULL COMMENT 'Ticket Asignado',
    asi_fkusuario INT(11) NOT NULL COMMENT 'Usuario Desarrollador',
    asi_fkestado INT(11) NOT NULL COMMENT 'Estado de la Asignación',
    asi_fkusuario_asigna INT(11) NOT NULL COMMENT 'Usuario que Realizó la Asignación',
    asi_principal TINYINT(1) NOT NULL COMMENT 'Indicador de Desarrollador Principal',
    asi_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Asignación',
    asi_fin DATETIME NULL DEFAULT NULL COMMENT 'Fin de Asignación; NULL Mientras Vigente',
    asi_usuario_vigente INT(11) GENERATED ALWAYS AS (CASE WHEN asi_fin IS NULL THEN asi_fkusuario ELSE NULL END) PERSISTENT COMMENT 'Usuario de Asignación Vigente',
    asi_principal_vigente INT(11) GENERATED ALWAYS AS (CASE WHEN asi_fin IS NULL AND asi_principal = 1 THEN asi_fkticket ELSE NULL END) PERSISTENT COMMENT 'Clave Única del Principal Vigente',
    PRIMARY KEY (asi_id),
    UNIQUE KEY uk_asignacion_ticket_usuario (asi_fkticket, asi_usuario_vigente),
    UNIQUE KEY uk_asignacion_principal (asi_principal_vigente),
    CONSTRAINT chk_asignacion_principal CHECK (asi_principal IN (0, 1)),
    CONSTRAINT chk_asignacion_vigencia CHECK ((asi_fkestado = 1 AND asi_fin IS NULL) OR (asi_fkestado = 2 AND asi_fin IS NOT NULL)),
    CONSTRAINT chk_asignacion_periodo CHECK (asi_fin IS NULL OR asi_fecha <= asi_fin),
    UNIQUE KEY uk_asignacion_id_ticket (asi_id, asi_fkticket),
    CONSTRAINT fk_asignacion_ticket FOREIGN KEY (asi_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_asignacion_usuario FOREIGN KEY (asi_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_asignacion_estado FOREIGN KEY (asi_fkestado) REFERENCES estado (est_id),
    CONSTRAINT fk_asignacion_usuario_asigna FOREIGN KEY (asi_fkusuario_asigna) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Asignaciones de Tickets';

CREATE TABLE atencion (
    ate_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Atención',
    ate_fkticket INT(11) NOT NULL COMMENT 'Ticket Atendido',
    ate_ciclo INT(11) NOT NULL COMMENT 'Número de Ciclo',
    ate_inicio DATETIME NOT NULL COMMENT 'Fecha de Inicio',
    ate_diagnostico TEXT NULL COMMENT 'Diagnóstico Técnico',
    ate_solucion TEXT NULL COMMENT 'Descripción de la Solución',
    ate_cambios TEXT NULL COMMENT 'Cambios Realizados',
    ate_modulos TEXT NULL COMMENT 'Módulos Afectados',
    ate_datos TEXT NULL COMMENT 'Base de Datos Afectada',
    ate_comentarios TEXT NULL COMMENT 'Comentarios Técnicos Internos',
    CONSTRAINT chk_atencion_ciclo CHECK (ate_ciclo > 0),
    UNIQUE KEY uk_atencion_id_ticket (ate_id, ate_fkticket),
    PRIMARY KEY (ate_id),
    UNIQUE KEY uk_atencion_ticket_ciclo (ate_fkticket, ate_ciclo),
    CONSTRAINT fk_atencion_ticket FOREIGN KEY (ate_fkticket) REFERENCES ticket (tic_id)
) ENGINE=InnoDB COMMENT='Ciclos de Atención';

CREATE TABLE termino (
    ter_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Término',
    ter_fkatencion INT(11) NOT NULL COMMENT 'Atención Finalizada',
    ter_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Finalizó la Atención',
    ter_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Término',
    PRIMARY KEY (ter_id),
    UNIQUE KEY uk_termino_atencion (ter_fkatencion),
    CONSTRAINT fk_termino_atencion FOREIGN KEY (ter_fkatencion) REFERENCES atencion (ate_id),
    CONSTRAINT fk_termino_usuario FOREIGN KEY (ter_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Términos de Atención';

CREATE TABLE intervencion (
    int_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Intervención',
    int_fkatencion INT(11) NOT NULL COMMENT 'Atención Relacionada',
    int_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Realizó la Intervención',
    int_descripcion TEXT NOT NULL COMMENT 'Descripción de la Intervención',
    int_minutos INT(11) NOT NULL COMMENT 'Minutos Trabajados',
    int_interno TINYINT(1) NOT NULL COMMENT 'Indicador de Comentario Interno',
    int_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Intervención',
    CONSTRAINT chk_intervencion_valores CHECK (int_minutos >= 0 AND int_interno IN (0, 1)),
    PRIMARY KEY (int_id),
    CONSTRAINT fk_intervencion_atencion FOREIGN KEY (int_fkatencion) REFERENCES atencion (ate_id),
    CONSTRAINT fk_intervencion_usuario FOREIGN KEY (int_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Intervenciones Técnicas';

CREATE TABLE evidencia (
    evi_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Evidencia',
    evi_fkticket INT(11) NOT NULL COMMENT 'Ticket Relacionado',
    evi_fkatencion INT(11) NULL COMMENT 'Ciclo de Evidencia Final o Seguimiento',
    evi_fkreapertura INT(11) NULL COMMENT 'Reapertura Documentada',
    evi_fkclase INT(11) NOT NULL COMMENT 'Clase de Evidencia',
    evi_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Cargó la Evidencia',
    evi_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre Original del Archivo',
    evi_ruta TEXT NOT NULL COMMENT 'Ruta del Archivo',
    evi_formato VARCHAR(20) NOT NULL COMMENT 'Formato del Archivo',
    evi_tamano INT(11) NOT NULL COMMENT 'Tamaño del Archivo en Bytes',
    evi_descripcion TEXT NULL COMMENT 'Descripción de la Evidencia',
    evi_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Carga',
    PRIMARY KEY (evi_id),
    CONSTRAINT fk_evidencia_atencion FOREIGN KEY (evi_fkatencion, evi_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT chk_evidencia_contexto CHECK (evi_fkatencion IS NULL OR evi_fkreapertura IS NULL),
    CONSTRAINT chk_evidencia_tamano CHECK (evi_tamano > 0),
    CONSTRAINT chk_evidencia_formato CHECK (evi_formato IN ('jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'docx', 'xlsx', 'zip')),
    CONSTRAINT fk_evidencia_ticket FOREIGN KEY (evi_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_evidencia_clase FOREIGN KEY (evi_fkclase) REFERENCES clase (cla_id),
    CONSTRAINT fk_evidencia_usuario FOREIGN KEY (evi_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT chk_evidencia_video CHECK (
        LOWER(evi_formato) NOT IN ('mp4', 'video/mp4') OR evi_tamano <= 31457280
    )
) ENGINE=InnoDB COMMENT='Evidencias de Tickets';

CREATE TABLE transicion (
    tra_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Transición',
    tra_fkticket INT(11) NOT NULL COMMENT 'Ticket Relacionado',
    tra_fkfase_origen INT(11) NOT NULL COMMENT 'Fase Anterior del Ticket',
    tra_fkfase_destino INT(11) NOT NULL COMMENT 'Fase Nueva del Ticket',
    tra_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Realizó el Cambio',
    tra_comentario TEXT NULL COMMENT 'Comentario del Cambio de Estado',
    tra_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del Cambio de Estado',
    CONSTRAINT chk_transicion_fases CHECK (tra_fkfase_origen <> tra_fkfase_destino),
    PRIMARY KEY (tra_id),
    CONSTRAINT fk_transicion_ticket FOREIGN KEY (tra_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_transicion_fase_origen FOREIGN KEY (tra_fkfase_origen) REFERENCES fase (fas_id),
    CONSTRAINT fk_transicion_fase_destino FOREIGN KEY (tra_fkfase_destino) REFERENCES fase (fas_id),
    CONSTRAINT fk_transicion_usuario FOREIGN KEY (tra_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Historial de Estados de Tickets';

CREATE TABLE movimiento (
    mov_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Movimiento',
    mov_fkticket INT(11) NOT NULL COMMENT 'Ticket Reclasificado',
    mov_fksistema_origen INT(11) NOT NULL COMMENT 'Sistema de Origen',
    mov_fksistema_destino INT(11) NOT NULL COMMENT 'Sistema de Destino',
    mov_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Realizó el Movimiento',
    mov_motivo TEXT NOT NULL COMMENT 'Motivo del Cambio de Sistema',
    mov_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del Cambio de Sistema',
    CONSTRAINT chk_movimiento_sistemas CHECK (mov_fksistema_origen <> mov_fksistema_destino),
    PRIMARY KEY (mov_id),
    CONSTRAINT fk_movimiento_ticket FOREIGN KEY (mov_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_movimiento_sistema_origen FOREIGN KEY (mov_fksistema_origen) REFERENCES sistema (sis_id),
    CONSTRAINT fk_movimiento_sistema_destino FOREIGN KEY (mov_fksistema_destino) REFERENCES sistema (sis_id),
    CONSTRAINT fk_movimiento_usuario FOREIGN KEY (mov_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Cambios de Sistema de Tickets';

CREATE TABLE reapertura (
    rea_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Reapertura',
    rea_fkticket INT(11) NOT NULL COMMENT 'Ticket Reabierto',
    rea_fkatencion_origen INT(11) NOT NULL COMMENT 'Ciclo Resuelto que Se Reabre',
    rea_fkatencion_destino INT(11) NOT NULL COMMENT 'Nuevo Ciclo de Atención',
    rea_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Reabrió el Ticket',
    rea_motivo TEXT NOT NULL COMMENT 'Motivo de la Reapertura',
    rea_comentario TEXT NULL COMMENT 'Comentarios de Seguimiento',
    rea_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Reapertura',
    PRIMARY KEY (rea_id),
    UNIQUE KEY uk_reapertura_id_ticket (rea_id, rea_fkticket),
    UNIQUE KEY uk_reapertura_origen (rea_fkatencion_origen),
    UNIQUE KEY uk_reapertura_destino (rea_fkatencion_destino),
    CONSTRAINT chk_reapertura_ciclos CHECK (rea_fkatencion_origen <> rea_fkatencion_destino),
    CONSTRAINT fk_reapertura_origen FOREIGN KEY (rea_fkatencion_origen, rea_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT fk_reapertura_destino FOREIGN KEY (rea_fkatencion_destino, rea_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT fk_reapertura_ticket FOREIGN KEY (rea_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_reapertura_usuario FOREIGN KEY (rea_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Reaperturas de Tickets';

CREATE TABLE evaluacion (
    eva_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Evaluación',
    eva_fkticket INT(11) NOT NULL COMMENT 'Ticket Evaluado',
    eva_fkatencion INT(11) NOT NULL COMMENT 'Atención Evaluada',
    eva_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Evaluó la Solución',
    eva_calificacion INT(11) NOT NULL COMMENT 'Calificación de la Solución',
    eva_confirmacion TINYINT(1) NOT NULL COMMENT 'Confirmación de la Solución',
    eva_conformidad TEXT NULL COMMENT 'Comentario de Conformidad',
    eva_inconformidad TEXT NULL COMMENT 'Comentario de Inconformidad',
    eva_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Validación',
    CONSTRAINT chk_evaluacion_confirmacion CHECK (eva_confirmacion IN (0, 1)),
    PRIMARY KEY (eva_id),
    UNIQUE KEY uk_evaluacion_atencion (eva_fkatencion),
    CONSTRAINT fk_evaluacion_ticket FOREIGN KEY (eva_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_evaluacion_atencion FOREIGN KEY (eva_fkatencion, eva_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT fk_evaluacion_usuario FOREIGN KEY (eva_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT chk_evaluacion_calificacion CHECK (eva_calificacion BETWEEN 1 AND 5)
) ENGINE=InnoDB COMMENT='Evaluaciones de Soluciones';

CREATE TABLE cierre (
    cie_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Cierre',
    cie_fkticket INT(11) NOT NULL COMMENT 'Ticket Cerrado',
    cie_fkatencion INT(11) NOT NULL COMMENT 'Ciclo Validado y Cerrado',
    cie_fkusuario INT(11) NOT NULL COMMENT 'Usuario Responsable del Cierre',
    cie_comentario TEXT NULL COMMENT 'Comentario de Cierre',
    cie_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Cierre',
    PRIMARY KEY (cie_id),
    UNIQUE KEY uk_cierre_atencion (cie_fkatencion),
    CONSTRAINT fk_cierre_atencion FOREIGN KEY (cie_fkatencion, cie_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT fk_cierre_ticket FOREIGN KEY (cie_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_cierre_usuario FOREIGN KEY (cie_fkusuario) REFERENCES usuario (usu_id)
) ENGINE=InnoDB COMMENT='Cierres de Tickets';

CREATE TABLE acta (
    act_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Acta',
    act_fksistema INT(11) NOT NULL COMMENT 'Sistema del Acta',
    act_fkarea INT(11) NOT NULL COMMENT 'Área del Acta',
    act_fkusuario INT(11) NOT NULL COMMENT 'Jefe de Área Firmante',
    act_fksituacion INT(11) NOT NULL COMMENT 'Situación del Acta',
    act_sistema VARCHAR(200) NOT NULL COMMENT 'Nombre Histórico del Sistema',
    act_area VARCHAR(200) NOT NULL COMMENT 'Nombre Histórico del Área',
    act_firmante VARCHAR(200) NOT NULL COMMENT 'Nombre Histórico del Firmante',
    act_folio VARCHAR(200) NOT NULL COMMENT 'Folio del Acta',
    act_inicio DATE NOT NULL COMMENT 'Fecha Inicial del Periodo',
    act_fin DATE NOT NULL COMMENT 'Fecha Final del Periodo',
    act_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Generación',
    act_observacion TEXT NULL COMMENT 'Observaciones del Acta',
    act_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de Actualización',
    PRIMARY KEY (act_id),
    UNIQUE KEY uk_acta_folio (act_folio),
    CONSTRAINT fk_acta_sistema FOREIGN KEY (act_fksistema) REFERENCES sistema (sis_id),
    CONSTRAINT fk_acta_area FOREIGN KEY (act_fkarea) REFERENCES area (are_id),
    CONSTRAINT fk_acta_usuario FOREIGN KEY (act_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT fk_acta_situacion FOREIGN KEY (act_fksituacion) REFERENCES situacion (sit_id),
    CONSTRAINT chk_acta_periodo CHECK (DATEDIFF(act_fin, act_inicio) = 6)
) ENGINE=InnoDB COMMENT='Actas Semanales';

CREATE TABLE inclusion (
    inc_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la Inclusión',
    inc_fkacta INT(11) NOT NULL COMMENT 'Acta Relacionada',
    inc_fkticket INT(11) NOT NULL COMMENT 'Ticket Incluido',
    inc_fkatencion INT(11) NOT NULL COMMENT 'Ciclo Documentado',
    inc_inicio DATETIME NOT NULL COMMENT 'Inicio Histórico de Atención',
    inc_fin DATETIME NOT NULL COMMENT 'Término Histórico de Atención',
    inc_responsable VARCHAR(200) NULL COMMENT 'Nombre del Validador; NULL si Aún no Valida',
    inc_desarrolladores TEXT NOT NULL COMMENT 'Lista JSON Histórica de Participantes',
    inc_evidencias TEXT NOT NULL COMMENT 'Lista JSON Histórica de Evidencias y Referencias',
    inc_problema TEXT NOT NULL COMMENT 'Resumen del Problema',
    inc_solucion TEXT NOT NULL COMMENT 'Resumen de la Solución',
    inc_calificacion INT(11) NULL COMMENT 'Calificación Registrada',
    PRIMARY KEY (inc_id),
    UNIQUE KEY uk_inclusion_acta_ciclo (inc_fkacta, inc_fkatencion),
    UNIQUE KEY uk_inclusion_ciclo (inc_fkatencion),
    CONSTRAINT fk_inclusion_atencion FOREIGN KEY (inc_fkatencion, inc_fkticket) REFERENCES atencion (ate_id, ate_fkticket),
    CONSTRAINT chk_inclusion_fechas CHECK (inc_inicio <= inc_fin),
    CONSTRAINT chk_inclusion_snapshot CHECK (JSON_VALID(inc_desarrolladores) AND JSON_VALID(inc_evidencias) AND JSON_TYPE(inc_desarrolladores) = 'ARRAY' AND JSON_TYPE(inc_evidencias) = 'ARRAY'),
    CONSTRAINT fk_inclusion_acta FOREIGN KEY (inc_fkacta) REFERENCES acta (act_id),
    CONSTRAINT fk_inclusion_ticket FOREIGN KEY (inc_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT chk_inclusion_calificacion CHECK (inc_calificacion BETWEEN 1 AND 5)
) ENGINE=InnoDB COMMENT='Tickets Incluidos en Actas';

CREATE TABLE archivo (
    arc_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del Archivo',
    arc_fkacta INT(11) NOT NULL COMMENT 'Acta Relacionada',
    arc_fkclase INT(11) NOT NULL COMMENT 'Clase de Archivo',
    arc_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Cargó el Archivo',
    arc_nombre VARCHAR(200) NOT NULL COMMENT 'Nombre Original del Archivo',
    arc_ruta TEXT NOT NULL COMMENT 'Ruta del Archivo',
    arc_formato VARCHAR(200) NOT NULL COMMENT 'Formato del Archivo',
    arc_tamano INT(11) NOT NULL COMMENT 'Tamaño del Archivo en Bytes',
    arc_observacion TEXT NULL COMMENT 'Observaciones del Archivo',
    arc_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de Carga',
    PRIMARY KEY (arc_id),
    CONSTRAINT chk_archivo_tamano CHECK (arc_tamano > 0),
    CONSTRAINT chk_archivo_formato CHECK (arc_formato IN ('jpg', 'jpeg', 'png', 'webp', 'pdf')),
    CONSTRAINT fk_archivo_acta FOREIGN KEY (arc_fkacta) REFERENCES acta (act_id),
    CONSTRAINT fk_archivo_clase FOREIGN KEY (arc_fkclase) REFERENCES clase (cla_id),
    CONSTRAINT fk_archivo_usuario FOREIGN KEY (arc_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT chk_archivo_video CHECK (
        LOWER(arc_formato) NOT IN ('mp4', 'video/mp4') OR arc_tamano <= 31457280
    )
) ENGINE=InnoDB COMMENT='Archivos de Actas';

INSERT INTO estado (est_id, est_codigo, est_nombre) VALUES
(1, 'ACTIVO', 'Activo'),
(2, 'INACTIVO', 'Inactivo'),
(3, 'MANTENIMIENTO', 'Mantenimiento');

INSERT INTO fase (fas_id, fas_codigo, fas_nombre) VALUES
(1, 'REGISTRADO', 'Registrado'),
(2, 'ASIGNADO', 'Asignado'),
(3, 'EN_PROCESO', 'En Proceso'),
(4, 'EN_ESPERA_DE_INFORMACION', 'En Espera de Información'),
(5, 'RESUELTO_POR_DESARROLLO', 'Resuelto por Desarrollo'),
(6, 'CERRADO_POR_RESPONSABLE', 'Cerrado por Responsable'),
(7, 'REABIERTO', 'Reabierto'),
(8, 'CANCELADO', 'Cancelado');

INSERT INTO constancia (con_id, con_codigo, con_nombre) VALUES
(1, 'NO_APLICA', 'No Aplica'),
(2, 'PENDIENTE_DE_ACTA', 'Pendiente de Acta'),
(3, 'EN_ACTA_GENERADA', 'En Acta Generada'),
(4, 'ACTA_FIRMADA_CARGADA', 'Acta Firmada Cargada');

INSERT INTO situacion (sit_id, sit_codigo, sit_nombre) VALUES
(1, 'GENERADA', 'Generada'),
(2, 'PENDIENTE_DE_FIRMA', 'Pendiente de Firma'),
(3, 'CARGADA', 'Cargada'),
(4, 'OBSERVADA', 'Observada');

INSERT INTO prioridad (pri_id, pri_codigo, pri_nombre) VALUES
(1, 'BAJA', 'Baja'),
(2, 'MEDIA', 'Media'),
(3, 'ALTA', 'Alta'),
(4, 'CRITICA', 'Crítica');

INSERT INTO solicitud (sol_id, sol_codigo, sol_nombre) VALUES
(1, 'ERROR', 'Error'),
(2, 'AJUSTE_DE_INFORMACION', 'Ajuste de Información'),
(3, 'MEJORA', 'Mejora'),
(4, 'NUEVA_FUNCIONALIDAD', 'Nueva Funcionalidad'),
(5, 'CAMBIO_SOLICITADO', 'Cambio Solicitado'),
(6, 'INCIDENTE', 'Incidente'),
(7, 'SOPORTE_OPERATIVO', 'Soporte Operativo');

INSERT INTO rol (rol_id, rol_codigo, rol_nombre) VALUES
(1, 'ADMINISTRADOR', 'Administrador'),
(2, 'RESPONSABLE_DE_SISTEMA', 'Responsable de Sistema'),
(3, 'DESARROLLADOR', 'Desarrollador'),
(4, 'JEFE_DE_AREA', 'Jefe de Área'),
(5, 'CONSULTA', 'Consulta');

INSERT INTO clase (cla_id, cla_codigo, cla_nombre) VALUES
(1, 'EVIDENCIA_INICIAL', 'Evidencia Inicial'),
(2, 'EVIDENCIA_FINAL', 'Evidencia Final'),
(3, 'EVIDENCIA_DE_REAPERTURA', 'Evidencia de Reapertura'),
(4, 'EVIDENCIA_DE_SEGUIMIENTO', 'Evidencia de Seguimiento'),
(5, 'ACTA_GENERADA', 'Acta Generada'),
(6, 'ACTA_FIRMADA', 'Acta Firmada'),
(7, 'ANEXO', 'Anexo');


ALTER TABLE evidencia ADD CONSTRAINT fk_evidencia_reapertura
    FOREIGN KEY (evi_fkreapertura, evi_fkticket) REFERENCES reapertura (rea_id, rea_fkticket);

CREATE TABLE reasignacion (
    rea_id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de Reasignación',
    rea_fkticket INT(11) NOT NULL COMMENT 'Ticket Reasignado',
    rea_fkasignacion_origen INT(11) NOT NULL COMMENT 'Asignación Finalizada',
    rea_fkasignacion_destino INT(11) NOT NULL COMMENT 'Nueva Asignación',
    rea_fkasignacion_previa INT(11) NULL COMMENT 'Participación Previa del Destinatario si Ya Colaboraba',
    rea_fkusuario INT(11) NOT NULL COMMENT 'Usuario que Reasigna',
    rea_motivo TEXT NOT NULL COMMENT 'Motivo del Cambio',
    rea_fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del Cambio',
    PRIMARY KEY (rea_id),
    UNIQUE KEY uk_reasignacion_origen (rea_fkasignacion_origen),
    UNIQUE KEY uk_reasignacion_destino (rea_fkasignacion_destino),
    CONSTRAINT fk_reasignacion_ticket FOREIGN KEY (rea_fkticket) REFERENCES ticket (tic_id),
    CONSTRAINT fk_reasignacion_origen FOREIGN KEY (rea_fkasignacion_origen, rea_fkticket) REFERENCES asignacion (asi_id, asi_fkticket),
    CONSTRAINT fk_reasignacion_destino FOREIGN KEY (rea_fkasignacion_destino, rea_fkticket) REFERENCES asignacion (asi_id, asi_fkticket),
    CONSTRAINT fk_reasignacion_previa FOREIGN KEY (rea_fkasignacion_previa, rea_fkticket) REFERENCES asignacion (asi_id, asi_fkticket),
    CONSTRAINT fk_reasignacion_usuario FOREIGN KEY (rea_fkusuario) REFERENCES usuario (usu_id),
    CONSTRAINT chk_reasignacion_distinta CHECK (rea_fkasignacion_origen <> rea_fkasignacion_destino),
    CONSTRAINT chk_reasignacion_motivo CHECK (CHAR_LENGTH(TRIM(rea_motivo)) > 0)
) ENGINE=InnoDB COMMENT='Historial de Reasignaciones de Tickets';

CREATE INDEX ix_ticket_sistema_fase_fecha ON ticket (tic_fksistema, tic_fkfase, tic_registro);
CREATE INDEX ix_ticket_area_fase ON ticket (tic_fkarea, tic_fkfase);
CREATE INDEX ix_transicion_ticket_fecha ON transicion (tra_fkticket, tra_fecha);
CREATE INDEX ix_acta_sistema_periodo ON acta (act_fksistema, act_inicio, act_fin);
CREATE INDEX ix_acta_situacion ON acta (act_fksituacion, act_generacion);

DELIMITER $$

-- Estas funciones comprueban membresía vigente y rol; el actor proviene de la sesión del backend.
CREATE FUNCTION sisat_tiene_rol(p_usuario INT, p_rol VARCHAR(50)) RETURNS TINYINT
READS SQL DATA
BEGIN
    RETURN EXISTS (SELECT 1 FROM perfil p JOIN rol r ON r.rol_id = p.per_fkrol
        JOIN usuario u ON u.usu_id = p.per_fkusuario
        WHERE u.usu_id = p_usuario AND u.usu_fkestado = 1 AND r.rol_codigo = p_rol);
END$$

CREATE FUNCTION sisat_es_responsable(p_usuario INT, p_sistema INT) RETURNS TINYINT
READS SQL DATA
BEGIN
    RETURN sisat_tiene_rol(p_usuario, 'RESPONSABLE_DE_SISTEMA') AND EXISTS (
        SELECT 1 FROM responsable WHERE res_fkusuario = p_usuario
        AND res_fksistema = p_sistema AND res_fkestado = 1
        AND res_fin IS NULL AND res_inicio <= CURRENT_TIMESTAMP);
END$$

CREATE FUNCTION sisat_es_desarrollador(p_usuario INT, p_sistema INT) RETURNS TINYINT
READS SQL DATA
BEGIN
    RETURN sisat_tiene_rol(p_usuario, 'DESARROLLADOR') AND EXISTS (
        SELECT 1 FROM desarrollador WHERE des_fkusuario = p_usuario
        AND des_fksistema = p_sistema AND des_fkestado = 1
        AND des_fin IS NULL AND des_inicio <= CURRENT_TIMESTAMP);
END$$

CREATE TRIGGER bi_ticket_validar BEFORE INSERT ON ticket
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM responsable WHERE res_fksistema = NEW.tic_fksistema AND res_principal = 1 AND res_fin IS NULL AND res_inicio <= CURRENT_TIMESTAMP) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El sistema requiere un responsable principal vigente';
    END IF;
    IF NOT sisat_es_responsable(NEW.tic_fkusuario, NEW.tic_fksistema) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo un responsable vigente del sistema puede registrar tickets';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM sistema WHERE sis_id = NEW.tic_fksistema AND sis_fkarea = NEW.tic_fkarea AND sis_fkestado <> 2) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sistema inactivo o área incorrecta';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM fase WHERE fas_id = NEW.tic_fkfase AND fas_codigo = 'REGISTRADO') OR NOT EXISTS (SELECT 1 FROM constancia WHERE con_id = NEW.tic_fkconstancia AND con_codigo = 'NO_APLICA') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ticket debe iniciar registrado y sin acta aplicable';
    END IF;

END$$

CREATE TRIGGER bi_responsable_validar BEFORE INSERT ON responsable
FOR EACH ROW
BEGIN
    IF NEW.res_fin IS NULL AND NOT sisat_tiene_rol(NEW.res_fkusuario, 'RESPONSABLE_DE_SISTEMA') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario debe estar activo y tener el rol correspondiente';
    END IF;

END$$

CREATE TRIGGER bu_responsable_validar BEFORE UPDATE ON responsable
FOR EACH ROW
BEGIN
    IF NEW.res_fkusuario <> OLD.res_fkusuario OR NEW.res_fksistema <> OLD.res_fksistema OR NEW.res_inicio <> OLD.res_inicio OR OLD.res_fin IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conserve la asignación histórica y cree una nueva vigencia';
    END IF;
    IF NEW.res_fin IS NULL AND NOT sisat_tiene_rol(NEW.res_fkusuario, 'RESPONSABLE_DE_SISTEMA') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario debe estar activo y tener el rol correspondiente';
    END IF;

END$$

CREATE TRIGGER bi_desarrollador_validar BEFORE INSERT ON desarrollador
FOR EACH ROW
BEGIN
    IF NEW.des_fin IS NULL AND NOT sisat_tiene_rol(NEW.des_fkusuario, 'DESARROLLADOR') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario debe estar activo y tener el rol correspondiente';
    END IF;

END$$

CREATE TRIGGER bu_desarrollador_validar BEFORE UPDATE ON desarrollador
FOR EACH ROW
BEGIN
    IF NEW.des_fkusuario <> OLD.des_fkusuario OR NEW.des_fksistema <> OLD.des_fksistema OR NEW.des_inicio <> OLD.des_inicio OR OLD.des_fin IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conserve la asignación histórica y cree una nueva vigencia';
    END IF;
    IF NEW.des_fin IS NULL AND NOT sisat_tiene_rol(NEW.des_fkusuario, 'DESARROLLADOR') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario debe estar activo y tener el rol correspondiente';
    END IF;

END$$

CREATE TRIGGER bi_asignacion_validar BEFORE INSERT ON asignacion
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ticket t WHERE t.tic_id = NEW.asi_fkticket AND sisat_es_desarrollador(NEW.asi_fkusuario, t.tic_fksistema)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El destinatario debe ser desarrollador vigente del sistema';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM ticket t WHERE t.tic_id = NEW.asi_fkticket AND (sisat_tiene_rol(NEW.asi_fkusuario_asigna, 'ADMINISTRADOR') OR sisat_es_responsable(NEW.asi_fkusuario_asigna, t.tic_fksistema))) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo administrador o responsable del sistema puede asignar';
    END IF;

END$$

CREATE TRIGGER bu_asignacion_validar BEFORE UPDATE ON asignacion
FOR EACH ROW
BEGIN
    IF NEW.asi_fkusuario <> OLD.asi_fkusuario OR NEW.asi_fkticket <> OLD.asi_fkticket OR NEW.asi_fecha <> OLD.asi_fecha OR NEW.asi_fkusuario_asigna <> OLD.asi_fkusuario_asigna OR NEW.asi_principal <> OLD.asi_principal OR OLD.asi_fin IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No sobrescriba asignaciones; finalice la vigente y cree otra';
    END IF;

END$$

CREATE TRIGGER bi_termino_validar BEFORE INSERT ON termino
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM atencion a JOIN asignacion x ON x.asi_fkticket = a.ate_fkticket JOIN ticket t ON t.tic_id = a.ate_fkticket WHERE a.ate_id = NEW.ter_fkatencion AND x.asi_fkusuario = NEW.ter_fkusuario AND x.asi_fin IS NULL AND x.asi_fecha <= NEW.ter_fecha AND sisat_es_desarrollador(NEW.ter_fkusuario, t.tic_fksistema) AND a.ate_inicio <= NEW.ter_fecha AND CHAR_LENGTH(TRIM(COALESCE(a.ate_diagnostico,''))) > 0 AND CHAR_LENGTH(TRIM(COALESCE(a.ate_solucion,''))) > 0) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Término inválido: revise técnico asignado, fechas, diagnóstico y solución';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM evidencia e JOIN clase c ON c.cla_id = e.evi_fkclase WHERE e.evi_fkatencion = NEW.ter_fkatencion AND c.cla_codigo = 'EVIDENCIA_FINAL') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La resolución requiere evidencia final del ciclo';
    END IF;

END$$

CREATE TRIGGER bu_atencion_validar BEFORE UPDATE ON atencion
FOR EACH ROW
BEGIN
    IF NEW.ate_fkticket <> OLD.ate_fkticket OR NEW.ate_ciclo <> OLD.ate_ciclo OR EXISTS (SELECT 1 FROM termino WHERE ter_fkatencion = OLD.ate_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede cambiar la identidad ni editar un ciclo finalizado';
    END IF;

END$$

CREATE TRIGGER bi_evaluacion_validar BEFORE INSERT ON evaluacion
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ticket t WHERE t.tic_id = NEW.eva_fkticket AND sisat_es_responsable(NEW.eva_fkusuario, t.tic_fksistema)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo el responsable vigente puede evaluar';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM termino WHERE ter_fkatencion = NEW.eva_fkatencion AND ter_fecha <= NEW.eva_fecha) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo puede evaluarse una atención terminada';
    END IF;

END$$

CREATE TRIGGER bi_cierre_validar BEFORE INSERT ON cierre
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ticket t WHERE t.tic_id = NEW.cie_fkticket AND sisat_es_responsable(NEW.cie_fkusuario, t.tic_fksistema)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo el responsable vigente puede cerrar';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM termino WHERE ter_fkatencion = NEW.cie_fkatencion AND ter_fecha <= NEW.cie_fecha) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo puede cerrarse una atención terminada';
    END IF;
    IF EXISTS (SELECT 1 FROM atencion a JOIN atencion b ON b.ate_fkticket = a.ate_fkticket AND b.ate_ciclo > a.ate_ciclo WHERE a.ate_id = NEW.cie_fkatencion) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo puede cerrarse el último ciclo';
    END IF;

END$$

CREATE TRIGGER bi_reapertura_validar BEFORE INSERT ON reapertura
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ticket t JOIN fase f ON f.fas_id = t.tic_fkfase WHERE t.tic_id = NEW.rea_fkticket AND sisat_es_responsable(NEW.rea_fkusuario, t.tic_fksistema) AND f.fas_codigo IN ('RESUELTO_POR_DESARROLLO', 'CERRADO_POR_RESPONSABLE')) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo responsable vigente puede reabrir tickets resueltos o cerrados';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM atencion a JOIN atencion b ON b.ate_fkticket = a.ate_fkticket AND b.ate_ciclo = a.ate_ciclo + 1 JOIN termino z ON z.ter_fkatencion = a.ate_id WHERE a.ate_id = NEW.rea_fkatencion_origen AND b.ate_id = NEW.rea_fkatencion_destino AND z.ter_fecha <= NEW.rea_fecha AND b.ate_inicio >= z.ter_fecha) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La reapertura debe enlazar ciclos consecutivos y una resolución previa';
    END IF;
    IF CHAR_LENGTH(TRIM(NEW.rea_motivo)) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La reapertura requiere motivo';
    END IF;

END$$

CREATE TRIGGER bi_evidencia_validar BEFORE INSERT ON evidencia
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM clase c WHERE c.cla_id = NEW.evi_fkclase AND ((c.cla_codigo = 'EVIDENCIA_INICIAL' AND NEW.evi_fkatencion IS NULL AND NEW.evi_fkreapertura IS NULL) OR (c.cla_codigo = 'EVIDENCIA_FINAL' AND NEW.evi_fkatencion IS NOT NULL AND NEW.evi_fkreapertura IS NULL) OR (c.cla_codigo = 'EVIDENCIA_DE_REAPERTURA' AND NEW.evi_fkreapertura IS NOT NULL AND NEW.evi_fkatencion IS NULL) OR c.cla_codigo IN ('EVIDENCIA_DE_SEGUIMIENTO', 'ANEXO'))) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clase de evidencia o vínculo con ciclo/reapertura incorrecto';
    END IF;

END$$

CREATE TRIGGER bu_termino_validar BEFORE UPDATE ON termino
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_termino_validar BEFORE DELETE ON termino
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_evaluacion_validar BEFORE UPDATE ON evaluacion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_evaluacion_validar BEFORE DELETE ON evaluacion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_cierre_validar BEFORE UPDATE ON cierre
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_cierre_validar BEFORE DELETE ON cierre
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_reapertura_validar BEFORE UPDATE ON reapertura
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_reapertura_validar BEFORE DELETE ON reapertura
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_reasignacion_validar BEFORE UPDATE ON reasignacion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_reasignacion_validar BEFORE DELETE ON reasignacion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_transicion_validar BEFORE UPDATE ON transicion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_transicion_validar BEFORE DELETE ON transicion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_movimiento_validar BEFORE UPDATE ON movimiento
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_movimiento_validar BEFORE DELETE ON movimiento
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_inclusion_validar BEFORE UPDATE ON inclusion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_inclusion_validar BEFORE DELETE ON inclusion
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_evidencia_validar BEFORE UPDATE ON evidencia
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_evidencia_validar BEFORE DELETE ON evidencia
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bu_archivo_validar BEFORE UPDATE ON archivo
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite sobrescribirlo';
END$$

CREATE TRIGGER bd_archivo_validar BEFORE DELETE ON archivo
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Registro histórico: no se permite eliminarlo';
END$$

CREATE TRIGGER bi_acta_validar BEFORE INSERT ON acta
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sistema s JOIN usuario u ON u.usu_id = NEW.act_fkusuario WHERE s.sis_id = NEW.act_fksistema AND s.sis_fkarea = NEW.act_fkarea AND u.usu_fkarea = NEW.act_fkarea AND sisat_tiene_rol(u.usu_id, 'JEFE_DE_AREA')) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El acta requiere sistema, área y jefe de área correspondientes';
    END IF;
    SET NEW.act_sistema = (SELECT sis_nombre FROM sistema WHERE sis_id = NEW.act_fksistema);
    SET NEW.act_area = (SELECT are_nombre FROM area WHERE are_id = NEW.act_fkarea);
    SET NEW.act_firmante = (SELECT CONCAT(usu_nombre, ' ', usu_apellido) FROM usuario WHERE usu_id = NEW.act_fkusuario);

END$$

CREATE TRIGGER bu_acta_validar BEFORE UPDATE ON acta
FOR EACH ROW
BEGIN
    IF NEW.act_fksistema <> OLD.act_fksistema OR NEW.act_fkarea <> OLD.act_fkarea OR NEW.act_fkusuario <> OLD.act_fkusuario OR NEW.act_folio <> OLD.act_folio OR NEW.act_inicio <> OLD.act_inicio OR NEW.act_fin <> OLD.act_fin OR NEW.act_generacion <> OLD.act_generacion OR NEW.act_sistema <> OLD.act_sistema OR NEW.act_area <> OLD.act_area OR NEW.act_firmante <> OLD.act_firmante THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No modifique el encabezado histórico del acta';
    END IF;
    IF EXISTS (SELECT 1 FROM situacion WHERE sit_id = NEW.act_fksituacion AND sit_codigo = 'CARGADA') AND NOT EXISTS (SELECT 1 FROM archivo a JOIN clase c ON c.cla_id = a.arc_fkclase WHERE a.arc_fkacta = NEW.act_id AND c.cla_codigo = 'ACTA_FIRMADA') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe archivo firmado para marcar el acta cargada';
    END IF;

END$$

CREATE TRIGGER bi_inclusion_validar BEFORE INSERT ON inclusion
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM atencion a JOIN termino z ON z.ter_fkatencion = a.ate_id JOIN ticket t ON t.tic_id = a.ate_fkticket JOIN fase f ON f.fas_id = t.tic_fkfase JOIN acta ac ON ac.act_id = NEW.inc_fkacta LEFT JOIN cierre ci ON ci.cie_fkatencion = a.ate_id WHERE a.ate_id = NEW.inc_fkatencion AND a.ate_fkticket = NEW.inc_fkticket AND t.tic_fksistema = ac.act_fksistema AND f.fas_codigo IN ('RESUELTO_POR_DESARROLLO', 'CERRADO_POR_RESPONSABLE') AND (DATE(z.ter_fecha) BETWEEN ac.act_inicio AND ac.act_fin OR DATE(ci.cie_fecha) BETWEEN ac.act_inicio AND ac.act_fin) AND NOT EXISTS (SELECT 1 FROM atencion b WHERE b.ate_fkticket = a.ate_fkticket AND b.ate_ciclo > a.ate_ciclo)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ciclo no es elegible: revise sistema, fase, periodo y último ciclo';
    END IF;
    SET NEW.inc_inicio = (SELECT ate_inicio FROM atencion WHERE ate_id = NEW.inc_fkatencion);
    SET NEW.inc_fin = (SELECT ter_fecha FROM termino WHERE ter_fkatencion = NEW.inc_fkatencion);
    SET NEW.inc_calificacion = (SELECT eva_calificacion FROM evaluacion WHERE eva_fkatencion = NEW.inc_fkatencion);
    SET NEW.inc_responsable = (SELECT CONCAT(u.usu_nombre, ' ', u.usu_apellido) FROM usuario u
        WHERE u.usu_id = COALESCE((SELECT cie_fkusuario FROM cierre WHERE cie_fkatencion = NEW.inc_fkatencion),
        (SELECT eva_fkusuario FROM evaluacion WHERE eva_fkatencion = NEW.inc_fkatencion)));

END$$

CREATE TRIGGER bi_archivo_validar BEFORE INSERT ON archivo
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM clase WHERE cla_id = NEW.arc_fkclase AND cla_codigo IN ('ACTA_GENERADA', 'ACTA_FIRMADA', 'ANEXO')) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clase de archivo de acta incorrecta';
    END IF;

END$$

-- Usar fuera de una transacción del llamador: este procedimiento controla su transacción.
CREATE PROCEDURE sisat_reasignar_ticket(
    IN p_ticket INT, IN p_usuario_origen INT, IN p_usuario_destino INT,
    IN p_actor INT, IN p_motivo TEXT
)
MODIFIES SQL DATA
BEGIN
    DECLARE v_sistema INT DEFAULT NULL;
    DECLARE v_fase VARCHAR(50);
    DECLARE v_origen INT DEFAULT NULL;
    DECLARE v_destino INT;
    DECLARE v_previa INT DEFAULT NULL;
    DECLARE v_principal_previo TINYINT DEFAULT 0;
    DECLARE v_principal TINYINT;
    DECLARE v_fecha DATETIME;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
    SET v_fecha = CURRENT_TIMESTAMP;
    SELECT t.tic_fksistema, f.fas_codigo INTO v_sistema, v_fase
        FROM ticket t JOIN fase f ON f.fas_id = t.tic_fkfase
        WHERE t.tic_id = p_ticket FOR UPDATE;
    IF v_sistema IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ticket no existe';
    END IF;
    IF p_motivo IS NULL OR CHAR_LENGTH(TRIM(p_motivo)) = 0 OR p_usuario_origen = p_usuario_destino THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Seleccione otra persona e indique el motivo';
    END IF;
    IF NOT (sisat_tiene_rol(p_actor, 'ADMINISTRADOR') OR sisat_es_responsable(p_actor, v_sistema)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario sin permiso para reasignar';
    END IF;
    IF v_fase NOT IN ('ASIGNADO', 'EN_PROCESO', 'EN_ESPERA_DE_INFORMACION', 'REABIERTO') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ticket debe estar en atención; reabra si está resuelto o cerrado';
    END IF;
    IF NOT sisat_es_desarrollador(p_usuario_destino, v_sistema) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El destinatario no es desarrollador vigente del sistema';
    END IF;
    SELECT asi_id, asi_principal INTO v_origen, v_principal FROM asignacion
        WHERE asi_fkticket = p_ticket AND asi_fkusuario = p_usuario_origen AND asi_fin IS NULL FOR UPDATE;
    IF v_origen IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La persona de origen no tiene una asignación vigente';
    END IF;
    SELECT asi_id, asi_principal INTO v_previa, v_principal_previo FROM asignacion
        WHERE asi_fkticket = p_ticket AND asi_fkusuario = p_usuario_destino AND asi_fin IS NULL FOR UPDATE;
    IF v_previa IS NOT NULL THEN
        UPDATE asignacion SET asi_fin = v_fecha, asi_fkestado = 2 WHERE asi_id = v_previa;
        SET v_principal = GREATEST(v_principal, v_principal_previo);
    END IF;
    UPDATE asignacion SET asi_fin = v_fecha, asi_fkestado = 2 WHERE asi_id = v_origen;
    INSERT INTO asignacion (asi_fkticket, asi_fkusuario, asi_fkestado, asi_fkusuario_asigna, asi_principal, asi_fecha)
        VALUES (p_ticket, p_usuario_destino, 1, p_actor, v_principal, v_fecha);
    SET v_destino = LAST_INSERT_ID();
    INSERT INTO reasignacion (rea_fkticket, rea_fkasignacion_origen, rea_fkasignacion_destino, rea_fkasignacion_previa, rea_fkusuario, rea_motivo, rea_fecha)
        VALUES (p_ticket, v_origen, v_destino, v_previa, p_actor, p_motivo, v_fecha);
    UPDATE ticket SET tic_actualizacion = v_fecha WHERE tic_id = p_ticket;
    COMMIT;
    SELECT v_origen AS asignacion_anterior, v_destino AS asignacion_nueva;
END$$

CREATE TRIGGER bd_asignacion_historial BEFORE DELETE ON asignacion
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Finalice la asignación; no elimine su historial'$$
CREATE TRIGGER bd_responsable_historial BEFORE DELETE ON responsable
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Finalice la vigencia; no elimine su historial'$$
CREATE TRIGGER bd_desarrollador_historial BEFORE DELETE ON desarrollador
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Finalice la vigencia; no elimine su historial'$$
DELIMITER ;
