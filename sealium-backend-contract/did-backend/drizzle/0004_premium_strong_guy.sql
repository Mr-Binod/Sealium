ALTER TABLE "user" ADD COLUMN "userName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "userId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "nickName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" varchar(100);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birthDate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "imgPath" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "walletAddress" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "didAddress" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "did";