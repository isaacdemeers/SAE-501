<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241119102427 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE user_event_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE user_event (id INT NOT NULL, event_id INT NOT NULL, user_id_id INT DEFAULT NULL, role VARCHAR(255) NOT NULL, user_email VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D96CF1FF71F7E88B ON user_event (event_id)');
        $this->addSql('CREATE INDEX IDX_D96CF1FF9D86650F ON user_event (user_id_id)');
        $this->addSql('ALTER TABLE user_event ADD CONSTRAINT FK_D96CF1FF71F7E88B FOREIGN KEY (event_id) REFERENCES event (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_event ADD CONSTRAINT FK_D96CF1FF9D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE user_event_id_seq CASCADE');
        $this->addSql('ALTER TABLE user_event DROP CONSTRAINT FK_D96CF1FF71F7E88B');
        $this->addSql('ALTER TABLE user_event DROP CONSTRAINT FK_D96CF1FF9D86650F');
        $this->addSql('DROP TABLE user_event');
    }
}
