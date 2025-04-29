<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250409123122 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evenement ADD artiste_principal_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681EF9C86A29 FOREIGN KEY (artiste_principal_id) REFERENCES artiste (id)');
        $this->addSql('CREATE INDEX IDX_B26681EF9C86A29 ON evenement (artiste_principal_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681EF9C86A29');
        $this->addSql('DROP INDEX IDX_B26681EF9C86A29 ON evenement');
        $this->addSql('ALTER TABLE evenement DROP artiste_principal_id');
    }
}
