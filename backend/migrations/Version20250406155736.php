<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250406155736 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE evenement_artiste (evenement_id INT NOT NULL, artiste_id INT NOT NULL, INDEX IDX_9F022293FD02F13 (evenement_id), INDEX IDX_9F02229321D25844 (artiste_id), PRIMARY KEY(evenement_id, artiste_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE evenement_artiste ADD CONSTRAINT FK_9F022293FD02F13 FOREIGN KEY (evenement_id) REFERENCES evenement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE evenement_artiste ADD CONSTRAINT FK_9F02229321D25844 FOREIGN KEY (artiste_id) REFERENCES artiste (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evenement_artiste DROP FOREIGN KEY FK_9F022293FD02F13');
        $this->addSql('ALTER TABLE evenement_artiste DROP FOREIGN KEY FK_9F02229321D25844');
        $this->addSql('DROP TABLE evenement_artiste');
    }
}
