ALTER TABLE "uservc" ADD COLUMN "userDidId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "uservc" ADD COLUMN "issuerId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "uservc" ADD COLUMN "issuerDidId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "uservc" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "uservc" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "uservc" DROP COLUMN "didAddress";