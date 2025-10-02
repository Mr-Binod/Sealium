CREATE TABLE "vclogs" (
	"id" serial NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"issueDate" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"issuerId" varchar(255) NOT NULL,
	"event" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adminrequest" (
	"id" serial NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) PRIMARY KEY NOT NULL,
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
DROP TABLE "vcprovider" CASCADE;--> statement-breakpoint
DROP TABLE "adminRequest" CASCADE;