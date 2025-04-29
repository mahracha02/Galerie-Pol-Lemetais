<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250409123558 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE exposition ADD artiste_principal_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE exposition ADD CONSTRAINT FK_BC31FD13F9C86A29 FOREIGN KEY (artiste_principal_id) REFERENCES artiste (id)');
        $this->addSql('CREATE INDEX IDX_BC31FD13F9C86A29 ON exposition (artiste_principal_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE exposition DROP FOREIGN KEY FK_BC31FD13F9C86A29');
        $this->addSql('DROP INDEX IDX_BC31FD13F9C86A29 ON exposition');
        $this->addSql('ALTER TABLE exposition DROP artiste_principal_id');
    }
}
