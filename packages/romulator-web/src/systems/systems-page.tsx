import { ZGridView } from "@zthun/fashion-boutique";
import { ZRomulatorSystemCard } from "./system-card";
import { useSystemsService } from "./systems-service.mjs";

export function ZRomulatorSystemsPage() {
  const source = useSystemsService();

  return (
    <ZGridView
      className="ZRomulatorSystemsPage-root"
      dataSource={source}
      renderItem={(s) => <ZRomulatorSystemCard key={s.id} system={s} />}
    />
  );
}
