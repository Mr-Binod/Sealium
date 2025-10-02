ALTER TABLE "user_vc" ADD COLUMN "ImagePath" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_vc" ADD COLUMN "DOB" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vc_confirmed_logs" ADD COLUMN "ImagePath" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vc_confirmed_logs" ADD COLUMN "DOB" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vc_request_logs" ADD COLUMN "ImagePath" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vc_request_logs" ADD COLUMN "DOB" varchar(255) NOT NULL;