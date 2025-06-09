<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250609003259 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE INDEX IDX_BC31FD134A7843DC ON exposition (catalogue_id)');
        $this->addSql('ALTER TABLE medias ADD published TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE medias DROP published');
        $this->addSql('ALTER TABLE exposition DROP FOREIGN KEY FK_BC31FD134A7843DC');
        $this->addSql('DROP INDEX IDX_BC31FD134A7843DC ON exposition');
    }
}
