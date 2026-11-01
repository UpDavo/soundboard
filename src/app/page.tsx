import { Suspense } from "react";
import { connection } from "next/server";
import { soundboardService } from "@/services/soundboard.service";
import { StoreProvider } from "@/store/StoreProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlayerDock, SoundBoard, SoundBoardSkeleton } from "@/components/sound";

/**
 * Lee audios + data/soundboard.json en cada request:
 * agregar un .mp3/.m4a o editar el json solo requiere recargar.
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
      <PlayerDock />
      {/* pb deja espacio a los flotantes de abajo (en mobile van apilados). */}
      <main className="flex w-full flex-col gap-6 px-4 pt-4 pb-48 sm:px-6 sm:pt-6 md:pb-32">
        <PageHeader title="Soundboard" />
        <Suspense fallback={<SoundBoardSkeleton />}>
          <Board />
        </Suspense>
      </main>
    </>
  );
}
