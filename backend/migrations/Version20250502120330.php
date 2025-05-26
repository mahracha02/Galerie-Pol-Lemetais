<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250502120330 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE actualites ADD exposition_id INT DEFAULT NULL, ADD evenement_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE actualites ADD CONSTRAINT FK_75315B6D88ED476F FOREIGN KEY (exposition_id) REFERENCES exposition (id)');
        $this->addSql('ALTER TABLE actualites ADD CONSTRAINT FK_75315B6DFD02F13 FOREIGN KEY (evenement_id) REFERENCES evenement (id)');
        $this->addSql('CREATE INDEX IDX_75315B6D88ED476F ON actualites (exposition_id)');
        $this->addSql('CREATE INDEX IDX_75315B6DFD02F13 ON actualites (evenement_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE actualites DROP FOREIGN KEY FK_75315B6D88ED476F');
        $this->addSql('ALTER TABLE actualites DROP FOREIGN KEY FK_75315B6DFD02F13');
        $this->addSql('DROP INDEX IDX_75315B6D88ED476F ON actualites');
        $this->addSql('DROP INDEX IDX_75315B6DFD02F13 ON actualites');
        $this->addSql('ALTER TABLE actualites DROP exposition_id, DROP evenement_id');
    }
}
