-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "public"."Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "public"."Comment"("authorId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "public"."Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_published_idx" ON "public"."Post"("published");

-- CreateIndex
CREATE INDEX "Post_authorId_createdAt_idx" ON "public"."Post"("authorId", "createdAt");
