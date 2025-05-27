import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUuidFKs1748372355004 implements MigrationInterface {
  name = 'FixUuidFKs1748372355004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "nickname" character varying NOT NULL, "password_hash" character varying NOT NULL, "google_2fa_secret" character varying, "is_2fa_enabled" boolean NOT NULL DEFAULT false, "group_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "type_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "UQ_82231175ab7d4a8acd363eae667" UNIQUE ("name"), CONSTRAINT "PK_232576669c4df1f0a15e1300ce2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submission_id" uuid NOT NULL, "file_path" character varying NOT NULL, "original_filename" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "task_id" uuid NOT NULL, "file_path" character varying NOT NULL, "original_filename" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_user_id" uuid NOT NULL, "to_user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "friendships" ("user_id" uuid NOT NULL, "friend_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8e4ede8e2df44f3f21f557d379" PRIMARY KEY ("user_id", "friend_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user1_id" uuid NOT NULL, "user2_id" uuid NOT NULL, "tmdb_movie_id" integer NOT NULL, "matched_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c71a3a541f6bd1dfcb9e702f94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_a3405e60f0cbc9980bd07eb4f72" FOREIGN KEY ("type_id") REFERENCES "task_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_bd46773d489799c35febeaefb16" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_777fd1f8e4c40e606e1ce24974a" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_5e9a1caaf3e22527e20256ef724" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_8085211f8c9a14a68cc82ff134d" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" ADD CONSTRAINT "FK_c73eec6c7e7d5d1f2b3ce8b9002" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" ADD CONSTRAINT "FK_972c6bdd4bc18dda48b8aa4714c" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_matches" ADD CONSTRAINT "FK_0b3a3fd6f9caaddea03de305d9b" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_matches" ADD CONSTRAINT "FK_cc439fc2014fd016cb5d1adb096" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_matches" DROP CONSTRAINT "FK_cc439fc2014fd016cb5d1adb096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_matches" DROP CONSTRAINT "FK_0b3a3fd6f9caaddea03de305d9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" DROP CONSTRAINT "FK_972c6bdd4bc18dda48b8aa4714c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" DROP CONSTRAINT "FK_c73eec6c7e7d5d1f2b3ce8b9002"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_8085211f8c9a14a68cc82ff134d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_5e9a1caaf3e22527e20256ef724"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_777fd1f8e4c40e606e1ce24974a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_bd46773d489799c35febeaefb16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_a3405e60f0cbc9980bd07eb4f72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0"`,
    );
    await queryRunner.query(`DROP TABLE "movie_matches"`);
    await queryRunner.query(`DROP TABLE "friendships"`);
    await queryRunner.query(`DROP TABLE "friend_requests"`);
    await queryRunner.query(`DROP TABLE "submissions"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TABLE "task_types"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "groups"`);
  }
}
