-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.21.0.7344
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para whatsapp
CREATE DATABASE IF NOT EXISTS `whatsapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `whatsapp`;

-- Copiando estrutura para tabela whatsapp.mensagens
CREATE TABLE IF NOT EXISTS `mensagens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefone_remetente` varchar(20) NOT NULL,
  `telefone_destino` varchar(20) NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `telefone_remetente` (`telefone_remetente`,`telefone_destino`),
  KEY `fk_mensagem_destino` (`telefone_destino`),
  CONSTRAINT `fk_mensagem_destino` FOREIGN KEY (`telefone_destino`) REFERENCES `utilizadores` (`telefone`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensagem_remetente` FOREIGN KEY (`telefone_remetente`) REFERENCES `utilizadores` (`telefone`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela whatsapp.mensagens: ~5 rows (aproximadamente)
INSERT INTO `mensagens` (`id`, `telefone_remetente`, `telefone_destino`, `mensagem`, `data_envio`) VALUES
	(1, '10987654321', '12345678910', 'salve', '2026-10-16 17:53:29'),
	(2, '10987654321', '12345678910', 'https://gemini.google.com/app/ca35bcbdbe01d890?hl=pt-BR', '2026-10-16 17:54:05'),
	(3, '10987654321', '12345678910', 'oi', '2026-10-16 17:55:23'),
	(4, '12345678910', '10987654321', 'slk', '2026-10-16 17:55:31'),
	(5, '147258369', '12345678910', 'salve', '2026-10-16 18:36:44');

-- Copiando estrutura para tabela whatsapp.utilizadores
CREATE TABLE IF NOT EXISTS `utilizadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apelido` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `telefone` (`telefone`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela whatsapp.utilizadores: ~3 rows (aproximadamente)
INSERT INTO `utilizadores` (`id`, `apelido`, `telefone`, `senha`, `criado_em`) VALUES
	(13, 'Fallen', '12345678910', '1234', '2026-10-16 17:50:40'),
	(14, 'Igor', '10987654321', '4321', '2026-10-16 17:51:21'),
	(15, 'davi', '147258369', '5432', '2026-10-16 18:36:23');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
