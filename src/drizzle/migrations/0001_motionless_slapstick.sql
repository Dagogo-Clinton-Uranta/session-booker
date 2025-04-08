DROP INDEX "userIdIndex";--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "clerkUserId" text;--> statement-breakpoint
CREATE INDEX "clerkUserIdIndex" ON "events" USING btree ("clerkUserId");--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_clerkUserId_unique" UNIQUE("clerkUserId");