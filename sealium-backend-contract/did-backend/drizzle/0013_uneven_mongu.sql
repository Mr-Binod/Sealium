CREATE TABLE "user_vc" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"userDidId" varchar(255) NOT NULL,
	"issuerId" varchar(255) NOT NULL,
	"issuerDidId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"requestDate" varchar(255) NOT NULL,
	"issueDate" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vc_confirmed_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"issueDate" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"request" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"issuerId" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vc_request_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"certificateName" varchar(255) NOT NULL,
	"issueDate" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"request" varchar(255) NOT NULL,
	"status" varchar(255) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"password" varchar(100),
	"nickName" varchar(255),
	"birthDate" varchar NOT NULL,
	"phoneNumber" varchar(20) NOT NULL,
	"grade" integer DEFAULT 0 NOT NULL,
	"imgPath" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_request_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "uservc" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vclogs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "adminrequest" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "uservc" CASCADE;--> statement-breakpoint
DROP TABLE "vclogs" CASCADE;--> statement-breakpoint
DROP TABLE "adminrequest" CASCADE;--> statement-breakpoint
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
ALTER TABLE "admin" ADD PRIMARY KEY ("id");--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'user'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "user" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "user_vc" ADD CONSTRAINT "user_vc_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vc_confirmed_logs" ADD CONSTRAINT "vc_confirmed_logs_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vc_request_logs" ADD CONSTRAINT "vc_request_logs_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_unique" UNIQUE("userId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_userId_unique" UNIQUE("userId");