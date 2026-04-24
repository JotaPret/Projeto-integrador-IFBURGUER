-- Adiciona a coluna `fotoPerfil` em `usuarios` sem derrubar dados.
-- Compatível com MySQL/MariaDB usando INFORMATION_SCHEMA.

SET @col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'usuarios'
    AND COLUMN_NAME = 'fotoPerfil'
);

SET @stmt := IF(
  @col_exists = 0,
  'ALTER TABLE `usuarios` ADD COLUMN `fotoPerfil` TEXT NULL;',
  'SELECT 1;'
);

PREPARE s FROM @stmt;
EXECUTE s;
DEALLOCATE PREPARE s;
