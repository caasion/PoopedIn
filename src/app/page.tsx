"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import FeedList from "@/components/feed/FeedList";

export default function HomePage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <AppShell
      left={<LeftSidebar onDropPoop={() => setCreateModalOpen(true)} />}
      right={<RightSidebar />}
    >
      <FeedList
        isCreateModalOpen={isCreateModalOpen}
        onModalOpen={() => setCreateModalOpen(true)}
        onModalClose={() => setCreateModalOpen(false)}
      />
    </AppShell>
  );
}
