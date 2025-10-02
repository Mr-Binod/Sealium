CREATE TABLE "userStats" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"loginAt" timestamp DEFAULT now(),
	"logoutAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "userStats" ADD CONSTRAINT "userStats_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;