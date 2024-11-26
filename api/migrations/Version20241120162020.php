<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241120162020 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_invitation ADD user_invite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_invitation ADD CONSTRAINT FK_567AA74EEAA1FAA3 FOREIGN KEY (user_invite_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_567AA74EEAA1FAA3 ON user_invitation (user_invite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE user_invitation DROP CONSTRAINT FK_567AA74EEAA1FAA3');
        $this->addSql('DROP INDEX IDX_567AA74EEAA1FAA3');
        $this->addSql('ALTER TABLE user_invitation DROP user_invite_id');
    }
}
