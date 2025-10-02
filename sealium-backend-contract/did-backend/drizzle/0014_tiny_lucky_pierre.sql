ALTER TABLE "vc_request_logs" ADD COLUMN "requestDate" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "vc_request_logs" DROP COLUMN "issueDate";