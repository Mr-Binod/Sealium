ALTER TABLE "admin" ADD COLUMN "nickName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "password" varchar(100);--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "birthDate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "address" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "imgPath" varchar(255);--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "walletAddress" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "didAddress" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "role" varchar(255) DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "did";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "level";