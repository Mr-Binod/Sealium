CREATE TABLE "did_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"did_id" serial NOT NULL,
	"document" text NOT NULL,
	"version" varchar(10) DEFAULT '1.0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dids" (
	"id" serial PRIMARY KEY NOT NULL,
	"did" varchar(255) NOT NULL,
	"address" varchar(42) NOT NULL,
	"private_key" text NOT NULL,
	"domain" varchar(255),
	"salt" varchar(255),
	"chain_name" varchar(50) DEFAULT 'sepolia',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "dids_did_unique" UNIQUE("did")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"did_id" serial NOT NULL,
	"type" varchar(100) NOT NULL,
	"service_endpoint" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verification_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"did_id" serial NOT NULL,
	"type" varchar(50) NOT NULL,
	"controller" varchar(255) NOT NULL,
	"public_key_hex" text,
	"public_key_base58" text,
	"public_key_jwk" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "did_documents" ADD CONSTRAINT "did_documents_did_id_dids_id_fk" FOREIGN KEY ("did_id") REFERENCES "public"."dids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_did_id_dids_id_fk" FOREIGN KEY ("did_id") REFERENCES "public"."dids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_methods" ADD CONSTRAINT "verification_methods_did_id_dids_id_fk" FOREIGN KEY ("did_id") REFERENCES "public"."dids"("id") ON DELETE no action ON UPDATE no action;