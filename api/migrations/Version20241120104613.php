<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241120104613 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('COMMENT ON COLUMN event.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE "user" ADD visibility SMALLINT NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER firstname DROP NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER lastname DROP NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER username DROP NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER emailverify DROP NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER emaillink DROP NOT NULL');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE user_event DROP user_email');
        $this->addSql('ALTER TABLE user_invitation ADD user_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_invitation ADD date_invitation TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE user_invitation ADD date_acceptinvitation TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE user_invitation DROP email');
        $this->addSql('ALTER TABLE user_invitation ADD CONSTRAINT FK_567AA74E9D86650F FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_567AA74E9D86650F ON user_invitation (user_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE user_event ADD user_email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user_invitation DROP CONSTRAINT FK_567AA74E9D86650F');
        $this->addSql('DROP INDEX IDX_567AA74E9D86650F');
        $this->addSql('ALTER TABLE user_invitation ADD email VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user_invitation DROP user_id_id');
        $this->addSql('ALTER TABLE user_invitation DROP date_invitation');
        $this->addSql('ALTER TABLE user_invitation DROP date_acceptinvitation');
        $this->addSql('ALTER TABLE "user" DROP visibility');
        $this->addSql('ALTER TABLE "user" DROP deleted_at');
        $this->addSql('ALTER TABLE "user" DROP created_at');
        $this->addSql('ALTER TABLE "user" ALTER firstname SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER lastname SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER username SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER emailverify SET NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER emaillink SET NOT NULL');
        $this->addSql('ALTER TABLE event DROP created_at');
    }
}
