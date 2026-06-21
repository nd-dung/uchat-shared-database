CREATE INDEX "facilities_status_idx" ON "facilities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_facility_id_idx" ON "users" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");