/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'admin'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "admin" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "userId" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "adminRequest" ADD COLUMN "userName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "adminRequest" ADD COLUMN "userId" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "adminRequest" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "adminRequest" DROP COLUMN "email";