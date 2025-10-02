CREATE TABLE "admin_rejected" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"password" varchar(100),
	"nickName" varchar(255),
	"birthDate" varchar NOT NULL,
	"grade" integer DEFAULT 10 NOT NULL,
	"imgPath" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_rejected_userId_unique" UNIQUE("userId")
);
