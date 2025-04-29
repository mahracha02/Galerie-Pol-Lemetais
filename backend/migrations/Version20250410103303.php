<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250410103303 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE exposition ADD CONSTRAINT FK_BC31FD13F9C86A29 FOREIGN KEY (artiste_principal_id) REFERENCES artiste (id)');
        $this->addSql('CREATE INDEX IDX_BC31FD13F9C86A29 ON exposition (artiste_principal_id)');
        $this->addSql('ALTER TABLE oeuvre DROP FOREIGN KEY FK_35FE2EFEB6D84A9');
        $this->addSql('DROP INDEX IDX_35FE2EFEB6D84A9 ON oeuvre');
        $this->addSql('ALTER TABLE oeuvre DROP artiste_id_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE oeuvre ADD artiste_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE oeuvre ADD CONSTRAINT FK_35FE2EFEB6D84A9 FOREIGN KEY (artiste_id_id) REFERENCES artiste (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_35FE2EFEB6D84A9 ON oeuvre (artiste_id_id)');
        $this->addSql('ALTER TABLE exposition DROP FOREIGN KEY FK_BC31FD13F9C86A29');
        $this->addSql('DROP INDEX IDX_BC31FD13F9C86A29 ON exposition');
    }
}
