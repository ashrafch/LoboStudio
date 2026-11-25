import { useState } from "react";
import { ServicePhoto } from "@/components/service-photo";
import {
  services,
  servicePhoto,
  type ServicePhotoOverrides,
} from "@/content/services";
import { MediaPicker, type Choice } from "./media-picker";

export function ServicePhotos({
  photos,
  update,
  library,
  editing,
}: {
  photos: ServicePhotoOverrides;
  update: (next: ServicePhotoOverrides) => void;
  library: Choice[];
  editing: boolean;
}) {
  const [selected, setSelected] = useState(services[0].id);
  const service = services.find((item) => item.id === selected)!;
  const photo = servicePhoto(service, photos);
  const override = photos[selected];
  function restore() {
    const next = { ...photos };
    delete next[selected];
    update(next);
  }
  return (
    <section className="service-photo-editor">
      <h3>Foto delle attività</h3>
      <p>
        La stessa foto accompagna l’attività nella Home e nella pagina Servizi.
      </p>
      <label>
        Attività
        <select
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      {photo ? (
        <ServicePhoto photo={photo} sizes="(max-width: 680px) 85vw, 544px" />
      ) : (
        <p>Attività senza foto.</p>
      )}
      {editing && (
        <>
          <MediaPicker
            media={library}
            selected={override?.image ?? ""}
            label="Scegli dalla libreria"
            pick={(item) =>
              update({
                ...photos,
                [selected]: item
                  ? {
                      image: item.id,
                      alt: override?.image === item.id ? override.alt : "",
                    }
                  : null,
              })
            }
          />
          {override && (
            <label>
              Descrizione della foto
              <input
                value={override.alt}
                maxLength={250}
                placeholder="Descrivi ciò che si vede"
                onChange={(event) =>
                  update({
                    ...photos,
                    [selected]: { ...override, alt: event.target.value },
                  })
                }
              />
            </label>
          )}
          <div className="service-photo-actions">
            {photo && (
              <button
                type="button"
                onClick={() => update({ ...photos, [selected]: null })}
              >
                Rimuovi foto
              </button>
            )}
            {override !== undefined && (
              <button type="button" onClick={restore}>
                Ripristina foto iniziale
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
