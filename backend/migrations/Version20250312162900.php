<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250312162900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE oeuvre ADD exposition_id_id INT DEFAULT NULL, ADD evenement_id_id INT DEFAULT NULL, DROP exposition_id, DROP evenement_id, CHANGE artiste_id artiste_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE oeuvre ADD CONSTRAINT FK_35FE2EFEB6D84A9 FOREIGN KEY (artiste_id_id) REFERENCES artiste (id)');
        $this->addSql('ALTER TABLE oeuvre ADD CONSTRAINT FK_35FE2EFE44490EA2 FOREIGN KEY (exposition_id_id) REFERENCES exposition (id)');
        $this->addSql('ALTER TABLE oeuvre ADD CONSTRAINT FK_35FE2EFEECEE32AF FOREIGN KEY (evenement_id_id) REFERENCES evenement (id)');
        $this->addSql('CREATE INDEX IDX_35FE2EFEB6D84A9 ON oeuvre (artiste_id_id)');
        $this->addSql('CREATE INDEX IDX_35FE2EFE44490EA2 ON oeuvre (exposition_id_id)');
        $this->addSql('CREATE INDEX IDX_35FE2EFEECEE32AF ON oeuvre (evenement_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE oeuvre DROP FOREIGN KEY FK_35FE2EFEB6D84A9');
        $this->addSql('ALTER TABLE oeuvre DROP FOREIGN KEY FK_35FE2EFE44490EA2');
        $this->addSql('ALTER TABLE oeuvre DROP FOREIGN KEY FK_35FE2EFEECEE32AF');
        $this->addSql('DROP INDEX IDX_35FE2EFEB6D84A9 ON oeuvre');
        $this->addSql('DROP INDEX IDX_35FE2EFE44490EA2 ON oeuvre');
        $this->addSql('DROP INDEX IDX_35FE2EFEECEE32AF ON oeuvre');
        $this->addSql('ALTER TABLE oeuvre ADD exposition_id INT DEFAULT NULL, ADD evenement_id INT DEFAULT NULL, DROP exposition_id_id, DROP evenement_id_id, CHANGE artiste_id_id artiste_id INT NOT NULL');
    }
}
