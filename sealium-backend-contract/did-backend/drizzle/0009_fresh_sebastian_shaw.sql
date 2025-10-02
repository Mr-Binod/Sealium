CREATE TABLE "adminRequest" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"password" varchar(100),
	"nickName" varchar(255),
	"birthDate" varchar NOT NULL,
	"phoneNumber" varchar(20) NOT NULL,
	"grade" integer DEFAULT 0 NOT NULL,
	"imgPath" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "did_documents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "dids" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification_methods" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "did_documents" CASCADE;--> statement-breakpoint
DROP TABLE "dids" CASCADE;--> statement-breakpoint
DROP TABLE "services" CASCADE;--> statement-breakpoint
DROP TABLE "verification_methods" CASCADE;--> statement-breakpoint
ALTER TABLE "admin" ALTER COLUMN "birthDate" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "birthDate" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "vcprovider" ADD COLUMN "issuerId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "grade" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "role";