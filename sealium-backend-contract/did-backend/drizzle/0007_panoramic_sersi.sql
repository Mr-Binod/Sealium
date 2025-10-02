CREATE TABLE "uservc" (
	"id" serial NOT NULL,
	"userId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"didAddress" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vcprovider" (
	"id" serial NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"issueDate" integer NOT NULL,
	"event" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL
);
