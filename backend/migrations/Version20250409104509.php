<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250409104509 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE exposition_artiste (exposition_id INT NOT NULL, artiste_id INT NOT NULL, INDEX IDX_5C388FE88ED476F (exposition_id), INDEX IDX_5C388FE21D25844 (artiste_id), PRIMARY KEY(exposition_id, artiste_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE exposition_artiste ADD CONSTRAINT FK_5C388FE88ED476F FOREIGN KEY (exposition_id) REFERENCES exposition (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE exposition_artiste ADD CONSTRAINT FK_5C388FE21D25844 FOREIGN KEY (artiste_id) REFERENCES artiste (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE exposition_artiste DROP FOREIGN KEY FK_5C388FE88ED476F');
        $this->addSql('ALTER TABLE exposition_artiste DROP FOREIGN KEY FK_5C388FE21D25844');
        $this->addSql('DROP TABLE exposition_artiste');
    }
}
