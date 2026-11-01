import { Suspense } from "react";
import { connection } from "next/server";
import { soundboardService } from "@/services/soundboard.service";
import { StoreProvider } from "@/store/StoreProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { NowPlayingBubble, SoundBoard, SoundBoardSkeleton, VolumeCard } from "@/components/sound";

/**
 * Lee mp3 + data/soundboard.json en cada request:
 * agregar un .mp3 o editar el txt solo requiere recargar.
 */
async function Board() {
  await connection();
  const { sounds, favoriteIds } = soundboardService.get();
  return (
    <StoreProvider initialState={{ sounds, favoriteIds }}>
      <SoundBoard />
    </StoreProvider>
  );
}

export default function Home() {
  return (
    <>
      <NowPlayingBubble />
      <main className="flex w-full flex-col gap-6 px-4 pt-4 pb-28 sm:px-6 sm:pt-6">
        <PageHeader
          title="Soundboard"
          actions={<VolumeCard className="w-full sm:w-[280px]" />}
        />
        <Suspense fallback={<SoundBoardSkeleton />}>
          <Board />
        </Suspense>
      </main>
    </>
  );
}
