import {
  useFashionTheme,
  useNavigate,
  ZButton,
  ZGridView,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZRomulatorSystemAvatarCard } from "./system-avatar-card";
import { useSystemsService } from "./systems-service.mjs";

export function ZRomulatorSystemsPage() {
  const { secondary } = useFashionTheme();
  const navigate = useNavigate();
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
      renderItem={(s) => (
        <ZRomulatorSystemAvatarCard
          key={s.id}
          system={s}
          CardProps={{
            footer: (
              <ZButton
                fashion={secondary}
                label="More"
                name="more"
                width={ZSizeVaried.Full}
                onClick={() => navigate(`/systems/${s.id}`)}
              />
            ),
          }}
        />
      )}
    />
  );
}
