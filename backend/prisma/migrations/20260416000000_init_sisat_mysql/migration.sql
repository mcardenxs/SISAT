-- CreateTable
CREATE TABLE `acta` (
    `act_id` INTEGER NOT NULL AUTO_INCREMENT,
    `act_fksistema` INTEGER NOT NULL,
    `act_fkarea` INTEGER NOT NULL,
    `act_fkusuario` INTEGER NOT NULL,
    `act_fksituacion` INTEGER NOT NULL,
    `act_sistema` VARCHAR(200) NOT NULL,
    `act_area` VARCHAR(200) NOT NULL,
    `act_firmante` VARCHAR(200) NOT NULL,
    `act_folio` VARCHAR(200) NOT NULL,
    `act_inicio` DATE NOT NULL,
    `act_fin` DATE NOT NULL,
    `act_generacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `act_observacion` TEXT NULL,
    `act_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_acta_folio`(`act_folio`),
    INDEX `fk_acta_area`(`act_fkarea`),
    INDEX `fk_acta_usuario`(`act_fkusuario`),
    INDEX `ix_acta_sistema_periodo`(`act_fksistema`, `act_inicio`, `act_fin`),
    INDEX `ix_acta_situacion`(`act_fksituacion`, `act_generacion`),
    PRIMARY KEY (`act_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archivo` (
    `arc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `arc_fkacta` INTEGER NOT NULL,
    `arc_fkclase` INTEGER NOT NULL,
    `arc_fkusuario` INTEGER NOT NULL,
    `arc_nombre` VARCHAR(200) NOT NULL,
    `arc_ruta` TEXT NOT NULL,
    `arc_formato` VARCHAR(200) NOT NULL,
    `arc_tamano` INTEGER NOT NULL,
    `arc_observacion` TEXT NULL,
    `arc_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_archivo_acta`(`arc_fkacta`),
    INDEX `fk_archivo_clase`(`arc_fkclase`),
    INDEX `fk_archivo_usuario`(`arc_fkusuario`),
    PRIMARY KEY (`arc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `are_id` INTEGER NOT NULL AUTO_INCREMENT,
    `are_nombre` VARCHAR(200) NOT NULL,
    `are_descripcion` TEXT NULL,
    `are_fkestado` INTEGER NOT NULL,
    `are_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_area_nombre`(`are_nombre`),
    INDEX `fk_area_estado`(`are_fkestado`),
    PRIMARY KEY (`are_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignacion` (
    `asi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asi_fkticket` INTEGER NOT NULL,
    `asi_fkusuario` INTEGER NOT NULL,
    `asi_fkestado` INTEGER NOT NULL,
    `asi_fkusuario_asigna` INTEGER NOT NULL,
    `asi_principal` BOOLEAN NOT NULL,
    `asi_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `asi_fin` DATETIME(0) NULL,
    `asi_usuario_vigente` INTEGER NULL,
    `asi_principal_vigente` INTEGER NULL,

    UNIQUE INDEX `uk_asignacion_principal`(`asi_principal_vigente`),
    INDEX `fk_asignacion_estado`(`asi_fkestado`),
    INDEX `fk_asignacion_usuario`(`asi_fkusuario`),
    INDEX `fk_asignacion_usuario_asigna`(`asi_fkusuario_asigna`),
    UNIQUE INDEX `uk_asignacion_id_ticket`(`asi_id`, `asi_fkticket`),
    UNIQUE INDEX `uk_asignacion_ticket_usuario`(`asi_fkticket`, `asi_usuario_vigente`),
    PRIMARY KEY (`asi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `atencion` (
    `ate_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ate_fkticket` INTEGER NOT NULL,
    `ate_ciclo` INTEGER NOT NULL,
    `ate_inicio` DATETIME(0) NOT NULL,
    `ate_diagnostico` TEXT NULL,
    `ate_solucion` TEXT NULL,
    `ate_cambios` TEXT NULL,
    `ate_modulos` TEXT NULL,
    `ate_datos` TEXT NULL,
    `ate_comentarios` TEXT NULL,

    UNIQUE INDEX `uk_atencion_id_ticket`(`ate_id`, `ate_fkticket`),
    UNIQUE INDEX `uk_atencion_ticket_ciclo`(`ate_fkticket`, `ate_ciclo`),
    PRIMARY KEY (`ate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cierre` (
    `cie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cie_fkticket` INTEGER NOT NULL,
    `cie_fkatencion` INTEGER NOT NULL,
    `cie_fkusuario` INTEGER NOT NULL,
    `cie_comentario` TEXT NULL,
    `cie_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_cierre_atencion`(`cie_fkatencion`),
    INDEX `fk_cierre_atencion`(`cie_fkatencion`, `cie_fkticket`),
    INDEX `fk_cierre_ticket`(`cie_fkticket`),
    INDEX `fk_cierre_usuario`(`cie_fkusuario`),
    UNIQUE INDEX `cierre_cie_fkatencion_cie_fkticket_key`(`cie_fkatencion`, `cie_fkticket`),
    PRIMARY KEY (`cie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clase` (
    `cla_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cla_codigo` VARCHAR(50) NOT NULL,
    `cla_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_clase_codigo`(`cla_codigo`),
    UNIQUE INDEX `uk_clase_nombre`(`cla_nombre`),
    PRIMARY KEY (`cla_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `constancia` (
    `con_id` INTEGER NOT NULL AUTO_INCREMENT,
    `con_codigo` VARCHAR(50) NOT NULL,
    `con_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_constancia_codigo`(`con_codigo`),
    UNIQUE INDEX `uk_constancia_nombre`(`con_nombre`),
    PRIMARY KEY (`con_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `desarrollador` (
    `des_id` INTEGER NOT NULL AUTO_INCREMENT,
    `des_fksistema` INTEGER NOT NULL,
    `des_fkusuario` INTEGER NOT NULL,
    `des_fkestado` INTEGER NOT NULL,
    `des_inicio` DATETIME(0) NOT NULL,
    `des_fin` DATETIME(0) NULL,
    `des_usuario_vigente` INTEGER NULL,

    INDEX `fk_desarrollador_estado`(`des_fkestado`),
    INDEX `fk_desarrollador_usuario`(`des_fkusuario`),
    UNIQUE INDEX `uk_desarrollador_sistema_usuario`(`des_fksistema`, `des_usuario_vigente`),
    PRIMARY KEY (`des_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado` (
    `est_id` INTEGER NOT NULL AUTO_INCREMENT,
    `est_codigo` VARCHAR(50) NOT NULL,
    `est_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_estado_codigo`(`est_codigo`),
    UNIQUE INDEX `uk_estado_nombre`(`est_nombre`),
    PRIMARY KEY (`est_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluacion` (
    `eva_id` INTEGER NOT NULL AUTO_INCREMENT,
    `eva_fkticket` INTEGER NOT NULL,
    `eva_fkatencion` INTEGER NOT NULL,
    `eva_fkusuario` INTEGER NOT NULL,
    `eva_calificacion` INTEGER NOT NULL,
    `eva_confirmacion` BOOLEAN NOT NULL,
    `eva_conformidad` TEXT NULL,
    `eva_inconformidad` TEXT NULL,
    `eva_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_evaluacion_atencion`(`eva_fkatencion`),
    INDEX `fk_evaluacion_atencion`(`eva_fkatencion`, `eva_fkticket`),
    INDEX `fk_evaluacion_ticket`(`eva_fkticket`),
    INDEX `fk_evaluacion_usuario`(`eva_fkusuario`),
    UNIQUE INDEX `evaluacion_eva_fkatencion_eva_fkticket_key`(`eva_fkatencion`, `eva_fkticket`),
    PRIMARY KEY (`eva_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia` (
    `evi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `evi_fkticket` INTEGER NOT NULL,
    `evi_fkatencion` INTEGER NULL,
    `evi_fkreapertura` INTEGER NULL,
    `evi_fkclase` INTEGER NOT NULL,
    `evi_fkusuario` INTEGER NOT NULL,
    `evi_nombre` VARCHAR(200) NOT NULL,
    `evi_ruta` TEXT NOT NULL,
    `evi_formato` VARCHAR(20) NOT NULL,
    `evi_tamano` INTEGER NOT NULL,
    `evi_descripcion` TEXT NULL,
    `evi_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_evidencia_atencion`(`evi_fkatencion`, `evi_fkticket`),
    INDEX `fk_evidencia_clase`(`evi_fkclase`),
    INDEX `fk_evidencia_reapertura`(`evi_fkreapertura`, `evi_fkticket`),
    INDEX `fk_evidencia_ticket`(`evi_fkticket`),
    INDEX `fk_evidencia_usuario`(`evi_fkusuario`),
    PRIMARY KEY (`evi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fase` (
    `fas_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fas_codigo` VARCHAR(50) NOT NULL,
    `fas_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_fase_codigo`(`fas_codigo`),
    UNIQUE INDEX `uk_fase_nombre`(`fas_nombre`),
    PRIMARY KEY (`fas_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inclusion` (
    `inc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `inc_fkacta` INTEGER NOT NULL,
    `inc_fkticket` INTEGER NOT NULL,
    `inc_fkatencion` INTEGER NOT NULL,
    `inc_inicio` DATETIME(0) NOT NULL,
    `inc_fin` DATETIME(0) NOT NULL,
    `inc_responsable` VARCHAR(200) NULL,
    `inc_desarrolladores` TEXT NOT NULL,
    `inc_evidencias` TEXT NOT NULL,
    `inc_problema` TEXT NOT NULL,
    `inc_solucion` TEXT NOT NULL,
    `inc_calificacion` INTEGER NULL,

    UNIQUE INDEX `uk_inclusion_ciclo`(`inc_fkatencion`),
    INDEX `fk_inclusion_atencion`(`inc_fkatencion`, `inc_fkticket`),
    INDEX `fk_inclusion_ticket`(`inc_fkticket`),
    UNIQUE INDEX `inclusion_inc_fkatencion_inc_fkticket_key`(`inc_fkatencion`, `inc_fkticket`),
    UNIQUE INDEX `uk_inclusion_acta_ciclo`(`inc_fkacta`, `inc_fkatencion`),
    PRIMARY KEY (`inc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `intervencion` (
    `int_id` INTEGER NOT NULL AUTO_INCREMENT,
    `int_fkatencion` INTEGER NOT NULL,
    `int_fkusuario` INTEGER NOT NULL,
    `int_descripcion` TEXT NOT NULL,
    `int_minutos` INTEGER NOT NULL,
    `int_interno` BOOLEAN NOT NULL,
    `int_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_intervencion_atencion`(`int_fkatencion`),
    INDEX `fk_intervencion_usuario`(`int_fkusuario`),
    PRIMARY KEY (`int_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimiento` (
    `mov_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mov_fkticket` INTEGER NOT NULL,
    `mov_fksistema_origen` INTEGER NOT NULL,
    `mov_fksistema_destino` INTEGER NOT NULL,
    `mov_fkusuario` INTEGER NOT NULL,
    `mov_motivo` TEXT NOT NULL,
    `mov_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_movimiento_sistema_destino`(`mov_fksistema_destino`),
    INDEX `fk_movimiento_sistema_origen`(`mov_fksistema_origen`),
    INDEX `fk_movimiento_ticket`(`mov_fkticket`),
    INDEX `fk_movimiento_usuario`(`mov_fkusuario`),
    PRIMARY KEY (`mov_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil` (
    `per_id` INTEGER NOT NULL AUTO_INCREMENT,
    `per_fkusuario` INTEGER NOT NULL,
    `per_fkrol` INTEGER NOT NULL,

    INDEX `fk_perfil_rol`(`per_fkrol`),
    UNIQUE INDEX `uk_perfil_usuario_rol`(`per_fkusuario`, `per_fkrol`),
    PRIMARY KEY (`per_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prioridad` (
    `pri_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pri_codigo` VARCHAR(50) NOT NULL,
    `pri_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_prioridad_codigo`(`pri_codigo`),
    UNIQUE INDEX `uk_prioridad_nombre`(`pri_nombre`),
    PRIMARY KEY (`pri_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reapertura` (
    `rea_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rea_fkticket` INTEGER NOT NULL,
    `rea_fkatencion_origen` INTEGER NOT NULL,
    `rea_fkatencion_destino` INTEGER NOT NULL,
    `rea_fkusuario` INTEGER NOT NULL,
    `rea_motivo` TEXT NOT NULL,
    `rea_comentario` TEXT NULL,
    `rea_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_reapertura_origen`(`rea_fkatencion_origen`),
    UNIQUE INDEX `uk_reapertura_destino`(`rea_fkatencion_destino`),
    INDEX `fk_reapertura_destino`(`rea_fkatencion_destino`, `rea_fkticket`),
    INDEX `fk_reapertura_origen`(`rea_fkatencion_origen`, `rea_fkticket`),
    INDEX `fk_reapertura_ticket`(`rea_fkticket`),
    INDEX `fk_reapertura_usuario`(`rea_fkusuario`),
    UNIQUE INDEX `reapertura_rea_fkatencion_destino_rea_fkticket_key`(`rea_fkatencion_destino`, `rea_fkticket`),
    UNIQUE INDEX `reapertura_rea_fkatencion_origen_rea_fkticket_key`(`rea_fkatencion_origen`, `rea_fkticket`),
    UNIQUE INDEX `uk_reapertura_id_ticket`(`rea_id`, `rea_fkticket`),
    PRIMARY KEY (`rea_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reasignacion` (
    `rea_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rea_fkticket` INTEGER NOT NULL,
    `rea_fkasignacion_origen` INTEGER NOT NULL,
    `rea_fkasignacion_destino` INTEGER NOT NULL,
    `rea_fkasignacion_previa` INTEGER NULL,
    `rea_fkusuario` INTEGER NOT NULL,
    `rea_motivo` TEXT NOT NULL,
    `rea_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_reasignacion_origen`(`rea_fkasignacion_origen`),
    UNIQUE INDEX `uk_reasignacion_destino`(`rea_fkasignacion_destino`),
    INDEX `fk_reasignacion_destino`(`rea_fkasignacion_destino`, `rea_fkticket`),
    INDEX `fk_reasignacion_origen`(`rea_fkasignacion_origen`, `rea_fkticket`),
    INDEX `fk_reasignacion_previa`(`rea_fkasignacion_previa`, `rea_fkticket`),
    INDEX `fk_reasignacion_ticket`(`rea_fkticket`),
    INDEX `fk_reasignacion_usuario`(`rea_fkusuario`),
    UNIQUE INDEX `reasignacion_rea_fkasignacion_destino_rea_fkticket_key`(`rea_fkasignacion_destino`, `rea_fkticket`),
    UNIQUE INDEX `reasignacion_rea_fkasignacion_origen_rea_fkticket_key`(`rea_fkasignacion_origen`, `rea_fkticket`),
    PRIMARY KEY (`rea_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsable` (
    `res_id` INTEGER NOT NULL AUTO_INCREMENT,
    `res_fksistema` INTEGER NOT NULL,
    `res_fkusuario` INTEGER NOT NULL,
    `res_fkestado` INTEGER NOT NULL,
    `res_principal` BOOLEAN NOT NULL,
    `res_inicio` DATETIME(0) NOT NULL,
    `res_fin` DATETIME(0) NULL,
    `res_usuario_vigente` INTEGER NULL,
    `res_principal_vigente` INTEGER NULL,

    UNIQUE INDEX `uk_responsable_principal`(`res_principal_vigente`),
    INDEX `fk_responsable_estado`(`res_fkestado`),
    INDEX `fk_responsable_usuario`(`res_fkusuario`),
    UNIQUE INDEX `uk_responsable_sistema_usuario`(`res_fksistema`, `res_usuario_vigente`),
    PRIMARY KEY (`res_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `rol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol_codigo` VARCHAR(50) NOT NULL,
    `rol_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_rol_codigo`(`rol_codigo`),
    UNIQUE INDEX `uk_rol_nombre`(`rol_nombre`),
    PRIMARY KEY (`rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sistema` (
    `sis_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sis_fkarea` INTEGER NOT NULL,
    `sis_fkestado` INTEGER NOT NULL,
    `sis_clave` VARCHAR(200) NOT NULL,
    `sis_nombre` VARCHAR(200) NOT NULL,
    `sis_descripcion` TEXT NOT NULL,
    `sis_url` TEXT NULL,
    `sis_observacion` TEXT NULL,
    `sis_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `sis_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_sistema_clave`(`sis_clave`),
    INDEX `fk_sistema_area`(`sis_fkarea`),
    INDEX `fk_sistema_estado`(`sis_fkestado`),
    PRIMARY KEY (`sis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacion` (
    `sit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sit_codigo` VARCHAR(50) NOT NULL,
    `sit_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_situacion_codigo`(`sit_codigo`),
    UNIQUE INDEX `uk_situacion_nombre`(`sit_nombre`),
    PRIMARY KEY (`sit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud` (
    `sol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sol_codigo` VARCHAR(50) NOT NULL,
    `sol_nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `uk_solicitud_codigo`(`sol_codigo`),
    UNIQUE INDEX `uk_solicitud_nombre`(`sol_nombre`),
    PRIMARY KEY (`sol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `termino` (
    `ter_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ter_fkatencion` INTEGER NOT NULL,
    `ter_fkusuario` INTEGER NOT NULL,
    `ter_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_termino_atencion`(`ter_fkatencion`),
    INDEX `fk_termino_usuario`(`ter_fkusuario`),
    PRIMARY KEY (`ter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `tic_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tic_fksistema` INTEGER NOT NULL,
    `tic_fkarea` INTEGER NOT NULL,
    `tic_fkusuario` INTEGER NOT NULL,
    `tic_fkprioridad` INTEGER NOT NULL,
    `tic_fksolicitud` INTEGER NOT NULL,
    `tic_fkfase` INTEGER NOT NULL,
    `tic_fkconstancia` INTEGER NOT NULL,
    `tic_folio` VARCHAR(200) NOT NULL,
    `tic_titulo` VARCHAR(200) NOT NULL,
    `tic_descripcion` TEXT NOT NULL,
    `tic_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `tic_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_ticket_folio`(`tic_folio`),
    INDEX `fk_ticket_constancia`(`tic_fkconstancia`),
    INDEX `fk_ticket_fase`(`tic_fkfase`),
    INDEX `fk_ticket_prioridad`(`tic_fkprioridad`),
    INDEX `fk_ticket_solicitud`(`tic_fksolicitud`),
    INDEX `fk_ticket_usuario`(`tic_fkusuario`),
    INDEX `ix_ticket_area_fase`(`tic_fkarea`, `tic_fkfase`),
    INDEX `ix_ticket_sistema_fase_fecha`(`tic_fksistema`, `tic_fkfase`, `tic_registro`),
    PRIMARY KEY (`tic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transicion` (
    `tra_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tra_fkticket` INTEGER NOT NULL,
    `tra_fkfase_origen` INTEGER NOT NULL,
    `tra_fkfase_destino` INTEGER NOT NULL,
    `tra_fkusuario` INTEGER NOT NULL,
    `tra_comentario` TEXT NULL,
    `tra_fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_transicion_fase_destino`(`tra_fkfase_destino`),
    INDEX `fk_transicion_fase_origen`(`tra_fkfase_origen`),
    INDEX `fk_transicion_usuario`(`tra_fkusuario`),
    INDEX `ix_transicion_ticket_fecha`(`tra_fkticket`, `tra_fecha`),
    PRIMARY KEY (`tra_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `usu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `usu_fkarea` INTEGER NOT NULL,
    `usu_fkestado` INTEGER NOT NULL,
    `usu_nombre` VARCHAR(200) NOT NULL,
    `usu_apellido` VARCHAR(200) NOT NULL,
    `usu_correo` VARCHAR(200) NOT NULL,
    `usu_contrasena` TEXT NOT NULL,
    `usu_puesto` VARCHAR(200) NOT NULL,
    `usu_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `usu_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_usuario_correo`(`usu_correo`),
    INDEX `fk_usuario_area`(`usu_fkarea`),
    INDEX `fk_usuario_estado`(`usu_fkestado`),
    PRIMARY KEY (`usu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `rft_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rft_fkusuario` INTEGER NOT NULL,
    `rft_token_hash` VARCHAR(512) NOT NULL,
    `rft_expiracion` DATETIME(0) NOT NULL,
    `rft_revocado` BOOLEAN NOT NULL DEFAULT false,
    `rft_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uk_refresh_token_hash`(`rft_token_hash`),
    INDEX `fk_refresh_token_usuario`(`rft_fkusuario`),
    PRIMARY KEY (`rft_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `acta` ADD CONSTRAINT `fk_acta_area` FOREIGN KEY (`act_fkarea`) REFERENCES `area`(`are_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `acta` ADD CONSTRAINT `fk_acta_sistema` FOREIGN KEY (`act_fksistema`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `acta` ADD CONSTRAINT `fk_acta_situacion` FOREIGN KEY (`act_fksituacion`) REFERENCES `situacion`(`sit_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `acta` ADD CONSTRAINT `fk_acta_usuario` FOREIGN KEY (`act_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archivo` ADD CONSTRAINT `fk_archivo_acta` FOREIGN KEY (`arc_fkacta`) REFERENCES `acta`(`act_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archivo` ADD CONSTRAINT `fk_archivo_clase` FOREIGN KEY (`arc_fkclase`) REFERENCES `clase`(`cla_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `archivo` ADD CONSTRAINT `fk_archivo_usuario` FOREIGN KEY (`arc_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `area` ADD CONSTRAINT `fk_area_estado` FOREIGN KEY (`are_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asignacion` ADD CONSTRAINT `fk_asignacion_estado` FOREIGN KEY (`asi_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asignacion` ADD CONSTRAINT `fk_asignacion_ticket` FOREIGN KEY (`asi_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asignacion` ADD CONSTRAINT `fk_asignacion_usuario` FOREIGN KEY (`asi_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asignacion` ADD CONSTRAINT `fk_asignacion_usuario_asigna` FOREIGN KEY (`asi_fkusuario_asigna`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `atencion` ADD CONSTRAINT `fk_atencion_ticket` FOREIGN KEY (`ate_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cierre` ADD CONSTRAINT `fk_cierre_atencion` FOREIGN KEY (`cie_fkatencion`, `cie_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cierre` ADD CONSTRAINT `fk_cierre_ticket` FOREIGN KEY (`cie_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cierre` ADD CONSTRAINT `fk_cierre_usuario` FOREIGN KEY (`cie_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `desarrollador` ADD CONSTRAINT `fk_desarrollador_estado` FOREIGN KEY (`des_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `desarrollador` ADD CONSTRAINT `fk_desarrollador_sistema` FOREIGN KEY (`des_fksistema`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `desarrollador` ADD CONSTRAINT `fk_desarrollador_usuario` FOREIGN KEY (`des_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evaluacion` ADD CONSTRAINT `fk_evaluacion_atencion` FOREIGN KEY (`eva_fkatencion`, `eva_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evaluacion` ADD CONSTRAINT `fk_evaluacion_ticket` FOREIGN KEY (`eva_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evaluacion` ADD CONSTRAINT `fk_evaluacion_usuario` FOREIGN KEY (`eva_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `fk_evidencia_atencion` FOREIGN KEY (`evi_fkatencion`, `evi_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `fk_evidencia_clase` FOREIGN KEY (`evi_fkclase`) REFERENCES `clase`(`cla_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `fk_evidencia_reapertura` FOREIGN KEY (`evi_fkreapertura`, `evi_fkticket`) REFERENCES `reapertura`(`rea_id`, `rea_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `fk_evidencia_ticket` FOREIGN KEY (`evi_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `fk_evidencia_usuario` FOREIGN KEY (`evi_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inclusion` ADD CONSTRAINT `fk_inclusion_acta` FOREIGN KEY (`inc_fkacta`) REFERENCES `acta`(`act_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inclusion` ADD CONSTRAINT `fk_inclusion_atencion` FOREIGN KEY (`inc_fkatencion`, `inc_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inclusion` ADD CONSTRAINT `fk_inclusion_ticket` FOREIGN KEY (`inc_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `intervencion` ADD CONSTRAINT `fk_intervencion_atencion` FOREIGN KEY (`int_fkatencion`) REFERENCES `atencion`(`ate_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `intervencion` ADD CONSTRAINT `fk_intervencion_usuario` FOREIGN KEY (`int_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimiento` ADD CONSTRAINT `fk_movimiento_sistema_destino` FOREIGN KEY (`mov_fksistema_destino`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimiento` ADD CONSTRAINT `fk_movimiento_sistema_origen` FOREIGN KEY (`mov_fksistema_origen`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimiento` ADD CONSTRAINT `fk_movimiento_ticket` FOREIGN KEY (`mov_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movimiento` ADD CONSTRAINT `fk_movimiento_usuario` FOREIGN KEY (`mov_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `fk_perfil_rol` FOREIGN KEY (`per_fkrol`) REFERENCES `rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `fk_perfil_usuario` FOREIGN KEY (`per_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reapertura` ADD CONSTRAINT `fk_reapertura_destino` FOREIGN KEY (`rea_fkatencion_destino`, `rea_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reapertura` ADD CONSTRAINT `fk_reapertura_origen` FOREIGN KEY (`rea_fkatencion_origen`, `rea_fkticket`) REFERENCES `atencion`(`ate_id`, `ate_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reapertura` ADD CONSTRAINT `fk_reapertura_ticket` FOREIGN KEY (`rea_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reapertura` ADD CONSTRAINT `fk_reapertura_usuario` FOREIGN KEY (`rea_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reasignacion` ADD CONSTRAINT `fk_reasignacion_destino` FOREIGN KEY (`rea_fkasignacion_destino`, `rea_fkticket`) REFERENCES `asignacion`(`asi_id`, `asi_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reasignacion` ADD CONSTRAINT `fk_reasignacion_origen` FOREIGN KEY (`rea_fkasignacion_origen`, `rea_fkticket`) REFERENCES `asignacion`(`asi_id`, `asi_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reasignacion` ADD CONSTRAINT `fk_reasignacion_previa` FOREIGN KEY (`rea_fkasignacion_previa`, `rea_fkticket`) REFERENCES `asignacion`(`asi_id`, `asi_fkticket`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reasignacion` ADD CONSTRAINT `fk_reasignacion_ticket` FOREIGN KEY (`rea_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reasignacion` ADD CONSTRAINT `fk_reasignacion_usuario` FOREIGN KEY (`rea_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `responsable` ADD CONSTRAINT `fk_responsable_estado` FOREIGN KEY (`res_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `responsable` ADD CONSTRAINT `fk_responsable_sistema` FOREIGN KEY (`res_fksistema`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `responsable` ADD CONSTRAINT `fk_responsable_usuario` FOREIGN KEY (`res_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sistema` ADD CONSTRAINT `fk_sistema_area` FOREIGN KEY (`sis_fkarea`) REFERENCES `area`(`are_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sistema` ADD CONSTRAINT `fk_sistema_estado` FOREIGN KEY (`sis_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `termino` ADD CONSTRAINT `fk_termino_atencion` FOREIGN KEY (`ter_fkatencion`) REFERENCES `atencion`(`ate_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `termino` ADD CONSTRAINT `fk_termino_usuario` FOREIGN KEY (`ter_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_area` FOREIGN KEY (`tic_fkarea`) REFERENCES `area`(`are_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_constancia` FOREIGN KEY (`tic_fkconstancia`) REFERENCES `constancia`(`con_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_fase` FOREIGN KEY (`tic_fkfase`) REFERENCES `fase`(`fas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_prioridad` FOREIGN KEY (`tic_fkprioridad`) REFERENCES `prioridad`(`pri_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_sistema` FOREIGN KEY (`tic_fksistema`) REFERENCES `sistema`(`sis_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_solicitud` FOREIGN KEY (`tic_fksolicitud`) REFERENCES `solicitud`(`sol_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `fk_ticket_usuario` FOREIGN KEY (`tic_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transicion` ADD CONSTRAINT `fk_transicion_fase_destino` FOREIGN KEY (`tra_fkfase_destino`) REFERENCES `fase`(`fas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transicion` ADD CONSTRAINT `fk_transicion_fase_origen` FOREIGN KEY (`tra_fkfase_origen`) REFERENCES `fase`(`fas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transicion` ADD CONSTRAINT `fk_transicion_ticket` FOREIGN KEY (`tra_fkticket`) REFERENCES `ticket`(`tic_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transicion` ADD CONSTRAINT `fk_transicion_usuario` FOREIGN KEY (`tra_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_area` FOREIGN KEY (`usu_fkarea`) REFERENCES `area`(`are_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`usu_fkestado`) REFERENCES `estado`(`est_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `fk_refresh_token_usuario` FOREIGN KEY (`rft_fkusuario`) REFERENCES `usuario`(`usu_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- Seed Initial Catalogs
INSERT INTO `estado` (`est_id`, `est_codigo`, `est_nombre`) VALUES
(1, 'ACTIVO', 'Activo'),
(2, 'INACTIVO', 'Inactivo'),
(3, 'MANTENIMIENTO', 'Mantenimiento');

INSERT INTO `fase` (`fas_id`, `fas_codigo`, `fas_nombre`) VALUES
(1, 'REGISTRADO', 'Registrado'),
(2, 'ASIGNADO', 'Asignado'),
(3, 'EN_PROCESO', 'En Proceso'),
(4, 'EN_ESPERA_DE_INFORMACION', 'En Espera de Información'),
(5, 'RESUELTO_POR_DESARROLLO', 'Resuelto por Desarrollo'),
(6, 'CERRADO_POR_RESPONSABLE', 'Cerrado por Responsable'),
(7, 'REABIERTO', 'Reabierto'),
(8, 'CANCELADO', 'Cancelado');

INSERT INTO `constancia` (`con_id`, `con_codigo`, `con_nombre`) VALUES
(1, 'NO_APLICA', 'No Aplica'),
(2, 'PENDIENTE_DE_ACTA', 'Pendiente de Acta'),
(3, 'EN_ACTA_GENERADA', 'En Acta Generada'),
(4, 'ACTA_FIRMADA_CARGADA', 'Acta Firmada Cargada');

INSERT INTO `situacion` (`sit_id`, `sit_codigo`, `sit_nombre`) VALUES
(1, 'GENERADA', 'Generada'),
(2, 'PENDIENTE_DE_FIRMA', 'Pendiente de Firma'),
(3, 'CARGADA', 'Cargada'),
(4, 'OBSERVADA', 'Observada');

INSERT INTO `prioridad` (`pri_id`, `pri_codigo`, `pri_nombre`) VALUES
(1, 'BAJA', 'Baja'),
(2, 'MEDIA', 'Media'),
(3, 'ALTA', 'Alta'),
(4, 'CRITICA', 'Crítica');

INSERT INTO `solicitud` (`sol_id`, `sol_codigo`, `sol_nombre`) VALUES
(1, 'ERROR', 'Error'),
(2, 'AJUSTE_DE_INFORMACION', 'Ajuste de Información'),
(3, 'MEJORA', 'Mejora'),
(4, 'NUEVA_FUNCIONALIDAD', 'Nueva Funcionalidad'),
(5, 'CAMBIO_SOLICITADO', 'Cambio Solicitado'),
(6, 'INCIDENTE', 'Incidente'),
(7, 'SOPORTE_OPERATIVO', 'Soporte Operativo');

INSERT INTO `rol` (`rol_id`, `rol_codigo`, `rol_nombre`) VALUES
(1, 'ADMINISTRADOR', 'Administrador'),
(2, 'RESPONSABLE_DE_SISTEMA', 'Responsable de Sistema'),
(3, 'DESARROLLADOR', 'Desarrollador'),
(4, 'JEFE_DE_AREA', 'Jefe de Área'),
(5, 'CONSULTA', 'Consulta');

INSERT INTO `clase` (`cla_id`, `cla_codigo`, `cla_nombre`) VALUES
(1, 'EVIDENCIA_INICIAL', 'Evidencia Inicial'),
(2, 'EVIDENCIA_FINAL', 'Evidencia Final'),
(3, 'EVIDENCIA_DE_REAPERTURA', 'Evidencia de Reapertura'),
(4, 'EVIDENCIA_DE_SEGUIMIENTO', 'Evidencia de Seguimiento'),
(5, 'ACTA_GENERADA', 'Acta Generada'),
(6, 'ACTA_FIRMADA', 'Acta Firmada'),
(7, 'ANEXO', 'Anexo');
