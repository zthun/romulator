import { ZGridView } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZRomulatorSystemCard } from "./system-card";
import { useSystemsService } from "./systems-service.mjs";

export function ZRomulatorSystemsPage() {
  const source = useSystemsService();

  return (
    <ZGridView
      className="ZRomulatorSystemsPage-root"
      GridProps={{
        columns: {
          xl: "1fr 1fr 1fr 1fr",
          lg: "1fr 1fr 1fr",
          md: "1fr 1fr",
          sm: "1fr",
        },
        gap: ZSizeFixed.Medium,
      }}
      dataSource={source}
      renderItem={(s) => <ZRomulatorSystemCard key={s.id} system={s} />}
    />
  );
}
