<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241119144357 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE user_invitation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE user_invitation (id INT NOT NULL, event_id INT NOT NULL, email VARCHAR(255) NOT NULL, link VARCHAR(255) NOT NULL, expiration TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_567AA74E71F7E88B ON user_invitation (event_id)');
        $this->addSql('ALTER TABLE user_invitation ADD CONSTRAINT FK_567AA74E71F7E88B FOREIGN KEY (event_id) REFERENCES event (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_event DROP CONSTRAINT fk_d96cf1ff9d86650f');
        $this->addSql('DROP INDEX idx_d96cf1ff9d86650f');
        $this->addSql('ALTER TABLE user_event RENAME COLUMN user_id_id TO user_id');
        $this->addSql('ALTER TABLE user_event ADD CONSTRAINT FK_D96CF1FFA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_D96CF1FFA76ED395 ON user_event (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE user_invitation_id_seq CASCADE');
        $this->addSql('ALTER TABLE user_invitation DROP CONSTRAINT FK_567AA74E71F7E88B');
        $this->addSql('DROP TABLE user_invitation');
        $this->addSql('ALTER TABLE user_event DROP CONSTRAINT FK_D96CF1FFA76ED395');
        $this->addSql('DROP INDEX IDX_D96CF1FFA76ED395');
        $this->addSql('ALTER TABLE user_event RENAME COLUMN user_id TO user_id_id');
        $this->addSql('ALTER TABLE user_event ADD CONSTRAINT fk_d96cf1ff9d86650f FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_d96cf1ff9d86650f ON user_event (user_id_id)');
    }
}
